import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { fen, firstMove } = await req.json();

  const prompt = `
You are a chess coach. 
Explain the idea behind the best move without revealing the move or squares.

Rules:
- MAX 50 WORDS.
- Do NOT mention the moving piece or any square.
- Describe only the tactical or strategic idea.
- Focus on: the weakness it targets, the threat it creates, or the defender it overloads.
- Keep it concise, clear, and coach-like.

Position (FEN): ${fen}
Best move (do NOT reveal): ${firstMove}

Provide a short, high-quality explanation in under 50 words.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return NextResponse.json({
    data: completion.choices[0].message?.content ?? "",
  });
}
