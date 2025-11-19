import { Worker, Job } from "bullmq";
import nodemailer from "nodemailer";

/**
 * Email Worker - Processes email notification jobs
 *
 * Purpose: Send async emails without blocking API requests
 * Queue: email-notifications
 *
 * Job Types:
 * - daily-reminder: "Bạn có X thẻ cần ôn hôm nay!"
 * - achievement-unlocked: "🎉 Bạn vừa mở khóa achievement!"
 * - level-up: "🎊 Chúc mừng! Bạn vừa lên Level X!"
 * - welcome: "Chào mừng đến với MemoHub!"
 */

// Type definition (duplicated from queue.ts to avoid module resolution issues)
interface EmailJobData {
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

// Nodemailer transport configuration
// IMPORTANT: For Gmail, use App Password, not regular password
// Get App Password: https://myaccount.google.com/apppasswords
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // Use 587 for TLS, 465 for SSL
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Gmail App Password (16 characters, no spaces)
  },
  tls: {
    rejectUnauthorized: false, // Accept self-signed certs (for development)
  },
});

// Verify connection on startup
transporter.verify((error, _success) => {
  if (error) {
    console.error("❌ Email transport error:", error.message);
    console.log("   Tip: Use Gmail App Password (not regular password)");
    console.log(
      "   Get App Password: https://myaccount.google.com/apppasswords"
    );
  } else {
    console.log("✅ Email server ready to send messages");
    console.log(`   - User: ${process.env.EMAIL_USER}`);
  }
});

/**
 * Email Templates
 */

const emailTemplates = {
  "daily-reminder": (data: EmailJobData["data"]) => ({
    subject: "🔔 Reminder: Bạn có thẻ cần ôn hôm nay!",
    html: `
      <div style="font-family: 'Nunito', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #86A789;">Chào ${data.name}! 👋</h1>
        <p style="font-size: 16px; color: #555;">
          Bạn có <strong>${data.cardsDue}</strong> thẻ cần ôn tập hôm nay.
        </p>
        <p style="color: #777;">
          Đừng để chuỗi ngày học của bạn bị gián đoạn nhé! 🔥
        </p>
        <a href="${process.env.FRONTEND_URL}/study" 
           style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #B5C99A 0%, #86A789 100%); color: white; text-decoration: none; border-radius: 25px; margin-top: 20px;">
          Bắt đầu học ngay
        </a>
      </div>
    `,
  }),

  "achievement-unlocked": (data: EmailJobData["data"]) => ({
    subject: `🎉 Bạn vừa mở khóa achievement: ${data.achievement?.name}`,
    html: `
      <div style="font-family: 'Nunito', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
        <h1 style="font-size: 48px;">${data.achievement?.icon}</h1>
        <h2 style="color: #86A789;">Chúc mừng ${data.name}!</h2>
        <p style="font-size: 18px; color: #555;">
          Bạn vừa mở khóa achievement <strong>${data.achievement?.name}</strong>
        </p>
        <p style="color: #777;">
          Tiếp tục phát huy nhé! Bạn đang làm rất tốt! 🌟
        </p>
      </div>
    `,
  }),

  "level-up": (data: EmailJobData["data"]) => ({
    subject: `🎊 Chúc mừng! Bạn vừa lên Level ${data.level}!`,
    html: `
      <div style="font-family: 'Nunito', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; background: linear-gradient(135deg, #FFE5E5 0%, #F3F8F2 100%); border-radius: 20px;">
        <h1 style="font-size: 64px;">🎊</h1>
        <h2 style="color: #86A789;">Level Up!</h2>
        <p style="font-size: 24px; color: #555;">
          Bạn vừa đạt <strong>Level ${data.level}</strong>!
        </p>
        <p style="font-size: 18px; color: #777;">
          Tổng XP: ${data.xp}
        </p>
        <p style="color: #999;">
          Bạn thật tuyệt vời! Hãy tiếp tục chinh phục những level mới! 🚀
        </p>
      </div>
    `,
  }),

  welcome: (data: EmailJobData["data"]) => ({
    subject: "Chào mừng đến với MemoHub! 🎉",
    html: `
      <div style="font-family: 'Nunito', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #86A789;">Xin chào ${data.name}! 👋</h1>
        <p style="font-size: 16px; color: #555;">
          Cảm ơn bạn đã tham gia <strong>MemoHub</strong> - ứng dụng học flashcard với AI và gamification!
        </p>
        <p style="color: #777;">
          Hãy bắt đầu tạo bộ thẻ đầu tiên của bạn và trải nghiệm hệ thống SRS thông minh! 🧠
        </p>
        <a href="${process.env.FRONTEND_URL}/decks" 
           style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #B5C99A 0%, #86A789 100%); color: white; text-decoration: none; border-radius: 25px; margin-top: 20px;">
          Tạo bộ thẻ đầu tiên
        </a>
      </div>
    `,
  }),
};

/**
 * Email Worker
 */
let emailWorker: Worker<EmailJobData> | null = null;

try {
  emailWorker = new Worker<EmailJobData>(
    "email-notifications",
    async (job: Job<EmailJobData>) => {
      const { type, email, data } = job.data;

      console.log(`\n📧 ========== EMAIL WORKER ==========`);
      console.log(`   Job ID: ${job.id}`);
      console.log(`   Type: ${type}`);
      console.log(`   To: ${email}`);
      console.log(
        `   Attempt: ${job.attemptsMade + 1}/${job.opts.attempts || 3}`
      );
      console.log(`====================================\n`);

      try {
        // Get email template (type assertion to fix TypeScript indexing)
        const template =
          emailTemplates[type as keyof typeof emailTemplates](data);

        // Send email
        const info = await transporter.sendMail({
          from: `"MemoHub 🧠" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: template.subject,
          html: template.html,
        });

        console.log(`\n✅ ========== EMAIL SUCCESS ==========`);
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`   To: ${email}`);
        console.log(`   Type: ${type}`);
        console.log(`   Response: ${info.response}`);
        console.log(`====================================\n`);

        return { success: true, messageId: info.messageId };
      } catch (error: any) {
        console.error(`\n❌ ========== EMAIL FAILED ==========`);
        console.error(`   Job ID: ${job.id}`);
        console.error(`   Type: ${type}`);
        console.error(`   Email: ${email}`);
        console.error(`   Error: ${error.message}`);
        console.error(`   Code: ${error.code}`);
        console.error(`   Stack: ${error.stack?.split("\n")[0]}`);
        console.error(`====================================\n`);
        throw error; // BullMQ will retry automatically
      }
    },
    {
      connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
        password: process.env.REDIS_PASSWORD || undefined,
        db: parseInt(process.env.REDIS_DB || "0"),
        maxRetriesPerRequest: null, // REQUIRED for BullMQ v4+
        enableReadyCheck: false,
        retryStrategy(times: number) {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      },
      concurrency: 5, // Process 5 emails simultaneously
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 50 },
    }
  );

  // Event listeners
  emailWorker.on("completed", (job: Job) => {
    console.log(`✅ [WORKER] Job completed: ${job.id} (${job.name})`);
  });

  emailWorker.on("failed", (job: Job | undefined, err: Error) => {
    console.error(`❌ [WORKER] Job FAILED: ${job?.id}`);
    console.error(`   - Error: ${err.message}`);
    console.error(`   - Stack: ${err.stack}`);
  });

  emailWorker.on("error", (err: Error) => {
    console.error("❌ [WORKER] Worker error:", err.message);
  });

  console.log("🚀 Email worker started successfully");
  console.log("   - Concurrency: 5 emails");
  console.log("   - Queue: email-notifications");
} catch (error: any) {
  console.warn("⚠️ Email worker not available:", error.message);
  console.log("ℹ️ Email notifications disabled");
}

export default emailWorker;
