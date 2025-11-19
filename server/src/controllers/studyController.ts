import { Response } from "express";
import Card from "../models/Card";
import ReviewHistory from "../models/ReviewHistory";
import { AuthRequest } from "../middlewares/auth.middleware";
import { calculateNextReview, shuffleArray } from "../services/srsService";
import gamificationService from "../services/gamificationService";
import cacheService from "../services/cacheService";
import * as redisOps from "../services/redisOperations";
import { io } from "../server";
import User from "../models/User";
import { getTodayDateKey, getTodayBounds } from "../utils/dateHelper";

// @desc    Lấy danh sách thẻ cần ôn tập hôm nay
// @route   GET /api/study/session?deckId=xxx (optional)
// @access  Private
export const getStudySession = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const limit = parseInt(req.query.limit as string) || 50;
    const deckId = req.query.deckId as string; // Optional: Lọc theo deck cụ thể

    // Try to get from cache first (Redis cache-aside pattern)
    const cachedCards = await cacheService.getCardsDue(
      userId as string,
      deckId,
      limit
    );

    let cards: any[];
    if (cachedCards && cachedCards.length > 0) {
      // Cache HIT - use cached cards
      cards = cachedCards;
    } else {
      // Cache MISS - query database (cacheService will cache the result)
      const query: any = {
        user_id: userId,
        "srs_status.next_review_at": { $lte: new Date() },
      };

      if (deckId) {
        query.deck_id = deckId;
      }

      cards = await Card.find(query)
        .populate("deck_id", "name")
        .limit(limit)
        .lean(); // Use .lean() for better performance
    }

    // Xáo trộn thứ tự (ưu tiên trộn thẻ mới và thẻ quên)
    const shuffledCards = shuffleArray(cards);

    // Phân loại thẻ
    const newCards = shuffledCards.filter(
      (card) => card.srs_status.interval === 0
    );
    const reviewCards = shuffledCards.filter(
      (card) => card.srs_status.interval > 0
    );

    res.status(200).json({
      success: true,
      message: "Study session loaded successfully",
      data: {
        total_cards: shuffledCards.length,
        new_cards_count: newCards.length,
        review_cards_count: reviewCards.length,
        cards: shuffledCards,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error loading study session",
      error: error.message,
    });
  }
};

// @desc    Đánh giá thẻ sau khi ôn tập (Core SRS Logic)
// @route   POST /api/study/review/:cardId
// @access  Private
export const reviewCard = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { cardId } = req.params;
    const { grade } = req.body;
    const userId = req.user?.id;

    // Validate grade (0-3)
    if (grade === undefined || grade < 0 || grade > 3) {
      res.status(400).json({
        success: false,
        message:
          "Grade must be between 0 and 3 (0=Again, 1=Hard, 2=Good, 3=Easy)",
      });
      return;
    }

    // Tìm thẻ
    const card = await Card.findById(cardId);

    if (!card) {
      res.status(404).json({
        success: false,
        message: "Card not found",
      });
      return;
    }

    // Kiểm tra quyền sở hữu
    if (card.user_id.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: "Not authorized to review this card",
      });
      return;
    }

    // ========================================
    // STEP 1: CALCULATE SRS (SM-2 Algorithm)
    // ========================================
    const oldInterval = card.srs_status.interval;
    const newSRSStatus = calculateNextReview(grade, card.srs_status);

    // Get timezone offset from request (default to UTC if not provided)
    // Frontend sends this based on: -new Date().getTimezoneOffset() / 60
    // Example: Vietnam = 7, US-EST = -5, UK = 0
    const timezoneOffset = req.body.timezoneOffset ?? 0;

    const todayKey = getTodayDateKey(timezoneOffset);
    console.log(`\n📝 ========== REVIEW CARD ==========`);
    console.log(`   User: ${userId}`);
    console.log(`   Card: ${cardId}`);
    console.log(`   Grade: ${grade}`);
    console.log(
      `   Timezone: UTC${timezoneOffset >= 0 ? "+" : ""}${timezoneOffset}`
    );
    console.log(`   Today (User): ${todayKey}`);
    console.log(`   New Interval: ${newSRSStatus.interval}d`);
    console.log(`====================================\n`);

    // ========================================
    // STEP 2: MONGODB WRITE (Source of Truth)
    // ========================================
    // Why we write to MongoDB first:
    // - MongoDB is the persistent source of truth
    // - If MongoDB fails, Redis cache becomes invalid
    // - If Redis fails, we can rebuild from MongoDB

    // Update card document
    card.srs_status = newSRSStatus;
    await card.save();

    // Create review history record
    const reviewDate = new Date();
    await ReviewHistory.create({
      user_id: userId,
      card_id: card._id,
      deck_id: card.deck_id,
      grade,
      review_date: reviewDate,
      interval_before: oldInterval,
      interval_after: newSRSStatus.interval,
    });

    console.log(`✅ MongoDB write complete at ${reviewDate.toISOString()}`);

    // ========================================
    // STEP 3: REDIS ATOMIC TRANSACTION
    // ========================================
    // Why transaction (MULTI/EXEC)?
    // - Ensures all Redis updates happen atomically (all-or-nothing)
    // - Prevents race conditions when multiple reviews happen concurrently
    // - Example race: Two reviews increment counter separately = correct total
    //   But if done non-atomically: Read (5) -> Read (5) -> Write (6) -> Write (6) = WRONG!
    // - INCR command in transaction prevents this

    const nextReviewTimestamp = newSRSStatus.next_review_at.getTime();

    const redisUpdate = await redisOps.updateAfterReview(
      userId as string,
      cardId,
      nextReviewTimestamp,
      timezoneOffset
    );

    // If Redis fails, log but continue (MongoDB is source of truth)
    if (!redisUpdate.success) {
      console.warn(
        `⚠️  Redis transaction failed for user ${userId} - stats will be rebuilt from MongoDB on next request`
      );
    }

    // Calculate streak (separate operation, not critical for review)
    const streakData = await redisOps.calculateAndCacheStreak(
      userId as string,
      timezoneOffset
    );

    // Invalidate cached stats (they'll be recomputed on next GET /stats)
    await redisOps.invalidateUserStats(userId as string);

    // ========================================
    // GAMIFICATION
    // ========================================

    const xpGained = grade === 0 ? 1 : grade === 1 ? 3 : grade === 2 ? 5 : 8;
    const xpResult = await gamificationService.addXP(
      userId as string,
      xpGained
    );

    // Also increment daily XP in Redis
    await redisOps.incrementDailyXP(userId as string, xpGained, timezoneOffset);

    // Emit real-time event if user leveled up
    if (xpResult.leveledUp) {
      io.to(`user:${userId}`).emit("level-up", {
        newLevel: xpResult.newLevel,
        totalXP: xpResult.newXP,
        xpNeeded: xpResult.xpNeededForNextLevel,
        currency: xpResult.newLevel * 10, // User earned currency
        confetti: true, // Trigger confetti on client
      });
      console.log(
        `🎊 Level-up event emitted to user:${userId} (Level ${xpResult.newLevel})`
      );
    }

    // ========================================
    // STEP 4: RESPONSE WITH UPDATED STATS
    // ========================================

    // Get user's daily goal
    const user = await User.findById(userId).select("daily_goal");
    const dailyGoal = user?.daily_goal || 20;
    const progressPercentage = Math.min(
      100,
      Math.round((redisUpdate.dailyCount / dailyGoal) * 100)
    );

    res.status(200).json({
      success: true,
      message: "Card reviewed successfully",
      data: {
        card_id: card._id,
        new_interval: newSRSStatus.interval,
        new_ease_factor: newSRSStatus.ease_factor,
        next_review_at: newSRSStatus.next_review_at,
        grade_submitted: grade,
        daily_progress: {
          cards_studied_today: redisUpdate.dailyCount,
          cards_due_today: redisUpdate.dueCount,
          daily_goal: dailyGoal,
          progress_percentage: progressPercentage,
          goal_completed: redisUpdate.dailyCount >= dailyGoal,
        },
        streak: {
          current: streakData.current,
          longest: streakData.longest,
        },
        gamification: {
          xp_gained: xpResult.xpGained,
          total_xp: xpResult.newXP,
          leveled_up: xpResult.leveledUp,
          new_level: xpResult.newLevel,
          xp_needed_for_next_level: xpResult.xpNeededForNextLevel,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error reviewing card",
      error: error.message,
    });
  }
};

// @desc    Lấy thống kê học tập với Write-Through Caching
// @route   GET /api/study/stats?timezoneOffset=7
// @access  Private
export const getStudyStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    // Get timezone from query (frontend should send based on user's location)
    const timezoneOffset = parseInt(req.query.timezoneOffset as string) || 0;

    const todayKey = getTodayDateKey(timezoneOffset);
    console.log(`\n📊 ========== GET STUDY STATS ==========`);
    console.log(`   User: ${userId}`);
    console.log(
      `   Timezone: UTC${timezoneOffset >= 0 ? "+" : ""}${timezoneOffset}`
    );
    console.log(`   Today (User): ${todayKey}`);
    console.log(`========================================\n`);

    // ========================================
    // STEP 1: TRY REDIS FIRST (Fast Path)
    // ========================================
    // Why Redis first?
    // - Sub-millisecond response time (vs 10-100ms MongoDB aggregation)
    // - Daily counters are always accurate (updated atomically on review)
    // - Due queue is real-time (Sorted Set sorted by timestamp)

    // Get daily counters (these are always fresh, not part of cached stats)
    const cardsStudiedToday = await redisOps.getDailyCount(
      userId as string,
      timezoneOffset
    );
    const dueCount = await redisOps.getDueCardsCount(userId as string);

    console.log(
      `🔑 Redis counters: ${cardsStudiedToday} studied today (${todayKey}), ${dueCount} due`
    );

    // Get cached stats (these are computed stats that don't change often)
    const cachedStats = await redisOps.getCachedStats(userId as string);

    if (cachedStats) {
      // CACHE HIT - Return fast
      const streakData = await redisOps.getStreak(userId as string);

      console.log(`✅ Cache HIT - Full stats available`);

      res.status(200).json({
        success: true,
        message: "Study stats loaded from cache",
        stats: {
          ...cachedStats,
          cards_studied_today: cardsStudiedToday, // Always from Redis counter
          cards_due_today: dueCount, // Always from Redis sorted set
          current_streak: streakData?.current || 0,
          longest_streak: streakData?.longest || 0,
        },
      });
      return;
    }

    // ========================================
    // STEP 2: CACHE MISS - FALLBACK TO MONGODB
    // ========================================
    // Why this happens:
    // - First request after cache expiration (5 min TTL)
    // - Cache invalidation after review
    // - Redis was restarted/cleared

    console.log(`📦 Cache MISS - Rebuilding stats from MongoDB`);

    // If daily counter is missing, repair it from MongoDB
    let repairedCount = cardsStudiedToday;
    if (cardsStudiedToday === 0) {
      console.log(`🔧 Repairing daily counter from MongoDB...`);

      const { start, end } = getTodayBounds(timezoneOffset);

      const actualCount = await ReviewHistory.countDocuments({
        user_id: userId,
        review_date: { $gte: start, $lte: end },
      });

      if (actualCount > 0) {
        // Repair the Redis counter
        await redisOps.setDailyCount(
          userId as string,
          actualCount,
          timezoneOffset
        );
        repairedCount = actualCount;
        console.log(`✅ Repaired daily counter: ${actualCount} reviews today`);
      }
    }

    // ========================================
    // CACHE MISS - Compute from MongoDB
    // ========================================

    console.log("📦 Cache MISS - Computing fresh stats from database");

    const totalCards = await Card.countDocuments({ user_id: userId });
    const newCards = await Card.countDocuments({
      user_id: userId,
      "srs_status.interval": 0,
    });
    const masteredCards = await Card.countDocuments({
      user_id: userId,
      "srs_status.interval": { $gte: 7 },
      "srs_status.ease_factor": { $gte: 2.0 },
    });
    const learningCards = totalCards - newCards - masteredCards;

    // Get due cards count from Redis sorted set (faster than MongoDB query)
    const dueToday = await redisOps.getDueCardsCount(userId as string);

    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
    const dueNextWeek = await Card.countDocuments({
      user_id: userId,
      "srs_status.next_review_at": {
        $gte: new Date(),
        $lte: sevenDaysLater,
      },
    });

    // Get review activity for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyActivity = await ReviewHistory.aggregate([
      {
        $match: {
          user_id: userId,
          review_date: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$review_date" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Calculate total reviews
    const totalReviews = await ReviewHistory.countDocuments({
      user_id: userId,
    });

    // Get streak from Redis (calculated and cached)
    const streakData = await redisOps.calculateAndCacheStreak(
      userId as string,
      timezoneOffset
    );

    const avgReviewsPerDay =
      totalReviews > 0
        ? Math.round(totalReviews / Math.max(streakData.current || 1, 1))
        : 0;

    console.log(
      `✅ Computed stats: ${totalCards} total, ${dueToday} due, ${repairedCount} studied today`
    );

    // ========================================
    // STEP 4: CACHE REPAIR (Write-Through)
    // ========================================
    // Store computed stats in Redis for next request

    const computedStats = {
      total_cards: totalCards,
      new_cards: newCards,
      learning_cards: learningCards,
      mastered_cards: masteredCards,
      cards_due_today: dueToday,
      due_next_week: dueNextWeek,
      weekly_activity: JSON.stringify(weeklyActivity),
      total_reviews: totalReviews,
      avg_reviews_per_day: avgReviewsPerDay,
    };

    await redisOps.cacheUserStats(userId as string, computedStats);
    console.log(`💾 Cached stats for user ${userId} (TTL: 5 min)`);

    // ========================================
    // STEP 5: RETURN RESPONSE
    // ========================================

    res.status(200).json({
      success: true,
      message: "Study stats loaded from database (cache refreshed)",
      stats: {
        ...computedStats,
        weekly_activity: weeklyActivity,
        cards_studied_today: repairedCount, // From repaired counter
        cards_due_today: dueCount, // From Redis sorted set
        current_streak: streakData.current,
        longest_streak: streakData.longest,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error fetching study stats",
      error: error.message,
    });
  }
};

// DEPRECATED: Moved to redisOperations.calculateAndCacheStreak()
