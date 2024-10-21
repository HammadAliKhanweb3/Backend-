import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJwt = asyncHandler((req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Beare ", "");

  if (!token) throw new ApiError(401, "Unathorized request");

  const decodedToken = jwt
    .verify(token, process.env.ACCESS_TOKEN_SECRET)
    .select("-password refreshToken");

  const user = User.findById(decodedToken._id);

  if (!user) throw ApiError(400, "Invalid Access Token");
  req.user = user;

  next();
});
