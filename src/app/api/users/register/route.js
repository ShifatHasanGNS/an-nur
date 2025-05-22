import User from "@/models/user.model";
import { connectMongoDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, name, avatar } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Check if user exists using lean() for better performance
    const existingUser = await User.findOne(
      { email: email.toLowerCase() },
      "_id"
    ).lean();

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
    });

    const savedUser = await user.save();

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          email: savedUser.email,
          name: savedUser.name,
          avatar: savedUser.avatar,
          resultsCount: savedUser.resultsCount,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
