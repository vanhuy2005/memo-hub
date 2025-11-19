import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../models/User";
import Card from "../models/Card";
import ReviewHistory from "../models/ReviewHistory";
import { connectDB } from "../config/database";

const checkUser = async () => {
  try {
    await connectDB();

    const email = "nguyen.van.quang.huy.2105@gmail.com";
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return;
    }

    console.log(`✅ User found: ${user.username} (${user._id})`);

    const totalCards = await Card.countDocuments({ user_id: user._id });
    const newCards = await Card.countDocuments({
      user_id: user._id,
      "srs_status.interval": 0,
    });
    const masteredCards = await Card.countDocuments({
      user_id: user._id,
      "srs_status.interval": { $gte: 7 },
      "srs_status.ease_factor": { $gte: 2.0 },
    });

    const reviews = await ReviewHistory.countDocuments({ user_id: user._id });

    console.log("📊 Database Stats:");
    console.log(`- Total Cards: ${totalCards}`);
    console.log(`- New Cards: ${newCards}`);
    console.log(`- Mastered Cards: ${masteredCards}`);
    console.log(`- Total Reviews: ${reviews}`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
};

checkUser();
