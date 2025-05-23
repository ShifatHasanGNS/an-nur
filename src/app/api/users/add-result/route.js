import User from "@/models/user.model";
import { connectMongoDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectMongoDB();

    const body = await request.json();

    const { email, title, prompt, result, level } = body;

    if (!email || !title || !prompt || typeof result !== "string" || !level) {
      return NextResponse.json(
        { error: "Email, title, prompt, level, and result are required" },
        { status: 400 }
      );
    }

    if (
      typeof title !== "string" ||
      typeof prompt !== "string" ||
      typeof result !== "string" ||
      typeof level !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid result structure" },
        { status: 400 }
      );
    }

    const validLevels = [
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
    ];

    if (!validLevels.includes(level)) {
      return NextResponse.json(
        { error: "Invalid level value" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        $inc: { resultsCount: 1 },
        $push: {
          resultsHistory: {
            title,
            prompt,
            result,
            level,
          },
        },
      },
      {
        new: true,
        runValidators: true,
        select: "resultsCount resultsHistory",
      }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Results history updated successfully",
        user: {
          resultsCount: updatedUser.resultsCount,
          resultsHistory: updatedUser.resultsHistory.slice(-1),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update results history error:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Invalid result data: " + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
