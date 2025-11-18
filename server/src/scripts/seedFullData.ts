import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User";
import Deck from "../models/Deck";
import Card from "../models/Card";
import ReviewHistory from "../models/ReviewHistory";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/memohub";

// Helper: Tạo ngày trong quá khứ
const daysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

// Helper: Tạo ngày trong tương lai
const daysFromNow = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

async function seedFullData() {
  try {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected successfully!");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Deck.deleteMany({});
    await Card.deleteMany({});
    await ReviewHistory.deleteMany({});
    console.log("✅ Cleared!");

    // ========== 1. TẠO USER ==========
    console.log("\n👤 Creating test user...");
    const hashedPassword = await bcrypt.hash("123456", 10);

    const user = await User.create({
      username: "testuser",
      email: "test@memohub.com",
      password: hashedPassword,
      learning_target: "Chuẩn bị thi IELTS 7.0",
      daily_goal: 30,
      theme: "dark",
      language: "vi",
      notifications_enabled: true,
      reminder_time: "08:00",
      created_at: daysAgo(60), // Đăng ký cách đây 60 ngày
    });

    console.log(`✅ Created user: ${user.email} (ID: ${user._id})`);

    // ========== 2. TẠO DECKS ==========
    console.log("\n📚 Creating decks...");

    const deck1 = await Deck.create({
      owner_id: user._id,
      name: "IELTS Essential Vocabulary",
      description: "Từ vựng thiết yếu cho IELTS Writing & Speaking",
      is_public: false,
      created_at: daysAgo(50),
    });

    const deck2 = await Deck.create({
      owner_id: user._id,
      name: "Business English",
      description: "Tiếng Anh thương mại và công sở",
      is_public: false,
      created_at: daysAgo(45),
    });

    const deck3 = await Deck.create({
      owner_id: user._id,
      name: "Academic Writing",
      description: "Từ vựng cho bài luận học thuật",
      is_public: false,
      created_at: daysAgo(30),
    });

    console.log(`✅ Created 3 decks`);

    // ========== 3. TẠO CARDS ==========
    console.log("\n📝 Creating cards with varied SRS statuses...");

    // Deck 1: 30 cards - Mixed statuses (simulating active learning)
    const deck1Cards = [
      // 10 MASTERED cards (interval >= 7, ease >= 2.0)
      ...Array(10)
        .fill(null)
        .map((_, i) => ({
          deck_id: deck1._id,
          user_id: user._id,
          front_content: `Mastered Word ${i + 1}`,
          back_content: `Nghĩa của từ đã thành thạo ${i + 1}`,
          pronunciation: `/prəˌnʌnsiˈeɪʃən/`,
          example_sentence: `Example sentence for mastered word ${i + 1}.`,
          srs_status: {
            interval: 7 + Math.floor(Math.random() * 20), // 7-26 days
            ease_factor: 2.0 + Math.random() * 0.8, // 2.0-2.8
            next_review_at: daysFromNow(3 + Math.floor(Math.random() * 10)), // Review in 3-12 days
          },
          created_at: daysAgo(40 - i),
        })),

      // 10 LEARNING cards (interval 1-6)
      ...Array(10)
        .fill(null)
        .map((_, i) => ({
          deck_id: deck1._id,
          user_id: user._id,
          front_content: `Learning Word ${i + 1}`,
          back_content: `Nghĩa của từ đang học ${i + 1}`,
          pronunciation: `/ˈləːnɪŋ/`,
          example_sentence: `Example sentence for learning word ${i + 1}.`,
          srs_status: {
            interval: 1 + Math.floor(Math.random() * 5), // 1-5 days
            ease_factor: 1.8 + Math.random() * 0.6, // 1.8-2.4
            next_review_at: Math.random() > 0.5 ? new Date() : daysFromNow(1), // 50% due today
          },
          created_at: daysAgo(30 - i),
        })),

      // 10 NEW cards (interval = 0)
      ...Array(10)
        .fill(null)
        .map((_, i) => ({
          deck_id: deck1._id,
          user_id: user._id,
          front_content: `New Word ${i + 1}`,
          back_content: `Nghĩa của từ mới ${i + 1}`,
          pronunciation: `/njuː/`,
          example_sentence: `Example sentence for new word ${i + 1}.`,
          srs_status: {
            interval: 0,
            ease_factor: 2.5,
            next_review_at: new Date(), // Due now
          },
          created_at: daysAgo(5 - i),
        })),
    ];

    // Deck 2: 20 cards - Mostly new and learning
    const deck2Cards = [
      // 5 MASTERED
      ...Array(5)
        .fill(null)
        .map((_, i) => ({
          deck_id: deck2._id,
          user_id: user._id,
          front_content: `Business Term ${i + 1}`,
          back_content: `Thuật ngữ kinh doanh ${i + 1}`,
          pronunciation: `/ˈbɪznəs/`,
          example_sentence: `Business example ${i + 1}.`,
          srs_status: {
            interval: 10 + Math.floor(Math.random() * 15),
            ease_factor: 2.2 + Math.random() * 0.6,
            next_review_at: daysFromNow(5 + Math.floor(Math.random() * 8)),
          },
          created_at: daysAgo(35 - i),
        })),

      // 8 LEARNING
      ...Array(8)
        .fill(null)
        .map((_, i) => ({
          deck_id: deck2._id,
          user_id: user._id,
          front_content: `Office Vocab ${i + 1}`,
          back_content: `Từ vựng văn phòng ${i + 1}`,
          pronunciation: `/ˈɒfɪs/`,
          example_sentence: `Office example ${i + 1}.`,
          srs_status: {
            interval: 1 + Math.floor(Math.random() * 4),
            ease_factor: 1.9 + Math.random() * 0.5,
            next_review_at: Math.random() > 0.3 ? new Date() : daysFromNow(1),
          },
          created_at: daysAgo(20 - i),
        })),

      // 7 NEW
      ...Array(7)
        .fill(null)
        .map((_, i) => ({
          deck_id: deck2._id,
          user_id: user._id,
          front_content: `New Business ${i + 1}`,
          back_content: `Từ kinh doanh mới ${i + 1}`,
          pronunciation: `/njuː/`,
          example_sentence: `New business example ${i + 1}.`,
          srs_status: {
            interval: 0,
            ease_factor: 2.5,
            next_review_at: new Date(),
          },
          created_at: daysAgo(3 - Math.floor(i / 3)),
        })),
    ];

    // Deck 3: 15 cards - Fresh deck
    const deck3Cards = [
      // 2 MASTERED
      ...Array(2)
        .fill(null)
        .map((_, i) => ({
          deck_id: deck3._id,
          user_id: user._id,
          front_content: `Academic ${i + 1}`,
          back_content: `Học thuật ${i + 1}`,
          pronunciation: `/ˌækəˈdemɪk/`,
          example_sentence: `Academic example ${i + 1}.`,
          srs_status: {
            interval: 8 + Math.floor(Math.random() * 5),
            ease_factor: 2.3 + Math.random() * 0.4,
            next_review_at: daysFromNow(4 + Math.floor(Math.random() * 5)),
          },
          created_at: daysAgo(25 - i),
        })),

      // 5 LEARNING
      ...Array(5)
        .fill(null)
        .map((_, i) => ({
          deck_id: deck3._id,
          user_id: user._id,
          front_content: `Essay Word ${i + 1}`,
          back_content: `Từ viết luận ${i + 1}`,
          pronunciation: `/ˈeseɪ/`,
          example_sentence: `Essay example ${i + 1}.`,
          srs_status: {
            interval: 1 + Math.floor(Math.random() * 3),
            ease_factor: 2.0 + Math.random() * 0.4,
            next_review_at: new Date(),
          },
          created_at: daysAgo(15 - i),
        })),

      // 8 NEW
      ...Array(8)
        .fill(null)
        .map((_, i) => ({
          deck_id: deck3._id,
          user_id: user._id,
          front_content: `New Academic ${i + 1}`,
          back_content: `Từ học thuật mới ${i + 1}`,
          pronunciation: `/njuː/`,
          example_sentence: `New academic example ${i + 1}.`,
          srs_status: {
            interval: 0,
            ease_factor: 2.5,
            next_review_at: new Date(),
          },
          created_at: daysAgo(2),
        })),
    ];

    const allCards = [...deck1Cards, ...deck2Cards, ...deck3Cards];
    await Card.insertMany(allCards);

    console.log(`✅ Created ${allCards.length} cards`);
    console.log(`   - Deck 1: 30 cards (10 mastered, 10 learning, 10 new)`);
    console.log(`   - Deck 2: 20 cards (5 mastered, 8 learning, 7 new)`);
    console.log(`   - Deck 3: 15 cards (2 mastered, 5 learning, 8 new)`);

    // ========== 4. TẠO REVIEW HISTORY ==========
    console.log("\n📊 Creating review history (30 days)...");

    const reviewHistories: any[] = [];
    const allCreatedCards = await Card.find({ user_id: user._id });

    // Tạo reviews cho 30 ngày qua
    for (let day = 30; day >= 1; day--) {
      const reviewDate = daysAgo(day);

      // Số lượng reviews mỗi ngày (10-40 cards)
      const reviewsPerDay = 10 + Math.floor(Math.random() * 30);

      // Chọn random cards để review
      const cardsToReview = allCreatedCards
        .filter((card) => {
          // Chỉ review cards đã tạo trước ngày review
          return card.created_at <= reviewDate;
        })
        .sort(() => Math.random() - 0.5)
        .slice(0, reviewsPerDay);

      for (const card of cardsToReview) {
        // Grade distribution: Again(10%), Hard(20%), Good(50%), Easy(20%)
        const rand = Math.random();
        let grade = 2; // Default: Good
        if (rand < 0.1) grade = 0; // Again
        else if (rand < 0.3) grade = 1; // Hard
        else if (rand < 0.8) grade = 2; // Good
        else grade = 3; // Easy

        const oldInterval = card.srs_status.interval;

        // Simulate interval changes based on grade
        let newInterval = oldInterval;
        if (grade === 0) {
          newInterval = 0; // Reset
        } else if (grade === 1) {
          newInterval = Math.max(1, Math.floor(oldInterval * 1.2));
        } else if (grade === 2) {
          newInterval = Math.max(1, Math.floor(oldInterval * 2.5));
        } else {
          newInterval = Math.max(1, Math.floor(oldInterval * 3));
        }

        reviewHistories.push({
          user_id: user._id,
          card_id: card._id,
          deck_id: card.deck_id,
          grade,
          review_date: reviewDate,
          time_spent_seconds: 3 + Math.floor(Math.random() * 10), // 3-12 seconds
          interval_before: oldInterval,
          interval_after: newInterval,
        });
      }
    }

    await ReviewHistory.insertMany(reviewHistories);

    console.log(`✅ Created ${reviewHistories.length} review history entries`);

    // ========== 5. THỐNG KÊ TỔNG KẾT ==========
    console.log("\n\n🎉 Seeding completed successfully!");
    console.log("\n📊 SUMMARY:");
    console.log("═══════════════════════════════════════");

    const totalDecks = await Deck.countDocuments({ owner_id: user._id });
    const totalCards = await Card.countDocuments({ user_id: user._id });
    const masteredCards = await Card.countDocuments({
      user_id: user._id,
      "srs_status.interval": { $gte: 7 },
      "srs_status.ease_factor": { $gte: 2.0 },
    });
    const learningCards = await Card.countDocuments({
      user_id: user._id,
      "srs_status.interval": { $gt: 0, $lt: 7 },
    });
    const newCards = await Card.countDocuments({
      user_id: user._id,
      "srs_status.interval": 0,
    });
    const dueToday = await Card.countDocuments({
      user_id: user._id,
      "srs_status.next_review_at": { $lte: new Date() },
    });
    const totalReviews = await ReviewHistory.countDocuments({
      user_id: user._id,
    });

    // Tính streak
    const reviewDates = await ReviewHistory.aggregate([
      { $match: { user_id: user._id } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$review_date" },
          },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    let currentStreak = 0;
    if (reviewDates.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastReviewDate = new Date(reviewDates[0]._id);
      lastReviewDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (today.getTime() - lastReviewDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays <= 1) {
        currentStreak = 1;
        for (let i = 1; i < reviewDates.length; i++) {
          const currentDate = new Date(reviewDates[i]._id);
          const prevDate = new Date(reviewDates[i - 1]._id);
          const diff = Math.floor(
            (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (diff === 1) currentStreak++;
          else break;
        }
      }
    }

    console.log(`👤 User: ${user.email}`);
    console.log(`   Password: 123456`);
    console.log(`   Member since: ${user.created_at.toLocaleDateString()}`);
    console.log(`\n📚 Decks: ${totalDecks}`);
    console.log(`\n📝 Cards: ${totalCards}`);
    console.log(
      `   ✅ Mastered: ${masteredCards} (${Math.round(
        (masteredCards / totalCards) * 100
      )}%)`
    );
    console.log(
      `   ⏳ Learning: ${learningCards} (${Math.round(
        (learningCards / totalCards) * 100
      )}%)`
    );
    console.log(
      `   📝 New: ${newCards} (${Math.round((newCards / totalCards) * 100)}%)`
    );
    console.log(`   🔔 Due today: ${dueToday}`);
    console.log(`\n📊 Review History:`);
    console.log(`   Total reviews: ${totalReviews}`);
    console.log(`   Current streak: ${currentStreak} days`);
    console.log(`   Avg reviews/day: ${Math.round(totalReviews / 30)}`);
    console.log("\n═══════════════════════════════════════");
    console.log("\n✨ You can now login and see full statistics!");
    console.log("   Email: test@memohub.com");
    console.log("   Password: 123456\n");

    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seedFullData();
