import Redis from "ioredis";
import * as dotenv from "dotenv";

// Load environment variables first
dotenv.config();

/**
 * Redis Client Configuration
 * Uses ioredis for better TypeScript support and features
 */

console.log("🔧 Redis Config:", {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || "6379",
  hasPassword: !!process.env.REDIS_PASSWORD,
});

// Check if using Redis Cloud
const isRedisCloud = process.env.REDIS_HOST?.includes("cloud.redislabs.com");

// Create Redis client instance
let redisClient: Redis;

if (
  isRedisCloud &&
  process.env.REDIS_HOST &&
  process.env.REDIS_PORT &&
  process.env.REDIS_PASSWORD
) {
  // For Redis Cloud - try WITHOUT TLS first (some Redis Cloud ports don't use TLS)
  console.log("🔐 Attempting Redis Cloud connection WITHOUT TLS...");

  redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || "0"),
    // No TLS for now - Redis Cloud free tier might not use TLS on public endpoint
    retryStrategy: (times: number) => {
      if (times > 3) {
        console.warn("⚠️ Redis unavailable, running without cache");
        return null;
      }
      return Math.min(times * 50, 2000);
    },
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    connectTimeout: 10000,
  });
} else {
  // For local Redis
  redisClient = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || "0"),
    retryStrategy: (times: number) => {
      if (times > 3) {
        console.warn("⚠️ Redis unavailable, running without cache");
        return null;
      }
      return Math.min(times * 50, 2000);
    },
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });
}

// Track Redis availability
let isRedisAvailable = false;

// Event handlers (set up before connecting)
redisClient.on("connect", () => {
  console.log("✅ Redis connecting...");
});

redisClient.on("ready", () => {
  console.log("🚀 Redis connected successfully!");
  isRedisAvailable = true;
});

redisClient.on("error", (err) => {
  console.error("❌ Redis error:", err);
  isRedisAvailable = false;
});

redisClient.on("close", () => {
  console.log("🔌 Redis connection closed");
  isRedisAvailable = false;
});

// Try to connect to Redis
redisClient.connect().catch((err) => {
  console.error("⚠️ Redis connection failed:", err);
  console.log("ℹ️ App will run without caching (slower performance)");
});

redisClient.on("ready", () => {
  console.log("🚀 Redis client ready to use");
  isRedisAvailable = true;
});

redisClient.on("close", () => {
  console.log("🔌 Redis connection closed");
  isRedisAvailable = false;
});

/**
 * Cache utility functions
 */

// Standard TTL values (in seconds)
export const TTL = {
  SHORT: 60, // 1 minute - for frequently changing data
  MEDIUM: 300, // 5 minutes - for user stats
  LONG: 3600, // 1 hour - for study session data
  DAY: 86400, // 24 hours - for static data
};

/**
 * Check if Redis is available
 */
export const isAvailable = (): boolean => {
  return isRedisAvailable;
};

/**
 * Get cached value
 */
export const get = async (key: string): Promise<any | null> => {
  if (!isRedisAvailable) return null;
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Redis GET error for key ${key}:`, error);
    return null;
  }
};

/**
 * Set cached value with TTL
 */
export const set = async (
  key: string,
  value: any,
  ttl: number = TTL.MEDIUM
): Promise<boolean> => {
  if (!isRedisAvailable) return false;
  try {
    const serialized = JSON.stringify(value);
    await redisClient.setex(key, ttl, serialized);
    return true;
  } catch (error) {
    console.error(`Redis SET error for key ${key}:`, error);
    return false;
  }
};

/**
 * Delete cached value
 */
export const del = async (key: string): Promise<boolean> => {
  if (!isRedisAvailable) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error(`Redis DEL error for key ${key}:`, error);
    return false;
  }
};

/**
 * Delete multiple keys by pattern
 */
export const delPattern = async (pattern: string): Promise<number> => {
  if (!isRedisAvailable) return 0;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length === 0) return 0;
    await redisClient.del(...keys);
    return keys.length;
  } catch (error) {
    console.error(`Redis DEL pattern error for ${pattern}:`, error);
    return 0;
  }
};

/**
 * Check if key exists
 */
export const exists = async (key: string): Promise<boolean> => {
  if (!isRedisAvailable) return false;
  try {
    const result = await redisClient.exists(key);
    return result === 1;
  } catch (error) {
    console.error(`Redis EXISTS error for key ${key}:`, error);
    return false;
  }
};

/**
 * Increment counter
 */
export const incr = async (key: string): Promise<number> => {
  if (!isRedisAvailable) return 0;
  try {
    return await redisClient.incr(key);
  } catch (error) {
    console.error(`Redis INCR error for key ${key}:`, error);
    return 0;
  }
};

/**
 * Set with expiration time (milliseconds)
 */
export const setex = async (
  key: string,
  value: any,
  ttl: number
): Promise<boolean> => {
  return await set(key, value, ttl);
};

/**
 * Get multiple keys at once
 */
export const mget = async (keys: string[]): Promise<any[]> => {
  if (!isRedisAvailable) return [];
  try {
    const values = await redisClient.mget(...keys);
    return values.map((v) => (v ? JSON.parse(v) : null));
  } catch (error) {
    console.error(`Redis MGET error:`, error);
    return [];
  }
};

/**
 * Flush all cache (use with caution!)
 */
export const flushAll = async (): Promise<boolean> => {
  if (!isRedisAvailable) return false;
  try {
    await redisClient.flushall();
    console.log("⚠️ Redis cache flushed!");
    return true;
  } catch (error) {
    console.error(`Redis FLUSHALL error:`, error);
    return false;
  }
};

// ========================================
// SORTED SET OPERATIONS (for due queue)
// ========================================

/**
 * Add member to sorted set
 * ZADD key score member
 */
export const zadd = async (
  key: string,
  score: number,
  member: string
): Promise<number> => {
  if (!isRedisAvailable) return 0;
  try {
    return await redisClient.zadd(key, score, member);
  } catch (error) {
    console.error(`Redis ZADD error for key ${key}:`, error);
    return 0;
  }
};

/**
 * Remove member from sorted set
 * ZREM key member
 */
export const zrem = async (key: string, member: string): Promise<number> => {
  if (!isRedisAvailable) return 0;
  try {
    return await redisClient.zrem(key, member);
  } catch (error) {
    console.error(`Redis ZREM error for key ${key}:`, error);
    return 0;
  }
};

/**
 * Count members in sorted set with score in range
 * ZCOUNT key min max
 */
export const zcount = async (
  key: string,
  min: string | number,
  max: string | number
): Promise<number> => {
  if (!isRedisAvailable) return 0;
  try {
    return await redisClient.zcount(key, min, max);
  } catch (error) {
    console.error(`Redis ZCOUNT error for key ${key}:`, error);
    return 0;
  }
};

/**
 * Get members by score range
 * ZRANGEBYSCORE key min max [LIMIT offset count]
 */
export const zrangebyscore = async (
  key: string,
  min: string | number,
  max: string | number,
  ...args: any[]
): Promise<string[]> => {
  if (!isRedisAvailable) return [];
  try {
    return await redisClient.zrangebyscore(key, min, max, ...args);
  } catch (error) {
    console.error(`Redis ZRANGEBYSCORE error for key ${key}:`, error);
    return [];
  }
};

/**
 * Get cardinality (count) of sorted set
 * ZCARD key
 */
export const zcard = async (key: string): Promise<number> => {
  if (!isRedisAvailable) return 0;
  try {
    return await redisClient.zcard(key);
  } catch (error) {
    console.error(`Redis ZCARD error for key ${key}:`, error);
    return 0;
  }
};

// ========================================
// HASH OPERATIONS (for statistics cache)
// ========================================

/**
 * Set multiple hash fields
 * HMSET key field1 value1 field2 value2 ...
 */
export const hmset = async (
  key: string,
  data: Record<string, any>
): Promise<string> => {
  if (!isRedisAvailable) return "FAIL";
  try {
    // Convert all values to strings
    const stringData: Record<string, string> = {};
    for (const [k, v] of Object.entries(data)) {
      stringData[k] = String(v);
    }
    return await redisClient.hmset(key, stringData);
  } catch (error) {
    console.error(`Redis HMSET error for key ${key}:`, error);
    return "FAIL";
  }
};

/**
 * Get all hash fields and values
 * HGETALL key
 */
export const hgetall = async (
  key: string
): Promise<Record<string, string> | null> => {
  if (!isRedisAvailable) return null;
  try {
    const data = await redisClient.hgetall(key);
    return Object.keys(data).length > 0 ? data : null;
  } catch (error) {
    console.error(`Redis HGETALL error for key ${key}:`, error);
    return null;
  }
};

/**
 * Get hash field value
 * HGET key field
 */
export const hget = async (
  key: string,
  field: string
): Promise<string | null> => {
  if (!isRedisAvailable) return null;
  try {
    return await redisClient.hget(key, field);
  } catch (error) {
    console.error(`Redis HGET error for key ${key}:`, error);
    return null;
  }
};

/**
 * Increment hash field value
 * HINCRBY key field increment
 */
export const hincrby = async (
  key: string,
  field: string,
  increment: number
): Promise<number> => {
  if (!isRedisAvailable) return 0;
  try {
    return await redisClient.hincrby(key, field, increment);
  } catch (error) {
    console.error(`Redis HINCRBY error for key ${key}:`, error);
    return 0;
  }
};

// ========================================
// SET OPERATIONS (for study dates)
// ========================================

/**
 * Add member to set
 * SADD key member
 */
export const sadd = async (key: string, member: string): Promise<number> => {
  if (!isRedisAvailable) return 0;
  try {
    return await redisClient.sadd(key, member);
  } catch (error) {
    console.error(`Redis SADD error for key ${key}:`, error);
    return 0;
  }
};

/**
 * Get all members of set
 * SMEMBERS key
 */
export const smembers = async (key: string): Promise<string[]> => {
  if (!isRedisAvailable) return [];
  try {
    return await redisClient.smembers(key);
  } catch (error) {
    console.error(`Redis SMEMBERS error for key ${key}:`, error);
    return [];
  }
};

/**
 * Check if member exists in set
 * SISMEMBER key member
 */
export const sismember = async (
  key: string,
  member: string
): Promise<boolean> => {
  if (!isRedisAvailable) return false;
  try {
    const result = await redisClient.sismember(key, member);
    return result === 1;
  } catch (error) {
    console.error(`Redis SISMEMBER error for key ${key}:`, error);
    return false;
  }
};

// ========================================
// UTILITY OPERATIONS
// ========================================

/**
 * Increment by amount
 * INCRBY key increment
 */
export const incrby = async (
  key: string,
  increment: number
): Promise<number> => {
  if (!isRedisAvailable) return 0;
  try {
    return await redisClient.incrby(key, increment);
  } catch (error) {
    console.error(`Redis INCRBY error for key ${key}:`, error);
    return 0;
  }
};

/**
 * Set expiration on key
 * EXPIRE key seconds
 */
export const expire = async (key: string, seconds: number): Promise<number> => {
  if (!isRedisAvailable) return 0;
  try {
    return await redisClient.expire(key, seconds);
  } catch (error) {
    console.error(`Redis EXPIRE error for key ${key}:`, error);
    return 0;
  }
};

// ========================================
// TRANSACTION OPERATIONS
// ========================================

/**
 * Create a Redis transaction pipeline
 * Use this for atomic multi-command operations
 *
 * Example:
 * ```
 * const pipeline = multi();
 * pipeline.incr('user:123:daily:2025-11-19');
 * pipeline.zrem('user:123:due_queue', 'card456');
 * pipeline.zadd('user:123:due_queue', timestamp, 'card456');
 * const results = await execPipeline(pipeline);
 * ```
 */
export const multi = () => {
  if (!isRedisAvailable) {
    // Return a mock pipeline that does nothing
    return {
      incr: () => {},
      incrby: () => {},
      zadd: () => {},
      zrem: () => {},
      sadd: () => {},
      hmset: () => {},
      expire: () => {},
      exec: async () => null,
    };
  }
  return redisClient.multi();
};

/**
 * Execute a Redis pipeline/transaction
 * Returns array of results or null if Redis unavailable
 */
export const execPipeline = async (pipeline: any): Promise<any[] | null> => {
  if (!isRedisAvailable) return null;
  try {
    const results = await pipeline.exec();
    // ioredis exec() returns [[null, result], [null, result], ...]
    // Extract just the results
    return results ? results.map((r: any) => r[1]) : null;
  } catch (error) {
    console.error("Redis EXEC error:", error);
    return null;
  }
};

// Export Redis client for advanced usage
export default redisClient;
