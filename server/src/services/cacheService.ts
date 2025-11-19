import * as cache from "../config/redis";
import Card from "../models/Card";
import User from "../models/User";
import ReviewHistory from "../models/ReviewHistory";

/**
 * Cache Service for Study Data
 * Implements caching strategies for performance optimization
 */

/**
 * Cache keys generator
 */
export const CacheKeys = {
  // User study stats
  userStats: (userId: string) => `stats:user:${userId}`,

  // Cards due today for user
  cardsDue: (userId: string) => `cards:due:${userId}`,

  // Cards due for specific deck
  cardsDueDeck: (userId: string, deckId: string) =>
    `cards:due:${userId}:${deckId}`,

  // User gamification data
  gamification: (userId: string) => `gamification:${userId}`,

  // Daily stats (for leaderboard)
  dailyStats: (date: string) => `daily:stats:${date}`,
};

/**
 * Get or compute user study stats with caching
 */
export const getUserStats = async (userId: string) => {
  const cacheKey = CacheKeys.userStats(userId);

  // Try to get from cache
  const cached = await cache.get(cacheKey);
  if (cached) {
    console.log(`📦 Cache HIT: ${cacheKey}`);
    return cached;
  }

  console.log(`🔍 Cache MISS: ${cacheKey} - Computing...`);

  // Compute fresh data with Vietnam timezone (UTC+7)
  const now = new Date();
  const vietnamOffset = 7 * 60; // UTC+7 in minutes
  const localOffset = now.getTimezoneOffset(); // Local offset in minutes
  const offsetDiff = vietnamOffset + localOffset;

  const todayStart = new Date(now.getTime() + offsetDiff * 60 * 1000);
  todayStart.setHours(0, 0, 0, 0);
  todayStart.setTime(todayStart.getTime() - offsetDiff * 60 * 1000);

  const todayEnd = new Date(now.getTime() + offsetDiff * 60 * 1000);
  todayEnd.setHours(23, 59, 59, 999);
  todayEnd.setTime(todayEnd.getTime() - offsetDiff * 60 * 1000);

  const [totalCards, masteredCards, cardsDueToday, cardsStudiedToday] =
    await Promise.all([
      Card.countDocuments({ user_id: userId }),
      Card.countDocuments({
        user_id: userId,
        "srs_status.interval": { $gte: 7 },
        "srs_status.ease_factor": { $gte: 2.0 },
      }),
      Card.countDocuments({
        user_id: userId,
        "srs_status.next_review_at": { $lte: new Date() },
      }),
      ReviewHistory.countDocuments({
        user_id: userId,
        review_date: { $gte: todayStart, $lte: todayEnd },
      }),
    ]);

  // Calculate streak
  const user = await User.findById(userId);
  let currentStreak = 0;

  if (user) {
    // Get unique review dates in last 60 days
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const reviewDates = await ReviewHistory.distinct("review_date", {
      user_id: userId,
      review_date: { $gte: sixtyDaysAgo },
    });

    // Sort dates descending (convert to Vietnam timezone for comparison)
    const toVietnamDate = (date: Date) => {
      const d = new Date(
        date.getTime() + (vietnamOffset - date.getTimezoneOffset()) * 60 * 1000
      );
      return d.toISOString().split("T")[0]; // YYYY-MM-DD format
    };

    const sortedDates = reviewDates
      .map((d) => toVietnamDate(new Date(d)))
      .filter((v, i, arr) => arr.indexOf(v) === i) // Remove duplicates
      .sort((a, b) => b.localeCompare(a)); // Sort descending

    // Calculate consecutive days using Vietnam timezone
    let checkDate = new Date(now.getTime() + offsetDiff * 60 * 1000);
    checkDate.setHours(0, 0, 0, 0);

    for (const dateStr of sortedDates) {
      const checkDateStr = toVietnamDate(checkDate);
      if (dateStr === checkDateStr) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  const stats = {
    total_cards: totalCards,
    mastered_cards: masteredCards,
    cards_due_today: cardsDueToday,
    cards_studied_today: cardsStudiedToday,
    current_streak: currentStreak,
  };

  // Cache for 5 minutes
  await cache.set(cacheKey, stats, cache.TTL.MEDIUM);

  return stats;
};

/**
 * Get cards due today with caching
 */
export const getCardsDue = async (
  userId: string,
  deckId?: string,
  limit: number = 50
) => {
  const cacheKey = deckId
    ? CacheKeys.cardsDueDeck(userId, deckId)
    : CacheKeys.cardsDue(userId);

  // Try to get from cache
  const cached = await cache.get(cacheKey);
  if (cached) {
    console.log(`📦 Cache HIT: ${cacheKey}`);
    return cached;
  }

  console.log(`🔍 Cache MISS: ${cacheKey} - Fetching from DB...`);

  // Query from database
  const query: any = {
    user_id: userId,
    "srs_status.next_review_at": { $lte: new Date() },
  };

  if (deckId) {
    query.deck_id = deckId;
  }

  const cards = await Card.find(query)
    .populate("deck_id", "name")
    .limit(limit)
    .lean(); // Use lean() for better performance

  // Cache for 1 hour (cards due don't change frequently)
  await cache.set(cacheKey, cards, cache.TTL.LONG);

  return cards;
};

/**
 * Invalidate user caches after card review
 */
export const invalidateUserCache = async (userId: string) => {
  const patterns = [
    CacheKeys.userStats(userId),
    CacheKeys.cardsDue(userId),
    `${CacheKeys.cardsDueDeck(userId, "*")}`, // Invalidate all deck-specific caches
    CacheKeys.gamification(userId),
  ];

  for (const pattern of patterns) {
    if (pattern.includes("*")) {
      await cache.delPattern(pattern);
    } else {
      await cache.del(pattern);
    }
  }

  console.log(`🗑️ Invalidated caches for user ${userId}`);
};

/**
 * Cache gamification stats
 */
export const cacheGamification = async (userId: string, data: any) => {
  const cacheKey = CacheKeys.gamification(userId);
  await cache.set(cacheKey, data, cache.TTL.MEDIUM);
};

/**
 * Get cached gamification stats
 */
export const getGamificationCache = async (userId: string) => {
  const cacheKey = CacheKeys.gamification(userId);
  return await cache.get(cacheKey);
};

/**
 * Warm up cache for active users
 * Call this periodically (e.g., every 10 minutes) for top 100 active users
 */
export const warmupCache = async (userIds: string[]) => {
  console.log(`🔥 Warming up cache for ${userIds.length} users...`);

  const promises = userIds.map((userId) => getUserStats(userId));

  await Promise.allSettled(promises);

  console.log(`✅ Cache warmup complete`);
};

export default {
  getUserStats,
  getCardsDue,
  invalidateUserCache,
  cacheGamification,
  getGamificationCache,
  warmupCache,
  CacheKeys,
};
