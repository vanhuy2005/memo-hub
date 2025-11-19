import User from "../models/User";

// Achievement interface (export for external use)
export interface IAchievement {
  id: string;
  unlocked_at: Date;
}

/**
 * Gamification Service
 * Handles XP calculation, level-ups, achievements, and mascot mood
 */

// XP calculation constants
const XP_PER_CARD = {
  AGAIN: 1, // Grade 0: Minimal XP for failing
  HARD: 3, // Grade 1: Some XP for struggling
  GOOD: 5, // Grade 2: Standard XP
  EASY: 8, // Grade 3: Bonus XP for mastery
};

const XP_LEVEL_THRESHOLD = 100; // XP needed to level up (scales with level)

// Achievement definitions
const ACHIEVEMENTS = {
  FIRST_STUDY: "first_study_session",
  STREAK_3: "streak_3_days",
  STREAK_7: "streak_7_days",
  STREAK_30: "streak_30_days",
  MASTERED_10: "mastered_10_cards",
  MASTERED_50: "mastered_50_cards",
  MASTERED_100: "mastered_100_cards",
  LEVEL_5: "reached_level_5",
  LEVEL_10: "reached_level_10",
  PERFECT_SESSION: "perfect_session_no_again",
};

/**
 * Calculate XP gained from a study session
 */
export const calculateSessionXP = (reviews: Array<{ grade: number }>) => {
  let totalXP = 0;

  reviews.forEach((review) => {
    switch (review.grade) {
      case 0:
        totalXP += XP_PER_CARD.AGAIN;
        break;
      case 1:
        totalXP += XP_PER_CARD.HARD;
        break;
      case 2:
        totalXP += XP_PER_CARD.GOOD;
        break;
      case 3:
        totalXP += XP_PER_CARD.EASY;
        break;
      default:
        totalXP += XP_PER_CARD.GOOD;
    }
  });

  // Bonus XP for perfect session (no "Again" grades)
  const hasNoAgain = reviews.every((r) => r.grade > 0);
  if (hasNoAgain && reviews.length > 0) {
    totalXP += 10; // Bonus 10 XP
  }

  return totalXP;
};

/**
 * Add XP to user and handle level-up logic
 */
export const addXP = async (userId: string, xpGained: number) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const currentXP = user.gamification.xp;
  const currentLevel = user.gamification.level;
  const newXP = currentXP + xpGained;

  // Calculate level-up threshold (increases with level)
  const xpNeeded = XP_LEVEL_THRESHOLD * currentLevel;

  let leveledUp = false;
  let newLevel = currentLevel;

  // Check for level up
  if (newXP >= xpNeeded) {
    newLevel = currentLevel + 1;
    leveledUp = true;

    // Award currency on level up
    user.gamification.currency += newLevel * 10;

    // Check for level-based achievements
    if (newLevel === 5) {
      await unlockAchievement(userId, ACHIEVEMENTS.LEVEL_5);
    }
    if (newLevel === 10) {
      await unlockAchievement(userId, ACHIEVEMENTS.LEVEL_10);
    }
  }

  // Update user
  user.gamification.xp = newXP;
  user.gamification.level = newLevel;
  await user.save();

  return {
    xpGained,
    newXP,
    leveledUp,
    newLevel,
    xpNeededForNextLevel: XP_LEVEL_THRESHOLD * newLevel,
  };
};

/**
 * Unlock achievement for user
 */
export const unlockAchievement = async (
  userId: string,
  achievementId: string
) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Check if already unlocked
  const alreadyUnlocked = user.gamification.achievements.some(
    (a) => a.id === achievementId
  );

  if (!alreadyUnlocked) {
    user.gamification.achievements.push({
      id: achievementId,
      unlocked_at: new Date(),
    });

    // Award currency for achievement
    user.gamification.currency += 50;

    await user.save();
    return true;
  }

  return false;
};

/**
 * Update mascot mood based on user activity
 */
export const updateMascotMood = async (
  userId: string,
  currentStreak: number
) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  let mood: "happy" | "sleeping" | "studying" | "celebrating" = "happy";

  if (currentStreak === 0) {
    mood = "sleeping"; // No streak = mascot is sleeping
  } else if (currentStreak >= 7) {
    mood = "celebrating"; // 7+ days = mascot celebrates
  } else if (currentStreak >= 3) {
    mood = "happy"; // 3+ days = mascot is happy
  } else {
    mood = "studying"; // 1-2 days = mascot is studying
  }

  user.gamification.mascot_mood = mood;
  await user.save();

  return mood;
};

/**
 * Check and unlock streak-based achievements
 */
export const checkStreakAchievements = async (
  userId: string,
  streak: number
) => {
  if (streak >= 3) {
    await unlockAchievement(userId, ACHIEVEMENTS.STREAK_3);
  }
  if (streak >= 7) {
    await unlockAchievement(userId, ACHIEVEMENTS.STREAK_7);
  }
  if (streak >= 30) {
    await unlockAchievement(userId, ACHIEVEMENTS.STREAK_30);
  }
};

/**
 * Check and unlock mastery-based achievements
 */
export const checkMasteryAchievements = async (
  userId: string,
  masteredCount: number
) => {
  if (masteredCount >= 10) {
    await unlockAchievement(userId, ACHIEVEMENTS.MASTERED_10);
  }
  if (masteredCount >= 50) {
    await unlockAchievement(userId, ACHIEVEMENTS.MASTERED_50);
  }
  if (masteredCount >= 100) {
    await unlockAchievement(userId, ACHIEVEMENTS.MASTERED_100);
  }
};

/**
 * Get user's gamification stats
 */
export const getGamificationStats = async (
  userId: string
): Promise<{
  xp: number;
  level: number;
  currency: number;
  mascot_mood: string;
  achievements: IAchievement[];
  xpNeededForNextLevel: number;
  progressToNextLevel: number;
}> => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const currentLevel = user.gamification.level;
  const xpNeededForNextLevel = XP_LEVEL_THRESHOLD * currentLevel;
  const progressToNextLevel = Math.min(
    (user.gamification.xp / xpNeededForNextLevel) * 100,
    100
  );

  return {
    xp: user.gamification.xp,
    level: currentLevel,
    currency: user.gamification.currency,
    mascot_mood: user.gamification.mascot_mood,
    achievements: user.gamification.achievements as any,
    xpNeededForNextLevel,
    progressToNextLevel: Math.round(progressToNextLevel),
  };
};

export default {
  calculateSessionXP,
  addXP,
  unlockAchievement,
  updateMascotMood,
  checkStreakAchievements,
  checkMasteryAchievements,
  getGamificationStats,
  ACHIEVEMENTS,
};
