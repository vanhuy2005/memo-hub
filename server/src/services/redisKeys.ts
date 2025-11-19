/**
 * Redis Key Design for SRS System
 *
 * Pattern: Cache-Aside with Daily Counters
 * TTL Strategy: Short-lived counters (24h), persistent queues
 */

/**
 * Get user's local date string in their timezone
 * Format: YYYY-MM-DD (e.g., "2025-11-19")
 */
export const getUserLocalDate = (userTimezoneOffset: number = 7): string => {
  const now = new Date();
  const utcTime = now.getTime();
  const userTime = new Date(utcTime + userTimezoneOffset * 60 * 60 * 1000);

  const year = userTime.getUTCFullYear();
  const month = String(userTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(userTime.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * Redis Key Patterns
 */
export const RedisKeys = {
  // ========================================
  // 1. DAILY COUNTERS (Auto-reset via date-based keys)
  // ========================================

  /**
   * Daily study counter
   * Key: user:{userId}:daily:{date}
   * Type: String (Integer)
   * Value: Number of cards reviewed today
   * TTL: 48 hours (auto-cleanup after 2 days)
   *
   * Example: user:507f1f77bcf86cd799439011:daily:2025-11-19 -> "15"
   * Operations: INCR, GET, EXPIRE
   */
  dailyCount: (userId: string, date: string) => `user:${userId}:daily:${date}`,

  /**
   * Daily XP earned
   * Key: user:{userId}:xp:daily:{date}
   * Type: String (Integer)
   * TTL: 48 hours
   */
  dailyXP: (userId: string, date: string) => `user:${userId}:xp:daily:${date}`,

  // ========================================
  // 2. DUE CARDS QUEUE (Sorted Set for priority)
  // ========================================

  /**
   * Due cards queue (sorted by next_review_date)
   * Key: user:{userId}:due_queue
   * Type: Sorted Set
   * Score: Unix timestamp of next_review_date
   * Members: Card IDs
   *
   * Example: user:507f1f77bcf86cd799439011:due_queue
   * Operations: ZADD, ZREM, ZRANGEBYSCORE, ZCARD
   *
   * Why Sorted Set?
   * - O(log N) for add/remove
   * - Can query by score range (cards due before NOW)
   * - Ordered by urgency (oldest reviews first)
   */
  dueQueue: (userId: string) => `user:${userId}:due_queue`,

  /**
   * Due cards queue per deck
   * Key: user:{userId}:due_queue:deck:{deckId}
   * Type: Sorted Set
   */
  dueQueueDeck: (userId: string, deckId: string) =>
    `user:${userId}:due_queue:deck:${deckId}`,

  // ========================================
  // 3. CACHED STATISTICS (Short TTL)
  // ========================================

  /**
   * User statistics cache
   * Key: user:{userId}:stats
   * Type: Hash
   * Fields: total_cards, mastered_cards, learning_cards, new_cards
   * TTL: 5 minutes
   *
   * Example:
   * HSET user:123:stats total_cards 150
   * HSET user:123:stats mastered_cards 50
   *
   * Why Hash?
   * - Store multiple fields efficiently
   * - Can update individual fields (HINCRBY)
   * - Can get all fields at once (HGETALL)
   */
  userStats: (userId: string) => `user:${userId}:stats`,

  /**
   * Weekly activity cache (for charts)
   * Key: user:{userId}:activity:week:{week}
   * Type: Hash
   * Fields: day1, day2, ..., day7 (counts)
   * TTL: 1 hour
   */
  weeklyActivity: (userId: string, weekStart: string) =>
    `user:${userId}:activity:week:${weekStart}`,

  // ========================================
  // 4. STREAK TRACKING
  // ========================================

  /**
   * Streak cache
   * Key: user:{userId}:streak
   * Type: Hash
   * Fields: current, longest, last_study_date
   * TTL: 24 hours
   */
  streak: (userId: string) => `user:${userId}:streak`,

  /**
   * Study dates set (for streak calculation)
   * Key: user:{userId}:study_dates
   * Type: Set
   * Members: Date strings (YYYY-MM-DD)
   * TTL: 90 days
   */
  studyDates: (userId: string) => `user:${userId}:study_dates`,

  // ========================================
  // 5. SESSION DATA (Temporary)
  // ========================================

  /**
   * Active study session
   * Key: user:{userId}:session:{sessionId}
   * Type: Hash
   * Fields: cards_reviewed, start_time, deck_id
   * TTL: 2 hours
   */
  session: (userId: string, sessionId: string) =>
    `user:${userId}:session:${sessionId}`,
};

/**
 * TTL Constants (in seconds)
 */
export const RedisTTL = {
  DAILY_COUNTER: 48 * 60 * 60, // 48 hours
  STATS_CACHE: 5 * 60, // 5 minutes
  WEEKLY_CACHE: 60 * 60, // 1 hour
  STREAK_CACHE: 24 * 60 * 60, // 24 hours
  SESSION: 2 * 60 * 60, // 2 hours
  STUDY_DATES: 90 * 24 * 60 * 60, // 90 days
};

/**
 * Helper: Pattern matching for bulk operations
 */
export const RedisPatterns = {
  allUserKeys: (userId: string) => `user:${userId}:*`,
  allDailyCounters: (userId: string) => `user:${userId}:daily:*`,
  allStatsCaches: () => `user:*:stats`,
};
