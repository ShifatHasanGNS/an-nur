import User from "@/models/user.model";
import { connectMongoDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Parse and validate request body
    const body = await request.json();
    const { email, name, avatar } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Create and save new user
    const user = new User({
      email: email.toLowerCase(),
      name,
      avatar: avatar || null,
      resultsCount: 0,
      lastLogin: new Date()
    });

    console.log("Attempting to save user:", { email, name });
    const savedUser = await user.save();
    console.log("User saved successfully:", savedUser);

    return NextResponse.json({
      message: "User registered successfully",
      user: {
        email: savedUser.email,
        name: savedUser.name,
        avatar: savedUser.avatar,
        resultsCount: savedUser.resultsCount,
        lastLogin: savedUser.lastLogin
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
