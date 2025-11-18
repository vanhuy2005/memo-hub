import mongoose, { Document, Schema } from "mongoose";

export interface IReviewHistory extends Document {
  user_id: mongoose.Types.ObjectId;
  card_id: mongoose.Types.ObjectId;
  deck_id: mongoose.Types.ObjectId;
  grade: number; // 0-3
  review_date: Date;
  time_spent_seconds?: number; // Optional: thời gian ôn tập
  interval_before: number; // Interval trước khi review
  interval_after: number; // Interval sau khi review
}

const ReviewHistorySchema = new Schema<IReviewHistory>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    card_id: {
      type: Schema.Types.ObjectId,
      ref: "Card",
      required: true,
    },
    deck_id: {
      type: Schema.Types.ObjectId,
      ref: "Deck",
      required: true,
    },
    grade: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
    review_date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    time_spent_seconds: {
      type: Number,
      default: 0,
    },
    interval_before: {
      type: Number,
      required: true,
    },
    interval_after: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index cho query hiệu quả
ReviewHistorySchema.index({ user_id: 1, review_date: -1 });
ReviewHistorySchema.index({ user_id: 1, deck_id: 1 });

export default mongoose.model<IReviewHistory>(
  "ReviewHistory",
  ReviewHistorySchema
);
