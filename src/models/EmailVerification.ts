import mongoose, { Schema, Document } from "mongoose";

export interface IEmailVerification extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const emailVerificationSchema = new Schema<IEmailVerification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true },
);

export const EmailVerification = mongoose.model<IEmailVerification>(
  "EmailVerification",
  emailVerificationSchema,
);
