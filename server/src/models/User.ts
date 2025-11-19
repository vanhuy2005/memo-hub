import mongoose, { Document, Schema } from "mongoose";

// Interface for Achievement
interface IAchievement {
  id: string;
  unlocked_at: Date;
}

// Interface for Gamification
interface IGamification {
  xp: number; // Experience points
  level: number; // User level (for mascot evolution)
  currency: number; // Virtual currency for themes/customization
  mascot_mood: "happy" | "sleeping" | "studying" | "celebrating"; // Dynamic mascot mood
  achievements: IAchievement[]; // Unlocked achievements
}

// Interface cho TypeScript
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  learning_target: string;
  daily_goal: number;
  theme: string;
  language: string;
  notifications_enabled: boolean;
  reminder_time: string;
  gamification: IGamification; // New gamification fields
  created_at: Date;
}

// Mongoose Schema
const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    minlength: [3, "Username must be at least 3 characters"],
    maxlength: [30, "Username cannot exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  learning_target: {
    type: String,
    default: "",
  },
  daily_goal: {
    type: Number,
    default: 20,
    min: 5,
    max: 50,
  },
  theme: {
    type: String,
    enum: ["auto", "light", "dark"],
    default: "auto",
  },
  language: {
    type: String,
    enum: ["vi", "en", "zh", "ja", "ko"],
    default: "vi",
  },
  notifications_enabled: {
    type: Boolean,
    default: true,
  },
  reminder_time: {
    type: String,
    default: "09:00",
  },
  gamification: {
    xp: {
      type: Number,
      default: 0,
      min: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
      max: 100,
    },
    currency: {
      type: Number,
      default: 0,
      min: 0,
    },
    mascot_mood: {
      type: String,
      enum: ["happy", "sleeping", "studying", "celebrating"],
      default: "happy",
    },
    achievements: [
      {
        id: {
          type: String,
          required: true,
        },
        unlocked_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Unique indexes for performance (declared once)
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });

export default mongoose.model<IUser>("User", UserSchema);
