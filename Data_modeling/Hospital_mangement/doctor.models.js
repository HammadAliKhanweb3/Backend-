import mongoose from "mongoose";

const doctorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    Gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Male",
      required: true,
    },
    Salary: {
      type: Number,
      required: true,
    },
    experienceInYears: {
      type: Number,
      required: true,
    },
    worksInHospitals: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.models("Doctor", doctorSchema);
