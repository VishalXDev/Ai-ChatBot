// app/api/chat/route.ts
import { openai } from "@/lib/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ error: "No valid message provided" }, { status: 400 });
    }

    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      return NextResponse.json({ error: "API configuration error" }, { status: 500 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant. Provide clear, concise, and helpful responses."
        },
        {
          role: "user", 
          content: message.trim()
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content;
    
    if (!reply) {
      console.error("No reply from OpenAI");
      return NextResponse.json({ error: "No response generated" }, { status: 500 });
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    
    // Handle specific OpenAI errors
    if (error?.code === 'insufficient_quota') {
      return NextResponse.json({ error: "API quota exceeded. Please check your OpenAI billing." }, { status: 429 });
    }
    
    if (error?.code === 'invalid_api_key') {
      return NextResponse.json({ error: "Invalid API key configuration." }, { status: 401 });
    }

    return NextResponse.json({ 
      error: "I'm having trouble connecting right now. Please try again in a moment." 
    }, { status: 500 });
  }
}