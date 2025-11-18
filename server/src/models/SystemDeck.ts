import mongoose, { Document, Schema } from "mongoose";

// Interface cho TypeScript
export interface ISystemDeck extends Document {
  name: string;
  description: string;
  language: string; // "en", "ja", "ko", "zh"
  level: string; // "IELTS 5.0", "IELTS 6.0", "N5", "N4", "TOPIK 1", "HSK 1"
  category: string; // "Vocabulary", "Grammar", "Phrases"
  card_count: number;
  is_active: boolean;
  created_at: Date;
}

// Mongoose Schema
const SystemDeckSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, "Deck name is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  language: {
    type: String,
    enum: ["en", "ja", "ko", "zh"],
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "Vocabulary",
  },
  card_count: {
    type: Number,
    default: 0,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
SystemDeckSchema.index({ language: 1, level: 1 });
SystemDeckSchema.index({ is_active: 1 });

export default mongoose.model<ISystemDeck>(
  "SystemDeck",
  SystemDeckSchema,
  "systemdecks"
);
