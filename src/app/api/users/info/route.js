import User from "@/models/user.model";
import { connectMongoDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get email from query parameters
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const connection = await connectMongoDB();
    console.log("MongoDB connected successfully");

    // Find user and update last login
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log("User query result:", user);

    if (!user) {
      console.log("User not found for email:", email);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    return NextResponse.json(
      {
        message: "User found",
        user: {
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          resultsCount: user.resultsCount || 0,
          lastLogin: user.lastLogin
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching user info:", error);

    // Check for specific MongoDB errors
    if (error.name === 'MongoServerError') {
      console.error("MongoDB Server Error:", error.code);
      return NextResponse.json(
        { error: "Database connection error" },
        { status: 503 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      console.error("Validation Error:", error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
