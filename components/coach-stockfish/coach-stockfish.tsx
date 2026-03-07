"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useChatStream } from "@/hooks/use-chat-stream";
import { useCoachStore } from "@/stores/coach-store";
import {
  Card,
  CardContent,
  CardHeader,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CoachStockfish() {
  const initialMessage = `Hi, I am your Chess coach. Click 2 hint buttons to get help. Click the question mark icon for explanation.`;
  const alternativeMoves = useCoachStore((state) => state.alternativeMoves);
  const isMoveHintsShown = useCoachStore((state) => state.isMoveHintsShown);
  const showFirstHintButton = useCoachStore(
    (state) => state.showFirstHintButton
  );
  const showSecondHintButton = useCoachStore(
    (state) => state.showSecondHintButton
  );
  const setIsSquareHintsShown = useCoachStore(
    (state) => state.setIsSquareHintsShown
  );
  const setIsMoveHintsShown = useCoachStore(
    (state) => state.setIsMoveHintsShown
  );
  const setShowFirstHintButton = useCoachStore(
    (state) => state.setShowFirstHintButton
  );
  const setShowSecondHintButton = useCoachStore(
    (state) => state.setShowSecondHintButton
  );
  const { messages, isLoading, error, sendMessage } =
    useChatStream(initialMessage);
  const scrollRef = useRef<HTMLDivElement>(null);

  //============================================================
  // Coach Store variables
  //============================================================
  const fen = useCoachStore((state) => state.fen);
  const bestMove = useCoachStore((state) => state.bestMove);

  //============================================================
  // Scroll control
  //============================================================
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  //============================================================
  // Create propmt to send
  //============================================================
  const buildPrompt = (san: string): string => {
    const parts: string[] = [];
    if (fen) parts.push(`Current FEN: ${fen} \n`);
    if (bestMove) parts.push(`Best stockfish move in uci is: ${bestMove.san} \n`);
    if (san)
      parts.push(
        `- Stockfish is offering 3 alternative moves. Player is curious about this stockfish move: ${san}.
         - Use this information to provide context-aware chess coaching to the player.
         - Please explain why this move is good. Explain in maximum 3 sentences.
         - Please explain in maximum 100 words. Do not ever exceed 100 words.
         - Make sure the player understands why the move is good.
         - Format your answers for readability:
            - Use paragraphs when needed,
            - Separate logical sections,
            - Use bullet points or numbered lists when appropriate,
            - Do not merge multiple sentences into a single line.
         `
      );
    return parts.join(" ");
  };

  // ============================================================================
  // First hint: squares are highlighted
  // ============================================================================
  const handleFirstHintClick = () => {
    setIsSquareHintsShown(true);
    setShowFirstHintButton(false);
  };

  // ============================================================================
  // Second hint: which squares to move to
  // ============================================================================
  const handleSecondHintClick = () => {
    setIsMoveHintsShown(true);
    setShowSecondHintButton(false);
  };

  // ============================================================================
  // Ask GPT for explanation
  // ============================================================================
  const handleMoveExplanationClick = (san: string) => {
    const prompt = buildPrompt(san);
    sendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      <div
        ref={scrollRef}
        className="chat-scroll flex-1 overflow-y-auto px-3 py-5 space-y-6 bg-secondary mb-3"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role !== "user" && (
              <img
                src="/images/icons/icon-ai.png"
                className="w-10 h-10 rounded-full"
              />
            )}
            <div
              className={`max-w-sm px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap
                ${
                  msg.role === "user"
                    ? "bg-emerald-600 text-white rounded-tr-none"
                    : "bg-primary-background text-black rounded-tl-none"
                }`}
            >
              {msg.content === "" && isLoading && idx === messages.length - 1
                ? "typing..."
                : msg.content}
            </div>

            {msg.role === "user" && (
              <img
                src="/images/icons/icon-user.png"
                className="w-10 h-10 rounded-full"
              />
            )}
          </div>
        ))}
        {(showFirstHintButton || showSecondHintButton) && (
          <div className="flex gap-3 justify-end items-start">
            <div className="flex flex-col gap-2 items-end">
              {showFirstHintButton && (
                <button
                  onClick={handleFirstHintClick}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition shadow-lg w-fit cursor-pointer"
                >
                  Which pieces can I move for best?
                </button>
              )}
              {showSecondHintButton && (
                <button
                  onClick={handleSecondHintClick}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition shadow-lg w-fit cursor-pointer"
                >
                  I need a move hint
                </button>
              )}
            </div>
            <img
              src="/images/icons/icon-user.png"
              className="w-10 h-10 rounded-full flex-shrink-0"
              alt="User"
            />
          </div>
        )}
      </div>

      {isMoveHintsShown && (
        <div className="grid grid-cols-3 gap-4 mt-auto mt-4">
          <Card className="rounded-lg border-border bg-muted/50">
            <CardHeader className="flex flex-row items-center gap-2 p-4 pb-2">
              <Image
                src="/images/icons/icon-first.png"
                alt=""
                width={24}
                height={24}
              />
              <CardAction>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 ml-auto"
                  onClick={() =>
                    handleMoveExplanationClick(alternativeMoves?.[0]?.san ?? "")
                  }
                  aria-label="Explain move"
                >
                  <Image
                    src="/images/icons/icon-question-mark.png"
                    alt=""
                    width={18}
                    height={18}
                  />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <p className="font-mono font-semibold text-foreground">
                {alternativeMoves?.[0]?.san ?? "—"}
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-lg border-border bg-muted/50">
            <CardHeader className="flex flex-row items-center gap-2 p-4 pb-2">
              <Image
                src="/images/icons/icon-second.png"
                alt=""
                width={24}
                height={24}
              />
              <CardAction>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 ml-auto"
                  onClick={() =>
                    handleMoveExplanationClick(alternativeMoves?.[1]?.san ?? "")
                  }
                  aria-label="Explain move"
                >
                  <Image
                    src="/images/icons/icon-question-mark.png"
                    alt=""
                    width={18}
                    height={18}
                  />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <p className="font-mono font-semibold text-foreground">
                {alternativeMoves?.[1]?.san ?? "—"}
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-lg border-border bg-muted/50">
            <CardHeader className="flex flex-row items-center gap-2 p-4 pb-2">
              <Image
                src="/images/icons/icon-third.png"
                alt=""
                width={24}
                height={24}
              />
              <CardAction>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 ml-auto"
                  onClick={() =>
                    handleMoveExplanationClick(alternativeMoves?.[2]?.san ?? "")
                  }
                  aria-label="Explain move"
                >
                  <Image
                    src="/images/icons/icon-question-mark.png"
                    alt=""
                    width={18}
                    height={18}
                  />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <p className="font-mono font-semibold text-foreground">
                {alternativeMoves?.[2]?.san ?? "—"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
