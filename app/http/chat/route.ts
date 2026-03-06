import { NextRequest } from "next/server";
import { openAi } from "@/lib/open-ai";

export const runtime = "edge"; // TODO: where is this used

export async function POST(req: NextRequest) {
    const { messages, prompt } = await req.json();

    const validMessages = messages.filter(
      (msg: any) => msg?.content != null && msg.content !== ""
    );

    console.log("prompt", prompt);
  
    const stream = await openAi.chat.completions.create({
      model: "gpt-4.1",
      stream: true,
      messages: [
        { 
          role: "system",
          content: prompt,
        },
        ...validMessages, // Chat history to make AI remember past. Filters out empty messages (empty assistant messages added for streaming in use-chat-stream.ts:35)
      ],
    });
  
    const encoder = new TextEncoder();
  
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) controller.enqueue(encoder.encode(content));
        }
        controller.close();
      },
    });
  
    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }