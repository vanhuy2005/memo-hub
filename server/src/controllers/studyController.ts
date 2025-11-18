import { Response } from "express";
import Card from "../models/Card";
import ReviewHistory from "../models/ReviewHistory";
import { AuthRequest } from "../middlewares/auth.middleware";
import { calculateNextReview, shuffleArray } from "../services/srsService";

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

    // Query: Lấy thẻ có next_review_at <= hiện tại
    const query: any = {
      user_id: userId,
      "srs_status.next_review_at": { $lte: new Date() },
    };

    // Nếu có deckId, chỉ lấy thẻ của deck đó
    if (deckId) {
      query.deck_id = deckId;
    }

    const cards = await Card.find(query)
      .populate("deck_id", "name")
      .limit(limit);

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

    // Áp dụng thuật toán SM-2
    const oldInterval = card.srs_status.interval;
    const newSRSStatus = calculateNextReview(grade, card.srs_status);

    // Cập nhật card
    card.srs_status = newSRSStatus;
    await card.save();

    // Lưu review history
    await ReviewHistory.create({
      user_id: userId,
      card_id: card._id,
      deck_id: card.deck_id,
      grade,
      review_date: new Date(),
      interval_before: oldInterval,
      interval_after: newSRSStatus.interval,
    });

    res.status(200).json({
      success: true,
      message: "Card reviewed successfully",
      data: {
        card_id: card._id,
        new_interval: newSRSStatus.interval,
        new_ease_factor: newSRSStatus.ease_factor,
        next_review_at: newSRSStatus.next_review_at,
        grade_submitted: grade,
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

// @desc    Lấy thống kê học tập
// @route   GET /api/study/stats
// @access  Private
export const getStudyStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    // Tổng số thẻ
    const totalCards = await Card.countDocuments({ user_id: userId });

    // Thẻ mới (interval = 0)
    const newCards = await Card.countDocuments({
      user_id: userId,
      "srs_status.interval": 0,
    });

    // Thẻ đã thuộc (interval >= 7 ngày và ease_factor >= 2.0)
    const masteredCards = await Card.countDocuments({
      user_id: userId,
      "srs_status.interval": { $gte: 7 },
      "srs_status.ease_factor": { $gte: 2.0 },
    });

    // Thẻ đang học (interval > 0 nhưng chưa mastered)
    const learningCards = totalCards - newCards - masteredCards;

    // Thẻ cần ôn hôm nay
    const dueToday = await Card.countDocuments({
      user_id: userId,
      "srs_status.next_review_at": { $lte: new Date() },
    });

    // Thẻ cần ôn trong 7 ngày tới
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const dueNextWeek = await Card.countDocuments({
      user_id: userId,
      "srs_status.next_review_at": {
        $gte: new Date(),
        $lte: sevenDaysLater,
      },
    });

    // Calculate current streak from ReviewHistory
    const { currentStreak, longestStreak } = await calculateStreaks(userId!);

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

    // Calculate average study time per day
    const totalReviews = await ReviewHistory.countDocuments({
      user_id: userId,
    });
    const avgReviewsPerDay =
      totalReviews > 0
        ? Math.round(totalReviews / Math.max(currentStreak || 1, 1))
        : 0;

    res.status(200).json({
      success: true,
      data: {
        stats: {
          total_cards: totalCards,
          new_cards: newCards,
          learning_cards: learningCards,
          mastered_cards: masteredCards,
          due_today: dueToday,
          due_next_week: dueNextWeek,
          current_streak: currentStreak,
          longest_streak: longestStreak,
          weekly_activity: weeklyActivity,
          total_reviews: totalReviews,
          avg_reviews_per_day: avgReviewsPerDay,
        },
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

// Helper function to calculate streaks
async function calculateStreaks(userId: string): Promise<{
  currentStreak: number;
  longestStreak: number;
}> {
  try {
    // Get unique review dates
    const reviewDates = await ReviewHistory.aggregate([
      { $match: { user_id: userId } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$review_date" },
          },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    if (reviewDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    const dates = reviewDates.map((item) => new Date(item._id));
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastReviewDate = new Date(dates[0]);
    lastReviewDate.setHours(0, 0, 0, 0);

    // Check if current streak is active (reviewed today or yesterday)
    if (
      lastReviewDate.getTime() === today.getTime() ||
      lastReviewDate.getTime() === yesterday.getTime()
    ) {
      currentStreak = 1;

      // Count consecutive days
      for (let i = 1; i < dates.length; i++) {
        const currentDate = new Date(dates[i]);
        currentDate.setHours(0, 0, 0, 0);
        const prevDate = new Date(dates[i - 1]);
        prevDate.setHours(0, 0, 0, 0);

        const diffDays = Math.round(
          (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
          currentStreak++;
          tempStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    tempStreak = 1;
    for (let i = 1; i < dates.length; i++) {
      const currentDate = new Date(dates[i]);
      currentDate.setHours(0, 0, 0, 0);
      const prevDate = new Date(dates[i - 1]);
      prevDate.setHours(0, 0, 0, 0);

      const diffDays = Math.round(
        (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, currentStreak, 1);

    return { currentStreak, longestStreak };
  } catch (error) {
    console.error("Error calculating streaks:", error);
    return { currentStreak: 0, longestStreak: 0 };
  }
}
