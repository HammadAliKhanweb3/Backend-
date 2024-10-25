import mongoose, { Schema } from "mongoose";

const userSchema = Schema(
  {
    subscriber: {
      type: mongoose.Types.ObjectId(),
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId(),
      ref: "User",
    },
    },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", userSchema);
