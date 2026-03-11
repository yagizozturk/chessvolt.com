"use client";

import { useEffect, useRef } from "react";
import { Bot, User, HelpCircle } from "lucide-react";
import { useChatStream } from "@/hooks/use-chat-stream";
import { useCoachStore } from "@/lib/shared/store/coach-store";
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
    (state) => state.showFirstHintButton,
  );
  const showSecondHintButton = useCoachStore(
    (state) => state.showSecondHintButton,
  );
  const setIsSquareHintsShown = useCoachStore(
    (state) => state.setIsSquareHintsShown,
  );
  const setIsMoveHintsShown = useCoachStore(
    (state) => state.setIsMoveHintsShown,
  );
  const setShowFirstHintButton = useCoachStore(
    (state) => state.setShowFirstHintButton,
  );
  const setShowSecondHintButton = useCoachStore(
    (state) => state.setShowSecondHintButton,
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
    if (bestMove)
      parts.push(`Best stockfish move in uci is: ${bestMove.san} \n`);
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
         `,
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
    <div className="flex h-full max-h-[600px] flex-col">
      <div
        ref={scrollRef}
        className="chat-scroll border-border bg-muted/30 mb-3 flex-1 space-y-6 overflow-y-auto rounded-lg border px-3 py-5"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role !== "user" && (
              <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                <Bot className="text-muted-foreground h-5 w-5" />
              </div>
            )}
            <div
              className={`max-w-sm rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-muted text-foreground rounded-tl-none"
              }`}
            >
              {msg.content === "" && isLoading && idx === messages.length - 1
                ? "typing..."
                : msg.content}
            </div>

            {msg.role === "user" && (
              <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                <User className="text-muted-foreground h-5 w-5" />
              </div>
            )}
          </div>
        ))}
        {(showFirstHintButton || showSecondHintButton) && (
          <div className="flex items-start justify-end gap-3">
            <div className="flex flex-col items-end gap-2">
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
            <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <User className="text-muted-foreground h-5 w-5" />
            </div>
          </div>
        )}
      </div>

      {isMoveHintsShown && (
        <div className="mt-4 mt-auto grid grid-cols-3 gap-4">
          <Card className="border-border bg-muted/50 rounded-lg">
            <CardHeader className="flex flex-row items-center gap-2 p-4 pb-2">
              <Badge
                variant="secondary"
                className="h-8 w-8 shrink-0 justify-center p-0 text-sm font-bold"
              >
                1
              </Badge>
              <CardAction>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto h-8 w-8"
                  onClick={() =>
                    handleMoveExplanationClick(alternativeMoves?.[0]?.san ?? "")
                  }
                  aria-label="Explain move"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="px-4 pt-0 pb-4">
              <p className="text-foreground font-mono font-semibold">
                {alternativeMoves?.[0]?.san ?? "—"}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border bg-muted/50 rounded-lg">
            <CardHeader className="flex flex-row items-center gap-2 p-4 pb-2">
              <Badge
                variant="secondary"
                className="h-8 w-8 shrink-0 justify-center p-0 text-sm font-bold"
              >
                2
              </Badge>
              <CardAction>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto h-8 w-8"
                  onClick={() =>
                    handleMoveExplanationClick(alternativeMoves?.[1]?.san ?? "")
                  }
                  aria-label="Explain move"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="px-4 pt-0 pb-4">
              <p className="text-foreground font-mono font-semibold">
                {alternativeMoves?.[1]?.san ?? "—"}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border bg-muted/50 rounded-lg">
            <CardHeader className="flex flex-row items-center gap-2 p-4 pb-2">
              <Badge
                variant="secondary"
                className="h-8 w-8 shrink-0 justify-center p-0 text-sm font-bold"
              >
                3
              </Badge>
              <CardAction>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto h-8 w-8"
                  onClick={() =>
                    handleMoveExplanationClick(alternativeMoves?.[2]?.san ?? "")
                  }
                  aria-label="Explain move"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="px-4 pt-0 pb-4">
              <p className="text-foreground font-mono font-semibold">
                {alternativeMoves?.[2]?.san ?? "—"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
