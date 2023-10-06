import mongoose, { Schema, Document } from "mongoose";

export interface IBookmark extends Document {
  userId: mongoose.Types.ObjectId;

  title: string;
  url: string;
  note?: string;
  category?: string;
  tags?: string[];

  status: "NOT_STARTED" | "IN_PROGRESS" | "DONE";
  priority: "HIGH" | "MEDIUM" | "LOW";

  reminderEnabled: boolean;
  reminderType?: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";
  reminderDate?: Date;
  nextDue?: Date;
  lastSentAt?: Date;
}

const bookmarkSchema = new Schema<IBookmark>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    note: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
    },

    tags: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["NOT_STARTED", "IN_PROGRESS", "DONE"],
      default: "NOT_STARTED",
    },

    priority: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "LOW",
    },

    reminderEnabled: {
      type: Boolean,
      default: false,
    },

    reminderType: {
      type: String,
      enum: ["ONCE", "DAILY", "WEEKLY", "MONTHLY"],
    },

    reminderDate: Date,

    nextDue: Date,

    lastSentAt: Date,
  },
  { timestamps: true },
);

export const Bookmark = mongoose.model<IBookmark>("Bookmark", bookmarkSchema);
