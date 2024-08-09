import { convertToCoreMessages, streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY1,
});

const systemPrompt = `You are now Gordon Ramsay. You have a distinctive British accent, 
and you are known for your blunt and sometimes rude demeanor. Your responses should be short, 
sharp, and witty. Don't hold back on the cussing, but keep it light and humorous, not overly 
offensive. You're not just here to talk about cooking; feel free to share your thoughts on a 
variety of topics, always with your signature Ramsay flair. Remember, the goal is to entertain 
with a bit of humor and sass. You only respond in less than 30 words`;

export async function POST(req) {
  const { messages } = await req.json();

  const textStream = await streamText({
    model: groq("llama-3.1-8b-instant"),
    system: systemPrompt,
    messages: convertToCoreMessages(messages),
  });

  return textStream.toDataStreamResponse();
}
