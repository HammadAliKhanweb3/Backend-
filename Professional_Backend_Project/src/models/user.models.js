import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
      trime: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trime: true,
    },
    fullName: {
      type: String,
      required: true,
      index: true,
      trime: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: Video,
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.password.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.models.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.models.generateAccessToken = function () {
  jwt.sign({
    _id: this.id,
    emial: this.email,
    username: this.username,
    fullName: this.fullName,
  });
};
userSchema.models.generateAccessToken = function () {
  jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.models.generateAccessToken = function () {
  jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
