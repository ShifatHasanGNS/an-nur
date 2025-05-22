import User from "@/models/user.model";
import { connectMongoDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectMongoDB();

    const { email, title, prompt, result } = await request.json();

    if (!email || !title || !prompt || typeof result !== "string") {
      return NextResponse.json(
        { error: "Email, title, prompt, and result are required" },
        { status: 400 }
      );
    }

    // Validate structure
    if (
      typeof title !== "string" ||
      typeof prompt !== "string" ||
      typeof result !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid result structure" },
        { status: 400 }
      );
    }

    // Find and update the user in one operation
    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        $inc: { resultsCount: 1 },
        $push: {
          resultsHistory: { title, prompt, result },
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

    // Return only the latest result and count
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
