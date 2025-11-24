import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { userInput } = await req.json();

    // Initialize client with your API key
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

    // Use a free model that exists
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Generate response
    const result = await model.generateContent(userInput);
    const text = result.response.text();

    return NextResponse.json({
      role: "assistant",
      content: text,
    });
  } catch (error) {
    console.error("Google AI Error:", error);
    return NextResponse.json({
      role: "assistant",
      content: "❌ Error generating response.",
    });
  }
}
