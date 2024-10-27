import { mongoose, Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = Schema(
  {
    content: {
      type: true,
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
commentSchema.plugin(aggregatePaginate);

export const Comment = Schema.model("Comment", commentSchema);
