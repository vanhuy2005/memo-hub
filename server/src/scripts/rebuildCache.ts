/**
 * Rebuild Redis Cache from MongoDB
 * Use this after seeding database or when Redis cache is out of sync
 */

import dotenv from "dotenv";
dotenv.config();

import * as redisOps from "../services/redisOperations";
import Card from "../models/Card";
import User from "../models/User";
import "../config/redis"; // Initialize Redis connection

async function rebuildCacheForUser(userId: string) {
  console.log(`\n🔄 Rebuilding cache for user: ${userId}`);

  // 1. Get all cards for this user
  const cards = await Card.find({ user_id: userId }).select(
    "_id deck_id srs_status"
  );

  console.log(`   Found ${cards.length} cards`);

  // 2. Rebuild due queue
  await redisOps.rebuildDueQueue(userId, cards as any);

  // 3. Count due cards (cards with next_review_at <= now)
  const now = new Date();
  const dueCards = cards.filter(
    (card) => card.srs_status.next_review_at <= now
  );

  console.log(`   ✅ ${dueCards.length} cards due today`);
  console.log(`   ✅ Due queue rebuilt with ${cards.length} cards`);
}

async function main() {
  try {
    console.log("🔄 Starting cache rebuild...\n");

    // Import database connection (already configured)
    const { connectDB } = await import("../config/database");
    await connectDB();
    console.log("✅ MongoDB connected");

    // Redis is already connected via import
    console.log("✅ Redis connected\n");

    // Get all users
    const users = await User.find().select("_id email username");

    console.log(`Found ${users.length} users\n`);
    console.log("═".repeat(50));

    // Rebuild cache for each user
    for (const user of users) {
      await rebuildCacheForUser(user._id.toString());
    }

    console.log("\n═".repeat(50));
    console.log("\n✅ Cache rebuild completed!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
