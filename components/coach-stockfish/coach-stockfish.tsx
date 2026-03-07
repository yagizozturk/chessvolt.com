"use client";

import { useEffect, useRef } from "react";
import { Bot, User, HelpCircle } from "lucide-react";
import { useChatStream } from "@/hooks/use-chat-stream";
import { useCoachStore } from "@/stores/coach-store";
import {
  Card,
  CardContent,
  CardHeader,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
        className="chat-scroll flex-1 overflow-y-auto space-y-6 rounded-lg border border-border bg-muted/30 px-3 py-5 mb-3"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role !== "user" && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <Bot className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div
              className={`max-w-sm px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap
                ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted rounded-tl-none text-foreground"
                }`}
            >
              {msg.content === "" && isLoading && idx === messages.length - 1
                ? "typing..."
                : msg.content}
            </div>

            {msg.role === "user" && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        {(showFirstHintButton || showSecondHintButton) && (
          <div className="flex gap-3 justify-end items-start">
            <div className="flex flex-col gap-2 items-end">
              {showFirstHintButton && (
                <Button
                  onClick={handleFirstHintClick}
                  variant="secondary"
                  className="w-fit"
                >
                  Which pieces can I move for best?
                </Button>
              )}
              {showSecondHintButton && (
                <Button
                  onClick={handleSecondHintClick}
                  variant="default"
                  className="w-fit"
                >
                  I need a move hint
                </Button>
              )}
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      {isMoveHintsShown && (
        <div className="grid grid-cols-3 gap-4 mt-auto mt-4">
          <Card className="rounded-lg border-border bg-muted/50">
            <CardHeader className="flex flex-row items-center gap-2 p-4 pb-2">
              <Badge variant="secondary" className="h-8 w-8 shrink-0 p-0 justify-center text-sm font-bold">
                1
              </Badge>
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
                  <HelpCircle className="h-4 w-4" />
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
              <Badge variant="secondary" className="h-8 w-8 shrink-0 p-0 justify-center text-sm font-bold">
                2
              </Badge>
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
                  <HelpCircle className="h-4 w-4" />
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
              <Badge variant="secondary" className="h-8 w-8 shrink-0 p-0 justify-center text-sm font-bold">
                3
              </Badge>
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
                  <HelpCircle className="h-4 w-4" />
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
