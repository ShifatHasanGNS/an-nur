import User from "@/models/user.model";
import { connectMongoDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const user = await User.findOne(
      { email: email.toLowerCase() },
      "email name avatar resultsCount resultsHistory"
    ).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const resultsHistory = user.resultsHistory.map((result) => ({
      ...result,
      level: result.level || "Just Curious",
    }));

    return NextResponse.json(
      {
        message: "User found",
        user: {
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          resultsCount: user.resultsCount || 0,
          resultsHistory: resultsHistory || [],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user info:", error);

    if (error.name === "MongoServerError") {
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 503 }
      );
    }

    if (error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
