import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res, next) => {
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

  const avatarLocalPath = req.fiels?.avatar[0]?.path;
  const coverImageLocalPath = req.fiels?.converImage[0]?.path;

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

export default registerUser;
