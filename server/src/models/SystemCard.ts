import mongoose, { Document, Schema } from "mongoose";

// Interface cho TypeScript
export interface ISystemCard extends Document {
  system_deck_id: mongoose.Types.ObjectId;
  front_content: string;
  back_content: string;
  pronunciation?: string;
  example_sentence?: string;
  created_at: Date;
}

// Main Card Schema
const SystemCardSchema: Schema = new Schema({
  system_deck_id: {
    type: Schema.Types.ObjectId,
    ref: "SystemDeck",
    required: [true, "System Deck ID is required"],
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
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Index
SystemCardSchema.index({ system_deck_id: 1 });

export default mongoose.model<ISystemCard>(
  "SystemCard",
  SystemCardSchema,
  "systemcards"
);
