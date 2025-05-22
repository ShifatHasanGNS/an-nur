import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    for: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
    },
    image: {
      type: String,
    },
    url: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Result = mongoose.models.Result || mongoose.model("Result", resultSchema);

export default Result;
