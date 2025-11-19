require("dotenv").config();
const mongoose = require("mongoose");

// Define ReviewHistory schema inline
const reviewHistorySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  card_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Card",
    required: true,
  },
  deck_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Deck",
    required: true,
  },
  grade: { type: Number, required: true },
  review_date: { type: Date, default: Date.now },
  interval_before: { type: Number },
  interval_after: { type: Number },
});

const ReviewHistory = mongoose.model("ReviewHistory", reviewHistorySchema);

async function checkReviewHistory() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Calculate today's date range using Vietnam timezone
    const now = new Date();
    const vietnamOffset = 7 * 60; // UTC+7
    const localOffset = now.getTimezoneOffset();
    const offsetDiff = vietnamOffset + localOffset;

    const todayStart = new Date(now.getTime() + offsetDiff * 60 * 1000);
    todayStart.setHours(0, 0, 0, 0);
    todayStart.setTime(todayStart.getTime() - offsetDiff * 60 * 1000);

    const todayEnd = new Date(now.getTime() + offsetDiff * 60 * 1000);
    todayEnd.setHours(23, 59, 59, 999);
    todayEnd.setTime(todayEnd.getTime() - offsetDiff * 60 * 1000);

    console.log("📅 Vietnam Timezone Check:");
    console.log(`   Current UTC time: ${now.toISOString()}`);
    console.log(
      `   Vietnam time: ${new Date(now.getTime() + vietnamOffset * 60 * 1000)
        .toISOString()
        .replace("Z", " VN")}`
    );
    console.log(`   Today start (UTC): ${todayStart.toISOString()}`);
    console.log(`   Today end (UTC): ${todayEnd.toISOString()}\n`);

    // Get today's reviews
    const todayReviews = await ReviewHistory.find({
      review_date: { $gte: todayStart, $lte: todayEnd },
    })
      .sort({ review_date: -1 })
      .limit(20);

    console.log(`📊 Reviews today: ${todayReviews.length} records\n`);

    if (todayReviews.length > 0) {
      console.log("Recent reviews:");
      todayReviews.forEach((review, idx) => {
        const vietnamTime = new Date(
          review.review_date.getTime() + vietnamOffset * 60 * 1000
        );
        console.log(
          `   ${idx + 1}. ${review.review_date.toISOString()} (VN: ${vietnamTime
            .toISOString()
            .replace("Z", "")})`
        );
      });
    } else {
      console.log("⚠️  No reviews found for today!");
      console.log("\nLet's check all recent reviews:");

      const recentReviews = await ReviewHistory.find()
        .sort({ review_date: -1 })
        .limit(10);

      console.log(`\n📊 Last 10 reviews in database:`);
      recentReviews.forEach((review, idx) => {
        const vietnamTime = new Date(
          review.review_date.getTime() + vietnamOffset * 60 * 1000
        );
        console.log(
          `   ${idx + 1}. ${review.review_date.toISOString()} (VN: ${vietnamTime
            .toISOString()
            .replace("Z", "")})`
        );
      });
    }

    // Check all reviews count
    const totalReviews = await ReviewHistory.countDocuments();
    console.log(`\n📈 Total reviews in database: ${totalReviews}`);

    await mongoose.disconnect();
    console.log("\n✅ Done!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

checkReviewHistory();
