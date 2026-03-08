import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["citizen", "officer"],
      default: "citizen",
    },
    department: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

