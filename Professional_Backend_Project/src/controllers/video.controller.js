import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import mongoose from "mongoose";
import { Video } from "../models/video.models";
import { User } from "../models/user.models";

const getAllVideos = asyncHandler(async (req, res) => {
  //TODO: get all videos based on query, sort, pagination
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  if ([query, sortBy, sortType, userId].some((fields) => fields === "")) {
    throw new ApiError();
  }
  const videos = await Video.aggregate([
    {
      $match: {
        $or: [
          { title: { $regex: query, $option: "i" } },
          { description: { $regex: query, $option: "i" } },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foriegnField: "_id",
        as: "videoBy",
        pipeline: [
          {
            $project: {
              _id: 1,
              userName: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        videoBy: {
          $first: "$videoBy",
        },
      },
    },
    { $sort: { [sortBy]: sortType === "asc" ? 1 : -1 } },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: parseInt(limit),
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, { videos }, "Successfuly fetched Videos"));
});

