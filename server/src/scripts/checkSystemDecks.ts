import mongoose from "mongoose";
import dotenv from "dotenv";
import SystemDeck from "../models/SystemDeck";
import SystemCard from "../models/SystemCard";

dotenv.config();

async function checkSystemDecks() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("✅ Connected to MongoDB");

    // List all collections
    const collections = await mongoose.connection.db
      ?.listCollections()
      .toArray();
    console.log("\n📂 Collections in database:");
    collections?.forEach((col) => {
      console.log(`  - ${col.name}`);
    });

    // Count system decks directly from collection
    const directCount = await mongoose.connection.db
      ?.collection("systemdecks")
      .countDocuments();
    console.log(`\n📊 Direct count from systemdecks: ${directCount}`);

    // Count system decks via model
    const deckCount = await SystemDeck.countDocuments();
    console.log(`📊 Model count from SystemDeck: ${deckCount}`);

    // Get all decks
    const decks = await SystemDeck.find().select(
      "name language level card_count is_active"
    );

    console.log("\n📚 System Decks:");
    decks.forEach((deck, index) => {
      console.log(
        `${index + 1}. ${deck.name} (${deck.language} - ${deck.level}) - ${
          deck.card_count
        } cards - Active: ${deck.is_active}`
      );
    });

    // Count system cards
    const cardCount = await SystemCard.countDocuments();
    console.log(`\n🃏 Total System Cards: ${cardCount}`);

    // Group cards by deck
    const cardsByDeck = await SystemCard.aggregate([
      {
        $group: {
          _id: "$system_deck_id",
          count: { $sum: 1 },
        },
      },
    ]);

    console.log("\n📋 Cards per Deck:");
    for (const group of cardsByDeck) {
      const deck = await SystemDeck.findById(group._id);
      if (deck) {
        console.log(`  ${deck.name}: ${group.count} cards`);
      }
    }

    console.log("\n✅ Check completed!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

checkSystemDecks();
