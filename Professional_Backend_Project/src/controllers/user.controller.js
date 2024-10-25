import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccesRefeshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    console.log(refreshToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforesave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong wile generating token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, userName, password, refreshToken, fullName } = req.body;

  if (
    [userName, email, password, refreshToken, fullName].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(200, "Enter username");
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (existedUser) throw new ApiError(200, "User name already exists");

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar file path is required");

  const avatar = await uploadonCloudinary(avatarLocalPath);
  const coverImage = await uploadonCloudinary(coverImageLocalPath);

  if (!avatar) throw new ApiError(400, "Avatar file path is required");

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage.url,
    email,
    password,
    userName: userName.toLowerCase(),
  });

  const createddUser = await User.findOne(user._id).select(
    "-password -refreshToken"
  );
  if (!createddUser)
    throw new ApiError(500, "Something went wrong while registering the user");

  return res
    .status(201)
    .json(new ApiResponse(200, createddUser, "Successfully registered User"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName && !email) {
    throw new ApiError(400, "Username or email is required");
  }
  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  // if (!password) throw new ApiError(400, "Invalid User Credentials");
  const { accessToken, refreshToken } = await generateAccesRefeshToken(
    user._id
  );
  console.log(refreshToken);

  // console.log(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User loggedIn Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = req.user;

  await User.findByIdAndUpdate(
    user._id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(400, "Unathorized Request");
  }
  try {
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedRefreshToken?._id);

    if (!user) {
      throw new ApiError(400, "Invalid refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(400, "Refresh Token is expired");
    }

    const { accessToken, newRefreshToken } = await generateAccesRefeshToken(
      user._id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(200, { accessToken, refreshToken: newRefreshToken })
      );
  } catch (error) {
    throw new ApiError(400, error?.message || "Invalid Refresh Token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    throw new ApiError(401, "All fields are required");

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(401, "Unathuroized User");
  }
  const password = await user.isPasswordCorrect(oldPassword);
  if (!password) {
    throw new ApiError(401, "Invalid old password");
  }
  user.password = newPassword;
  await user.save({ validateBeforesave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password has been changed"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(200, req.user, "Current User");
});

const updatAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) throw new ApiError(401, "All fields are required");

  if (!user) throw new ApiError(400, "Unathorized User");

  const user = User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    { new: true }
  ).select("password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User Details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is missing");

  const avatar = await uploadonCloudinary(avatarLocalPath);
  if (!avatar.url) throw new ApiError(400, "Error while uploading");

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }.select("-password")
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User avatar changed scuccessfully"));
});
const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) throw new ApiError(400, "Avatar file is missing");

  const coverImage = await uploadonCloudinary(COVER);
  if (!coverImage.url) throw new ApiError(400, "Error while uploading");

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    {
      new: true,
    }.select("-password")
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover Image changed scuccessfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { userName } = req.params;
  if (!userName.trim()) {
    throw new ApiError(400, "User is missing");
  }

  const channel = await User.aggregate([
    {
      $match: userName?.toLowerCase(),
    },
    // getting Users Subscribets count
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
      // getting count of Channel which user Subscribed
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscribers",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        suscribedToCount: {
          $size: "$suscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        userName: 1,
        avatar: 1,
        coverImage: 1,
        subscribersCount: 1,
        suscribedToCount: 1,
        isSubscribed: 1,
        email: 1,
      },
    },
  ]);
  if (!channel?.length) {
    throw new ApiError(404, "Channel doesn't exists");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User Profile Info fetched Successfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "User",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "Video",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    userName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: { $first: "owner" },
            },
          },
        ],
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "Watch History Fetched Successfully"
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  updatAccountDetails,
  getCurrentUser,
  updateUserAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
