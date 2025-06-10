// app/api/chat/route.ts
import { openai } from "@/lib/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, conversationHistory = [] } = await req.json();

    // Validate input
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ 
        error: "No valid message provided" 
      }, { status: 400 });
    }

    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      return NextResponse.json({ 
        error: "API configuration error" 
      }, { status: 500 });
    }

    // Prepare messages for OpenAI
    const messages = [
      {
        role: "system" as const,
        content: `You are ChatGPT, a helpful AI assistant created by OpenAI. You should:
        - Provide clear, accurate, and helpful responses
        - Be conversational and friendly
        - Format your responses well with proper line breaks
        - Use markdown formatting when appropriate for better readability
        - Be concise but thorough
        - Ask clarifying questions when needed`
      },
      // Include conversation history (last 10 messages to manage token limits)
      ...conversationHistory.slice(-10).map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.message
      })),
      {
        role: "user" as const,
        content: message.trim()
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 2000,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const reply = completion.choices[0]?.message?.content;
    
    if (!reply) {
      console.error("No reply from OpenAI");
      return NextResponse.json({ 
        error: "No response generated" 
      }, { status: 500 });
    }

    // Return response with usage info
    return NextResponse.json({ 
      reply,
      usage: completion.usage
    });

  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    
    // Handle specific OpenAI errors
    if (error?.code === 'insufficient_quota') {
      return NextResponse.json({ 
        error: "API quota exceeded. Please check your OpenAI billing." 
      }, { status: 429 });
    }
    
    if (error?.code === 'invalid_api_key') {
      return NextResponse.json({ 
        error: "Invalid API key configuration." 
      }, { status: 401 });
    }

    if (error?.code === 'rate_limit_exceeded') {
      return NextResponse.json({ 
        error: "Rate limit exceeded. Please try again in a moment." 
      }, { status: 429 });
    }

    if (error?.code === 'context_length_exceeded') {
      return NextResponse.json({ 
        error: "Message too long. Please try a shorter message." 
      }, { status: 400 });
    }

    // Generic error response
    return NextResponse.json({ 
      error: "I'm having trouble connecting right now. Please try again in a moment." 
    }, { status: 500 });
  }
}