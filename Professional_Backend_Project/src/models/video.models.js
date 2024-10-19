import { mongoose, Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { User } from "./user.models.js";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String,
      requird: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    veiws: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

videoSchema.plugin(aggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
