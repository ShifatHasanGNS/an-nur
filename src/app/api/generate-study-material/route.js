import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import User from "@/models/user.model";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getFinalPrompt } from "@/constants/finalPrompt";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { email, title, prompt, level } = await request.json();

    if (!email || !title || !prompt || !level) {
      return NextResponse.json(
        { error: "Email, title, prompt, and level are required" },
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

    const fullPrompt = getFinalPrompt(prompt, level);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const response = await model.generateContent(fullPrompt);
    if (!response?.response) {
      console.error("AI Generation Error: No response received");
      return NextResponse.json(
        { error: "Failed to generate study materials: No response from AI" },
        { status: 500 }
      );
    }
    const aiResult = response.response.text().trim();
    if (!aiResult) {
      console.error("AI Generation Error: Empty response received");
      return NextResponse.json(
        { error: "Failed to generate study materials: Empty response from AI" },
        { status: 500 }
      );
    }

    await connectMongoDB();

    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        $inc: { resultsCount: 1 },
        $push: {
          resultsHistory: {
            title: title.trim(),
            prompt: prompt.trim(),
            level: level,
            result: aiResult,
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
        message: "Study material generated and saved successfully",
        result: aiResult,
        user: {
          resultsCount: updatedUser.resultsCount,
          resultsHistory: updatedUser.resultsHistory.slice(-1), // Return only the latest
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error generating study material:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Invalid data: " + error.message },
        { status: 400 }
      );
    }
    if (error.message.includes("Failed to generate study materials")) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
