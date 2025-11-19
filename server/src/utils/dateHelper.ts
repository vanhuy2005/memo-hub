/**
 * Date Helper Utilities for SRS System
 *
 * Purpose: Ensure timezone consistency across the app
 */

/**
 * Get today's date string in user's timezone
 * @param timezoneOffset Hours offset from UTC (e.g., 7 for Vietnam UTC+7)
 * @returns Date string in format "YYYY-MM-DD"
 *
 * Example:
 * - UTC time: 2025-11-19 17:30:00Z
 * - User timezone: UTC+7
 * - Result: "2025-11-20" (next day in Vietnam)
 */
export function getTodayDateKey(timezoneOffset: number = 0): string {
  const now = new Date();

  // Convert to user's timezone
  const utcTime = now.getTime();
  const offsetMs = timezoneOffset * 60 * 60 * 1000;
  const userTime = new Date(utcTime + offsetMs);

  // Format as YYYY-MM-DD
  const year = userTime.getUTCFullYear();
  const month = String(userTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(userTime.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Get start and end of today in UTC, based on user's timezone
 * Used for MongoDB queries on ISODate fields
 *
 * @param timezoneOffset Hours offset from UTC
 * @returns { start: Date, end: Date } - Both in UTC
 *
 * Example:
 * - User timezone: UTC+7
 * - User's "today": 2025-11-19 00:00:00 +07:00
 * - Returns start: 2025-11-18 17:00:00Z (UTC)
 * - Returns end: 2025-11-19 16:59:59.999Z (UTC)
 */
export function getTodayBounds(timezoneOffset: number = 0): {
  start: Date;
  end: Date;
} {
  const now = new Date();
  const offsetMs = timezoneOffset * 60 * 60 * 1000;

  // Get start of today in user's timezone
  const userTime = new Date(now.getTime() + offsetMs);
  userTime.setUTCHours(0, 0, 0, 0);

  // Convert back to UTC
  const startUTC = new Date(userTime.getTime() - offsetMs);

  // Get end of today (23:59:59.999)
  const endUTC = new Date(startUTC.getTime() + 24 * 60 * 60 * 1000 - 1);

  return { start: startUTC, end: endUTC };
}
