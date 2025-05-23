import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    prompt: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    level: {
      type: String,
      required: true,
      trim: true,
      default: "Just Curious",
      enum: [
        "Just Curious",
        "Conversation Level",
        "Personal Interest/Hobby",
        "Practical Application",
        "School/Student Level",
        "Exam Preparation",
        "Professional/Work Related",
        "Specialized/Technical",
        "Expert/Consultant Level",
        "Research/Academic",
        "PhD/Dissertation Level",
      ],
    },
    result: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
  },
  {
    _id: false,
  },
  {
    timestamps: true,
  }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      index: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: [2, "Name must be at least 2 characters long"],
      maxLength: [50, "Name cannot exceed 50 characters"],
    },
    avatar: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          return (
            v === null || v.startsWith("http") || v.startsWith("data:image")
          );
        },
        message: "Avatar must be a valid URL or data URI",
      },
    },
    resultsCount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Results count cannot be negative"],
    },
    resultsHistory: {
      type: [resultSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
