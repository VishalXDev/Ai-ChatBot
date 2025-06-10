// lib/openai.ts
import { OpenAI } from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OpenAI API key. Please set OPENAI_API_KEY in .env.local");
}
