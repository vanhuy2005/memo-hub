import * as cache from "../config/redis";
import { RedisKeys, RedisTTL, getUserLocalDate } from "./redisKeys";

/**
 * Redis Operations Service for SRS System
 *
 * Design Principles:
 * 1. Atomic operations (INCR, ZADD, ZREM in single commands)
 * 2. Date-based keys for auto-reset (no cronjobs needed)
 * 3. MongoDB as source of truth, Redis as fast cache
 */

// ========================================
// DAILY COUNTERS (Auto-reset via date keys)
// ========================================

/**
 * Increment daily study counter
 * Returns: New count after increment
 */
export const incrementDailyCount = async (
  userId: string,
  timezoneOffset: number = 7
): Promise<number> => {
  const today = getUserLocalDate(timezoneOffset);
  const key = RedisKeys.dailyCount(userId, today);

  // INCR is atomic - no race conditions
  const count = await cache.incr(key);

  // Set TTL on first increment (key didn't exist before)
  if (count === 1) {
    await cache.expire(key, RedisTTL.DAILY_COUNTER);
  }

  console.log(`📊 Daily count for user ${userId}: ${count} (date: ${today})`);
  return count;
};

/**
 * Get daily study count
 * Returns: Count or 0 if key doesn't exist (auto-reset!)
 */
export const getDailyCount = async (
  userId: string,
  timezoneOffset: number = 7
): Promise<number> => {
  const today = getUserLocalDate(timezoneOffset);
  const key = RedisKeys.dailyCount(userId, today);

  const count = await cache.get(key);
  return count ? parseInt(count as string, 10) : 0;
};

/**
 * Set daily study count (for repair/sync)
 */
export const setDailyCount = async (
  userId: string,
  count: number,
  timezoneOffset: number = 7
): Promise<void> => {
  const today = getUserLocalDate(timezoneOffset);
  const key = RedisKeys.dailyCount(userId, today);

  await cache.set(key, count);
  await cache.expire(key, RedisTTL.DAILY_COUNTER);

  console.log(
    `🔧 Set daily count for user ${userId}: ${count} (date: ${today})`
  );
};

/**
 * Increment daily XP
 */
export const incrementDailyXP = async (
  userId: string,
  xpGained: number,
  timezoneOffset: number = 7
): Promise<number> => {
  const today = getUserLocalDate(timezoneOffset);
  const key = RedisKeys.dailyXP(userId, today);

  const newXP = await cache.incrby(key, xpGained);

  if (newXP === xpGained) {
    // First increment
    await cache.expire(key, RedisTTL.DAILY_COUNTER);
  }

  return newXP;
};

/**
 * Get daily XP count
 */
export const getDailyXP = async (
  userId: string,
  timezoneOffset: number = 7
): Promise<number> => {
  const today = getUserLocalDate(timezoneOffset);
  const key = RedisKeys.dailyXP(userId, today);

  const xp = await cache.get(key);
  return xp ? parseInt(xp as string, 10) : 0;
};

// ========================================
// DUE CARDS QUEUE (Sorted Set)
// ========================================

/**
 * Add card to due queue
 * @param score Unix timestamp of next_review_date
 */
export const addToDueQueue = async (
  userId: string,
  cardId: string,
  nextReviewTimestamp: number,
  deckId?: string
): Promise<void> => {
  const key = RedisKeys.dueQueue(userId);

  // ZADD is O(log N)
  await cache.zadd(key, nextReviewTimestamp, cardId);

  // Also add to deck-specific queue if deckId provided
  if (deckId) {
    const deckKey = RedisKeys.dueQueueDeck(userId, deckId);
    await cache.zadd(deckKey, nextReviewTimestamp, cardId);
  }

  console.log(
    `➕ Added card ${cardId} to due queue (score: ${nextReviewTimestamp})`
  );
};

/**
 * Remove card from due queue (after review)
 */
export const removeFromDueQueue = async (
  userId: string,
  cardId: string,
  deckId?: string
): Promise<void> => {
  const key = RedisKeys.dueQueue(userId);

  // ZREM is O(M log N) where M is number of elements to remove
  await cache.zrem(key, cardId);

  if (deckId) {
    const deckKey = RedisKeys.dueQueueDeck(userId, deckId);
    await cache.zrem(deckKey, cardId);
  }

  console.log(`➖ Removed card ${cardId} from due queue`);
};

/**
 * Get count of due cards (cards with score <= now)
 */
export const getDueCardsCount = async (
  userId: string,
  deckId?: string
): Promise<number> => {
  const key = deckId
    ? RedisKeys.dueQueueDeck(userId, deckId)
    : RedisKeys.dueQueue(userId);

  const now = Date.now();

  // ZCOUNT returns count of elements with score in range
  const count = await cache.zcount(key, "-inf", now);

  return count;
};

/**
 * Get due card IDs (for building study session)
 */
export const getDueCardIds = async (
  userId: string,
  limit: number = 50,
  deckId?: string
): Promise<string[]> => {
  const key = deckId
    ? RedisKeys.dueQueueDeck(userId, deckId)
    : RedisKeys.dueQueue(userId);

  const now = Date.now();

  // ZRANGEBYSCORE returns members with score in range
  const cardIds = await cache.zrangebyscore(
    key,
    "-inf",
    now,
    "LIMIT",
    0,
    limit
  );

  return cardIds;
};

/**
 * Rebuild due queue from database (cache miss recovery)
 */
export const rebuildDueQueue = async (
  userId: string,
  cards: Array<{
    _id: string;
    srs_status: { next_review_at: Date };
    deck_id: string;
  }>
): Promise<void> => {
  const key = RedisKeys.dueQueue(userId);

  // Clear existing queue
  await cache.del(key);

  // Batch add cards
  for (const card of cards) {
    const timestamp = card.srs_status.next_review_at.getTime();
    await cache.zadd(key, timestamp, card._id.toString());
  }

  console.log(`🔄 Rebuilt due queue for user ${userId}: ${cards.length} cards`);
};

// ========================================
// STATISTICS CACHE (Hash)
// ========================================

/**
 * Cache user statistics
 */
export const cacheUserStats = async (
  userId: string,
  stats: {
    total_cards: number;
    mastered_cards: number;
    learning_cards: number;
    new_cards: number;
    cards_due_today: number;
  }
): Promise<void> => {
  const key = RedisKeys.userStats(userId);

  // HMSET sets multiple hash fields at once (atomic)
  await cache.hmset(key, stats);
  await cache.expire(key, RedisTTL.STATS_CACHE);

  console.log(`💾 Cached stats for user ${userId}`);
};

/**
 * Get cached statistics
 */
export const getCachedStats = async (
  userId: string
): Promise<Record<string, string> | null> => {
  const key = RedisKeys.userStats(userId);

  const stats = await cache.hgetall(key);

  if (!stats || Object.keys(stats).length === 0) {
    return null;
  }

  return stats;
};

/**
 * Increment a specific stat field
 */
export const incrementStat = async (
  userId: string,
  field: string,
  increment: number = 1
): Promise<void> => {
  const key = RedisKeys.userStats(userId);

  await cache.hincrby(key, field, increment);
};

// ========================================
// STREAK TRACKING
// ========================================

/**
 * Mark today as studied (for streak calculation)
 */
export const markTodayStudied = async (
  userId: string,
  timezoneOffset: number = 7
): Promise<void> => {
  const today = getUserLocalDate(timezoneOffset);
  const key = RedisKeys.studyDates(userId);

  // SADD adds member to set (idempotent)
  await cache.sadd(key, today);
  await cache.expire(key, RedisTTL.STUDY_DATES);

  console.log(`✅ Marked ${today} as studied for user ${userId}`);
};

/**
 * Get study dates for streak calculation
 */
export const getStudyDates = async (
  userId: string,
  _days: number = 90 // Prefix with _ to indicate intentionally unused
): Promise<string[]> => {
  const key = RedisKeys.studyDates(userId);

  // SMEMBERS returns all members of set
  const dates = await cache.smembers(key);

  return dates.sort().reverse(); // Sort descending
};

/**
 * Calculate and cache streak
 */
export const calculateAndCacheStreak = async (
  userId: string,
  timezoneOffset: number = 7
): Promise<{ current: number; longest: number }> => {
  const dates = await getStudyDates(userId);

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = getUserLocalDate(timezoneOffset);
  let checkDate = new Date(today);

  // Calculate current streak
  for (const dateStr of dates) {
    const expectedDate = checkDate.toISOString().split("T")[0];

    if (dateStr === expectedDate) {
      currentStreak++;
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);

      // Move to previous day
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Streak broken
      break;
    }
  }

  // Cache streak data
  const streakKey = RedisKeys.streak(userId);
  await cache.hmset(streakKey, {
    current: currentStreak,
    longest: longestStreak,
    last_study_date: today,
  });
  await cache.expire(streakKey, RedisTTL.STREAK_CACHE);

  return { current: currentStreak, longest: longestStreak };
};

/**
 * Get cached streak data (or return 0 if not cached)
 */
export const getStreak = async (
  userId: string
): Promise<{ current: number; longest: number } | null> => {
  const streakKey = RedisKeys.streak(userId);
  const data = await cache.hgetall(streakKey);

  if (!data) return null;

  return {
    current: parseInt(data.current || "0", 10),
    longest: parseInt(data.longest || "0", 10),
  };
};

// ========================================
// WRITE-THROUGH TRANSACTION (Atomic Update)
// ========================================

/**
 * Update all Redis counters atomically after a card review
 * Uses Redis MULTI/EXEC transaction to prevent race conditions
 *
 * WHY TRANSACTION?
 * - Ensures all-or-nothing: Either all updates succeed or none
 * - Prevents partial updates if one command fails
 * - Atomic counter increments prevent race conditions
 *
 * @param userId User ID
 * @param cardId Card ID being reviewed
 * @param nextReviewTimestamp Unix timestamp of next review (0 if failed card)
 * @param timezoneOffset User's timezone offset in hours
 * @param deckId Optional deck ID for filtering
 * @returns Object with updated counts
 */
export const updateAfterReview = async (
  userId: string,
  cardId: string,
  nextReviewTimestamp: number,
  timezoneOffset: number = 0
): Promise<{
  dailyCount: number;
  dueCount: number;
  success: boolean;
}> => {
  const today = getUserLocalDate(timezoneOffset);
  const dailyKey = RedisKeys.dailyCount(userId, today);
  const dueQueueKey = RedisKeys.dueQueue(userId);
  const studyDatesKey = RedisKeys.studyDates(userId);

  // Create Redis transaction pipeline
  const pipeline = cache.multi();

  console.log(
    `🔄 Starting atomic Redis update for user ${userId}, card ${cardId}`
  );

  // 1. Increment daily counter (atomic INCR)
  pipeline.incr(dailyKey);

  // 2. Set TTL on daily key (only if it's the first increment)
  // Note: EXPIRE is idempotent, safe to call multiple times
  pipeline.expire(dailyKey, RedisTTL.DAILY_COUNTER);

  // 3. Remove card from old due queue position
  pipeline.zrem(dueQueueKey, cardId);

  // 4. Add card back to queue with new timestamp (only if not due immediately)
  if (nextReviewTimestamp > Date.now()) {
    pipeline.zadd(dueQueueKey, nextReviewTimestamp, cardId);
  }

  // 5. Mark today as studied (for streak tracking)
  pipeline.sadd(studyDatesKey, today);
  pipeline.expire(studyDatesKey, RedisTTL.STUDY_DATES);

  // Execute transaction atomically
  const results = await cache.execPipeline(pipeline);

  if (!results) {
    console.error("❌ Redis transaction failed - running without cache");
    return { dailyCount: 0, dueCount: 0, success: false };
  }

  // Parse results (ioredis returns [error, result] pairs)
  const dailyCount = results[0] as number; // Result of INCR
  const dueCount = await cache.zcard(dueQueueKey); // Get due queue size

  console.log(
    `✅ Atomic update complete: ${dailyCount} cards today, ${dueCount} due`
  );

  return {
    dailyCount,
    dueCount,
    success: true,
  };
};

// ========================================
// CACHE INVALIDATION
// ========================================

/**
 * Invalidate user's cached stats after card review
 */
export const invalidateUserStats = async (userId: string): Promise<void> => {
  const keysToDelete = [
    RedisKeys.userStats(userId),
    // Don't delete daily counters or due queue - they are updated atomically
  ];

  for (const key of keysToDelete) {
    await cache.del(key);
  }

  console.log(`🗑️  Invalidated stats cache for user ${userId}`);
};

/**
 * Clear all caches for a user (use sparingly!)
 */
export const clearAllUserCaches = async (userId: string): Promise<void> => {
  const pattern = `user:${userId}:*`;

  await cache.delPattern(pattern);

  console.log(`🗑️  Cleared ALL caches for user ${userId}`);
};
