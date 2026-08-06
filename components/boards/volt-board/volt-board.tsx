"use client";

import type { DrawShape } from "@lichess-org/chessground/draw";
import type { Key } from "@lichess-org/chessground/types";
import { type Ref, forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";

import "@/assets/chessground.css";
import "@/assets/theme/theme.css";
import "@/assets/volt.css";
import type { MoveGoal } from "@/features/move-sequence/types/move-goal";
import { buildMoveUci } from "@/lib/chess/buildUci";
import { getOrientationFromFen } from "@/lib/chess/getOrientationFromFen";
import { getPromotionPiece } from "@/lib/chess/getPromotionPiece";
import { useChessOne } from "@/lib/chess/hooks/use-chess";
import { parseUci } from "@/lib/chess/parseUci";
import { useChessground } from "@/lib/chessground/hooks/use-chessgroud";
import {
  CORRECT_MOVE_HIGHLIGHT_CLEAR_DELAY_MS,
  DEFAULT_PROMOTION_PIECE,
  OPPONENT_MOVE_DELAY_MS,
  WRONG_MOVE_REVERT_DELAY_MS,
} from "@/lib/shared/constants/chess";
import { useBoardSounds } from "@/lib/shared/hooks/sound/use-board-sounds";
import type { Move } from "@/lib/shared/types/move";
import type { MoveAttemptPayload } from "@/lib/shared/types/move-attempt-payload";

import "@lichess-org/chessground/assets/chessground.base.css";
import "@lichess-org/chessground/assets/chessground.brown.css";

export type VoltBoardMode = "practice" | "learn";

// ============================================================================
// Bu parent a açılan refs değeri VoltBoard da ilk bu geçiliyor. Parent dan
// Hint tetiklenmesi yapılabilsin die. forwardRef içinde kullanılıyorki burada
// kontrol olsun.
// ============================================================================
export type VoltBoardHandle = {
  showHint: (hintLevel: number) => void;
};

type VoltBoardProps = {
  sourceId: string;
  mode?: VoltBoardMode;
  initialFen?: string;
  viewOnly?: boolean;
  coordinates?: boolean;
  playerOrientation?: "white" | "black";
  drawHintMove?: string | null;
  activeGoalVisuals?: MoveGoal["visuals"];
  onCheckMove: (payload: MoveAttemptPayload) => boolean;
  onSuccessMovePlayed: (move: Move) => void;
  onNextMoveRequest: () => string | undefined;
};

// ============================================================================
// With a forwardRef, parent can get a remote control on this board.
// ref is the remoter control, parent uses it to call showHint()
// VoltBoardHandle dışarıdan tetikelenebiliyor. Çünkü içerde hint ile ok çizmeye ihtiyaç var
// Ok çizen de dışarıdaki parent da olan (riddlecontroller) hint button.
// Function args (runtime): (props, ref) — props first, like a normal component,
// then ref added. Different from forwardRef
// ============================================================================
function VoltBoard(
  {
    sourceId,
    initialFen,
    viewOnly = false,
    coordinates = true,
    playerOrientation,
    drawHintMove,
    activeGoalVisuals,
    mode = "practice",
    onCheckMove,
    onSuccessMovePlayed,
    onNextMoveRequest,
  }: VoltBoardProps,
  ref: Ref<VoltBoardHandle>,
) {
  // React render'ı gerektirmeyen, Chessground akışına ait geçici değerleri ref içinde tutuyoruz.
  const boardRef = useRef<HTMLDivElement>(null);
  const orientationRef = useRef<"white" | "black">(playerOrientation ?? getOrientationFromFen(initialFen));

  // Chessground'un son oynanan iki kareyi vurgulaması için kullanılır.
  const lastMoveRef = useRef<[Key, Key] | undefined>(undefined);

  // Doğru/yanlış hamle highlight'larını daha sonra temizleyen timer.
  const clearCustomHighlightsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Oyuncu doğru hamleyi yaptıktan sonra, rakip hamlesi board'a uygulanana kadar yeni goal oklarını çizdirmeyiz.
  // Bu bir state değil ref'tir; değişmesi component'i yeniden render etmez.
  const isOpponentMovePendingRefLock = useRef(false);

  // Parent'tan gelen en güncel goal oklarını saklar.
  // Oklar kilit sırasında çizilmez; rakip hamlesi uygulandıktan sonra bu ref'ten çizilir.
  const latestGoalShapesRef = useRef<DrawShape[]>([]);
  const activeGoalShapes = useMemo<DrawShape[]>(() => {
    // Parent'tan gelen uygulama tipindeki görselleri Chessground'un DrawShape formatına çevirir.
    // Practice modunda goal okları gösterilmez.
    if (mode !== "learn" || !activeGoalVisuals?.length) return [];

    return activeGoalVisuals.map((visual) => ({
      orig: visual.orig as Key,
      ...(visual.dest ? { dest: visual.dest as Key } : {}),
      ...(visual.brush ? { brush: visual.brush } : {}),
    }));
  }, [activeGoalVisuals, mode]);

  // 2. Custom Hooks (Dış servisleri/mantığı bağlayanlar). İlk render da tanımlananlar
  // chess.js hamle yapabilsin die makeMove methodu kullnaır ve oyunu tutar.
  const { game, makeMove } = useChessOne(initialFen);
  const { playCorrectSound, playWrongMoveSound, playHintSound } = useBoardSounds();

  // ============================================================================
  // chessGround is initialized and board events
  // ============================================================================
  const { ground, updateBoard, setSquareCustomHighlight, clearSquareCustomHighlights } = useChessground({
    boardRef,
    game,
    sourceId,
    orientationRef,
    viewOnly,
    coordinates,
    lastMoveRef,
    onMove: (from, to) => {
      // Chessground oyuncu taşını görsel olarak hareket ettirdi ve ardından bu callback'i çağırdı.
      // Önceki hamleden kalmış highlight temizleme timer'ını iptal ediyoruz.
      clearCustomHighlightsTimeout();

      // Hamleyi chess.js'e işlemeden önceki pozisyon, doğruluk kontrolünde kullanılır.
      const fenBefore = game.current.fen();
      const turn = game.current.turn() === "w" ? "white" : "black";
      const uci = buildMoveUci(game.current, from, to);
      // Move is getting checked in hook if it is right or wrong
      const isCorrect = onCheckMove?.({
        uci,
        fenBefore,
        turn,
      });

      // Incorrect move played
      if (isCorrect === false) {
        boardWrongMoveHandler(to);
        return;
      } else {
        // Correct move played
        boardCorrectMoveHandler(from, to, uci);
      }
    },
  });

  // ============================================================================
  // Board üzerindeki otomatik goal/hint şekillerini temizler.
  // ============================================================================
  function clearHintShapes() {
    ground.current?.setAutoShapes([]);
  }

  // ============================================================================
  // Yanlış hamle:
  // Chessground taşı ekranda hareket ettirmiştir fakat chess.js pozisyonu değiştirilmez.
  // Önce hata geri bildirimi gösterilir, ardından scheduleWrongMoveRevert()
  // Chessground'u chess.js'in hâlâ tuttuğu doğru pozisyona geri senkronize eder.
  // ============================================================================
  function boardWrongMoveHandler(to: string) {
    clearSquareCustomHighlights();
    clearHintShapes();
    ground.current?.setAutoShapes(activeGoalShapes);
    setSquareCustomHighlight(to, "custom-wrong-move");
    playWrongMoveSound();
    scheduleWrongMoveRevert();
  }

  // ============================================================================
  // Bekleyen highlight timer'ını iptal eder.
  // Yeni bir hamle başladığında eski timer'ın yeni geri bildirimi silmesini engeller.
  // ============================================================================
  function clearCustomHighlightsTimeout() {
    if (clearCustomHighlightsTimeoutRef.current) {
      clearTimeout(clearCustomHighlightsTimeoutRef.current);
      clearCustomHighlightsTimeoutRef.current = null;
    }
  }

  // ============================================================================
  // Doğru hamle geri bildiriminde yalnızca kare highlight'ını temizler.
  // Burada updateBoard() çağrılmaz; çünkü doğru hamlede taş geri alınmamalıdır.
  // ============================================================================
  function scheduleClearCustomHighlights(delayMs: number) {
    clearCustomHighlightsTimeout();
    clearCustomHighlightsTimeoutRef.current = setTimeout(() => {
      clearCustomHighlightsTimeoutRef.current = null;
      clearSquareCustomHighlights();
    }, delayMs);
  }

  // ============================================================================
  // Yanlış hamle geri alma:
  // chess.js yanlış hamleyi hiç kabul etmediği için hâlâ doğru pozisyonu tutar.
  // Gecikme sonunda updateBoard(), Chessground'u bu doğru pozisyona geri getirir.
  // ============================================================================
  function scheduleWrongMoveRevert() {
    clearCustomHighlightsTimeout();

    clearCustomHighlightsTimeoutRef.current = setTimeout(() => {
      clearCustomHighlightsTimeoutRef.current = null;
      clearSquareCustomHighlights();
      updateBoard();
    }, WRONG_MOVE_REVERT_DELAY_MS);
  }

  // ============================================================================
  // Doğru oyuncu hamlesi:
  // 1. Hamleyi chess.js'e işler.
  // 2. Parent goal'u ilerletmeden hemen önce ok çizimini kilitler.
  // 3. Oyuncu hamlesinin ekranda görünmesi için rakip hamlesini kısa süre geciktirir.
  // ============================================================================
  function boardCorrectMoveHandler(from: string, to: string, uci: string) {
    clearHintShapes();
    clearSquareCustomHighlights();
    const promotion = getPromotionPiece(game.current, from, to, DEFAULT_PROMOTION_PIECE);
    const move = makeMove(from, to, promotion ?? DEFAULT_PROMOTION_PIECE);
    if (!move) {
      return;
    }

    // Bu satır parent callback'inden önce olmalıdır.
    // Çünkü callback goal'u ilerletir ve yeni activeGoalShapes hemen VoltBoard'a gelebilir.
    isOpponentMovePendingRefLock.current = true;

    onSuccessMovePlayed({ ...move, uci }); // Parent doğru hamleyi kaydeder ve sıradaki goal'u aktif eder.
    playCorrectSound();
    setSquareCustomHighlight(to, "custom-correct-move");
    scheduleClearCustomHighlights(CORRECT_MOVE_HIGHLIGHT_CLEAR_DELAY_MS);

    lastMoveRef.current = [from as Key, to as Key];
    const nextMove = onNextMoveRequest?.();

    // Rakip hamlesi aynı JavaScript akışı içinde hemen uygulanırsa updateBoard()
    // doğrudan iki hamle sonraki FEN'i gönderir ve oyuncu taşı ışınlanmış gibi görünebilir.
    // Bu gecikme oyuncu hamlesinin önce ekranda görünmesine fırsat verir.
    if (nextMove) {
      setTimeout(() => {
        boardApplyOpponentMove(nextMove);
      }, OPPONENT_MOVE_DELAY_MS);
    } else {
      // Oynanacak rakip hamlesi yoksa bekleme süreci de yoktur.
      isOpponentMovePendingRefLock.current = false;
    }
  }

  // ============================================================================
  // Rakip hamlesi:
  // makeMove() önce chess.js modelini günceller.
  // updateBoard() daha sonra aynı pozisyonu Chessground'a gönderir.
  // Tahta senkronize edildikten sonra ok kilidi açılır ve bekleyen goal okları çizilir.
  // ============================================================================
  function boardApplyOpponentMove(nextMove: string) {
    const opponentFrom = nextMove.slice(0, 2);
    const opponentTo = nextMove.slice(2, 4);
    const opponentPromotion = nextMove[4] ?? DEFAULT_PROMOTION_PIECE;
    const opponentMove = makeMove(opponentFrom, opponentTo, opponentPromotion);

    if (!opponentMove) {
      // Geçersiz rakip hamlesinde kilidi açık bırakmıyoruz.
      isOpponentMovePendingRefLock.current = false;
      return;
    }

    lastMoveRef.current = [opponentFrom as Key, opponentTo as Key];

    // chess.js güncel, Chessground ise hâlâ oyuncu hamlesi sonrasındaki görüntüdedir.
    // updateBoard() rakip hamlesini içeren güncel FEN ile ikisini senkronize eder.
    updateBoard();

    // Ref kilidini açmak useEffect'i yeniden çalıştırmaz.
    // Bu nedenle kilit sırasında saklanan en güncel okları burada doğrudan çiziyoruz.
    isOpponentMovePendingRefLock.current = false;
    ground.current?.setAutoShapes(latestGoalShapesRef.current);
  }

  // ============================================================================
  // Cleanup highlight clear timeout
  // ============================================================================
  useEffect(() => {
    return () => {
      clearCustomHighlightsTimeout();
    };
  }, []);

  // ============================================================================
  // External FEN sync (e.g. PGN navigator)
  // Keep same board instance and update position when parent changes initialFen.
  // for example orientation change
  // ============================================================================
  useEffect(() => {
    orientationRef.current = playerOrientation ?? getOrientationFromFen(initialFen);
    clearCustomHighlightsTimeout();
    clearSquareCustomHighlights();
    ground.current?.setAutoShapes([]);
    lastMoveRef.current = undefined;
    updateBoard();
  }, [sourceId, initialFen, playerOrientation, updateBoard, clearSquareCustomHighlights, ground]);

  // ============================================================================
  // Aktif goal okları:
  // - Normal durumda activeGoalShapes değişince hemen çizilir.
  // - Rakip hamlesi bekleniyorsa yeni oklar yalnızca latestGoalShapesRef içinde saklanır.
  //   Rakip hamlesi board'a uygulandığında boardApplyOpponentMove() bu bekleyen okları çizer.
  // ============================================================================
  useEffect(() => {
    latestGoalShapesRef.current = activeGoalShapes;

    if (isOpponentMovePendingRefLock.current) return;

    ground.current?.setAutoShapes(activeGoalShapes);
  }, [ground, activeGoalShapes, sourceId]);

  // ============================================================================
  // Hint (drawable shapes) - exposed via ref
  // ============================================================================
  useImperativeHandle(
    ref,
    () => ({
      showHint(hintLevel: number) {
        if (!ground.current || !drawHintMove) return;
        const parsedUci = parseUci(drawHintMove);
        if (!parsedUci) return;

        const orig = parsedUci.from as Key;
        const dest = parsedUci.to as Key;
        const hintShape: DrawShape = hintLevel <= 1 ? { orig, brush: "red" } : { orig, dest, brush: "red" };
        ground.current.setAutoShapes([...activeGoalShapes, hintShape]);
        playHintSound();
      },
    }),
    [drawHintMove, ground, activeGoalShapes, playHintSound],
  );

  return (
    <>
      <div className="board-wrapper">
        <div ref={boardRef} className="cardinal green" style={{ width: "100%", height: "100%" }} />
      </div>
    </>
  );
}

// React’s API order is fixed: forwardRef<RefType, PropsType>.
export default forwardRef<VoltBoardHandle, VoltBoardProps>(VoltBoard);
