import { Queue } from "bullmq";
import { isAvailable } from "./redis";

/**
 * BullMQ Queue Configuration (v4+)
 *
 * Purpose: Message queue for background jobs (email, bulk imports)
 * Architecture: Producer-Consumer pattern with Redis as broker
 *
 * Queue Types:
 * - email-notifications: Send async emails (daily reminders, achievements)
 * - bulk-imports: Process large card imports without blocking API
 * - daily-reminders: Scheduled job at 9am for users with cards due
 */

// Redis connection config for BullMQ
// CRITICAL: BullMQ requires maxRetriesPerRequest: null (NOT 3)
// See: https://docs.bullmq.io/guide/connections
const queueConnection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || "0"),
  maxRetriesPerRequest: null, // REQUIRED for BullMQ v4+
  enableReadyCheck: false, // BullMQ handles readiness internally
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    console.log(`🔄 BullMQ Redis retry attempt ${times} (delay: ${delay}ms)`);
    return delay;
  },
};

// Queues
let emailQueue: Queue | null = null;
let bulkImportQueue: Queue | null = null;
let dailyReminderQueue: Queue | null = null;

// Initialize queues only if Redis is available
const initializeQueues = () => {
  try {
    console.log("🔄 Initializing BullMQ queues...");

    // Email Notifications Queue
    emailQueue = new Queue("email-notifications", {
      connection: queueConnection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    });

    // Bulk Import Queue
    bulkImportQueue = new Queue("bulk-imports", {
      connection: queueConnection,
      defaultJobOptions: {
        attempts: 2,
        backoff: {
          type: "fixed",
          delay: 10000,
        },
        removeOnComplete: 20,
        removeOnFail: 10,
      },
    });

    // Daily Reminders Queue (Scheduled)
    dailyReminderQueue = new Queue("daily-reminders", {
      connection: queueConnection,
      defaultJobOptions: {
        attempts: 2,
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    });

    console.log("✅ BullMQ queues initialized successfully");
    console.log("   - email-notifications: Ready");
    console.log("   - bulk-imports: Ready");
    console.log("   - daily-reminders: Ready");
  } catch (error: any) {
    console.warn("⚠️ BullMQ queues not available:", error.message);
    console.log("ℹ️ Background jobs disabled");
    console.log("   Tip: Check Redis connection in .env");
  }
};

// Try to initialize after Redis connects
setTimeout(() => {
  if (isAvailable()) {
    initializeQueues();
  } else {
    console.log("ℹ️ Redis not available, BullMQ queues disabled");
  }
}, 2000);

export { emailQueue, bulkImportQueue, dailyReminderQueue };

/**
 * Job Types
 */
export interface EmailJobData {
  type: "daily-reminder" | "achievement-unlocked" | "level-up" | "welcome";
  userId: string;
  email: string;
  data: {
    name?: string;
    cardsDue?: number;
    achievement?: { id: string; name: string; icon: string };
    level?: number;
    xp?: number;
  };
}

export interface BulkImportJobData {
  userId: string;
  deckId: string;
  cards: Array<{
    front: string;
    back: string;
    tags?: string[];
  }>;
}

/**
 * Helper: Add email job to queue
 */
export const sendEmailJob = async (jobData: EmailJobData) => {
  if (!emailQueue) {
    console.warn("⚠️ Email queue not available, skipping email");
    return null;
  }
  try {
    const job = await emailQueue.add(jobData.type, jobData, {
      priority: jobData.type === "welcome" ? 1 : 5,
    });
    console.log(`📧 Email job queued: ${job.id} (${jobData.type})`);
    return job;
  } catch (error: any) {
    console.error("❌ Failed to add email job:", error.message);
    return null;
  }
};

/**
 * Helper: Add bulk import job
 */
export const addBulkImportJob = async (jobData: BulkImportJobData) => {
  if (!bulkImportQueue) {
    console.warn("⚠️ Bulk import queue not available");
    return null;
  }
  try {
    const job = await bulkImportQueue.add("process-import", jobData);
    console.log(
      `📦 Bulk import job queued: ${job.id} (${jobData.cards.length} cards)`
    );
    return job;
  } catch (error: any) {
    console.error("❌ Failed to add bulk import job:", error.message);
    return null;
  }
};

/**
 * Helper: Schedule daily reminders (9am every day)
 */
export const scheduleDailyReminders = async () => {
  if (!dailyReminderQueue) {
    console.warn("⚠️ Daily reminder queue not available");
    return;
  }
  try {
    // Remove existing repeatable jobs
    const repeatableJobs = await dailyReminderQueue.getRepeatableJobs();
    for (const job of repeatableJobs) {
      await dailyReminderQueue.removeRepeatableByKey(job.key);
    }

    // Add new repeatable job
    await dailyReminderQueue.add(
      "send-daily-reminders",
      {},
      {
        repeat: {
          pattern: "0 9 * * *", // 9:00 AM daily
          tz: "Asia/Ho_Chi_Minh",
        },
      }
    );

    console.log("⏰ Daily reminders scheduled: 9:00 AM VN time");
  } catch (error: any) {
    console.error("❌ Failed to schedule daily reminders:", error.message);
  }
};

/**
 * Graceful Shutdown
 */
export const closeQueues = async () => {
  console.log("🛑 Closing BullMQ queues...");
  try {
    if (emailQueue) await emailQueue.close();
    if (bulkImportQueue) await bulkImportQueue.close();
    if (dailyReminderQueue) await dailyReminderQueue.close();
    console.log("✅ All queues closed");
  } catch (error: any) {
    console.error("❌ Error closing queues:", error.message);
  }
};

// Event Listeners
setTimeout(() => {
  if (emailQueue) {
    emailQueue.on("error", (err: Error) => {
      console.error("❌ Email queue error:", err.message);
    });
  }

  if (bulkImportQueue) {
    bulkImportQueue.on("error", (err: Error) => {
      console.error("❌ Bulk import queue error:", err.message);
    });
  }

  if (dailyReminderQueue) {
    dailyReminderQueue.on("error", (err: Error) => {
      console.error("❌ Daily reminder queue error:", err.message);
    });
  }
}, 3000);
