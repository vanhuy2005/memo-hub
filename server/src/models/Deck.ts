import mongoose, { Document, Schema } from "mongoose";

// Interface cho TypeScript
export interface IDeck extends Document {
  owner_id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  is_public: boolean;
  created_at: Date;
}

// Mongoose Schema
const DeckSchema: Schema = new Schema({
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Owner ID is required"],
  },
  name: {
    type: String,
    required: [true, "Deck name is required"],
    trim: true,
    maxlength: [100, "Deck name cannot exceed 100 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"],
    default: "",
  },
  is_public: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for performance
DeckSchema.index({ owner_id: 1 });
DeckSchema.index({ is_public: 1 });

export default mongoose.model<IDeck>("Deck", DeckSchema);
