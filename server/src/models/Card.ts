import mongoose, { Document, Schema } from "mongoose";

// Sub-document interface cho SRS Status
export interface ISRSStatus {
  interval: number; // Khoảng cách ngày đến lần ôn tiếp theo
  ease_factor: number; // Độ dễ (2.5 là mặc định theo SM-2)
  next_review_at: Date; // Ngày ôn tập tiếp theo
}

// Interface cho Card
export interface ICard extends Document {
  deck_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  front_content: string;
  back_content: string;
  pronunciation?: string;
  example_sentence?: string;
  srs_status: ISRSStatus;
  created_at: Date;
}

// Sub-schema cho SRS Status
const SRSStatusSchema: Schema = new Schema(
  {
    interval: {
      type: Number,
      default: 0,
      min: 0,
    },
    ease_factor: {
      type: Number,
      default: 2.5,
      min: 1.3, // Không cho phép ease_factor quá thấp
    },
    next_review_at: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Main Card Schema
const CardSchema: Schema = new Schema({
  deck_id: {
    type: Schema.Types.ObjectId,
    ref: "Deck",
    required: [true, "Deck ID is required"],
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  front_content: {
    type: String,
    required: [true, "Front content is required"],
    trim: true,
  },
  back_content: {
    type: String,
    required: [true, "Back content is required"],
    trim: true,
  },
  pronunciation: {
    type: String,
    trim: true,
    default: "",
  },
  example_sentence: {
    type: String,
    trim: true,
    default: "",
  },
  srs_status: {
    type: SRSStatusSchema,
    default: () => ({
      interval: 0,
      ease_factor: 2.5,
      next_review_at: new Date(),
    }),
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for performance optimization
CardSchema.index({ user_id: 1, "srs_status.next_review_at": 1 });
CardSchema.index({ deck_id: 1 });

export default mongoose.model<ICard>("Card", CardSchema);
