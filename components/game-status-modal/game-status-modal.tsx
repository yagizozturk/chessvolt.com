type Props = {
  visible: boolean;
  winner?: "white" | "black";
  onClose: () => void;
  onRestart?: () => void;
};

export default function CheckmateModal({ visible, winner, onClose, onRestart }: Props) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-xl text-center w-[300px] animate-scaleIn">
        
        <h1 className="text-3xl font-bold mb-4">
          CHECKMATE
        </h1>

        <p className="text-lg mb-6 font-medium">
          {winner === "white" ? "White Wins" : "Black Wins"}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-500 active:scale-95 transition"
          >
            New Game
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-300 text-black dark:bg-neutral-700 dark:text-white font-medium hover:bg-neutral-400 dark:hover:bg-neutral-600 active:scale-95 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
