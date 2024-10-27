import { mongoose, Schema } from "mongoose";

const likesSchema =new Schema(
  {
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    tweet: {
      types: Schema.Types.ObjectId,
      ref: "Tweet",
    },
  },
  { timestamps: true }
);

export const Like = Schema.model("Like", likesSchema);
