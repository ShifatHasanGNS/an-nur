import User from "@/models/user.model";
import { connectMongoDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const id = searchParams.get("id");

    if (!email || !id) {
      return NextResponse.json(
        { error: "Email and id are required" },
        { status: 400 }
      );
    }

    // Find and update the user in one operation
    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        $inc: { resultsCount: -1 },
        $pull: {
          resultsHistory: { _id: id },
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
        message: "Result removed successfully",
        user: {
          resultsCount: updatedUser.resultsCount,
          resultsHistory: updatedUser.resultsHistory,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Remove result error:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Invalid data: " + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
