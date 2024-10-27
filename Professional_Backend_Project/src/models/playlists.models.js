import mongoose, { Schema } from "mongoose";

const playlistSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    videos: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    videos: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },

  { timestamps: true }
);

export const Playlist = Schema.model("Playlist", playlistSchema);
