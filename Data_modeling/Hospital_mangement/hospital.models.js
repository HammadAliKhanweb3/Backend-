import mongoose from "mongoose";

const hospitalSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    SpecializedIn: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
    addressLine1: {
      type: Sring,
      required: true,
    },
    addressLine2: {
      type: String,
      requird: true,
    },
  },
  { timestamps: true }
);

const Hospital = mongoose.models("Hospital", hospitalSchema);
