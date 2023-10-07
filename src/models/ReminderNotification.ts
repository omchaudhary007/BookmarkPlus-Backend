import mongoose, { Schema, Document } from "mongoose";

export interface IReminderNotification extends Document {
  userId: mongoose.Types.ObjectId;
  bookmarkId: mongoose.Types.ObjectId;
  readAt?: Date;
}

const reminderNotificationSchema = new Schema<IReminderNotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bookmarkId: {
      type: Schema.Types.ObjectId,
      ref: "Bookmark",
      required: true,
    },

    readAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const ReminderNotification = mongoose.model<IReminderNotification>(
  "ReminderNotification",
  reminderNotificationSchema,
);
