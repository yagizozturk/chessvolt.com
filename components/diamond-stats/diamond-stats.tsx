import { BookOpen, ChessBishop, ChessKnight, Crown, Puzzle, Target, Trophy, Users } from "lucide-react";

// x / y: kartın merkez konumu (%), size: kare genişliği (%), valueSize: rakam yazı boyutu (cqw).
const stats = [
  {
    id: "players",
    value: 2000,
    label: "Players",
    Icon: Users,
    x: 12,
    y: 66,
    size: 11,
    valueSize: 1.6,
    accent: "bg-mist-400",
  },
  {
    id: "players",
    value: 154,
    label: "Puzzles",
    Icon: Puzzle,
    x: 20,
    y: 39,
    size: 11,
    valueSize: 1.8,
    accent: "bg-red-400",
  },
  {
    id: "puzzles",
    value: 26,
    label: "Openings",
    Icon: ChessBishop,
    x: 36,
    y: 55,
    size: 16,
    valueSize: 4,
    accent: "bg-purple-400",
  },
  {
    id: "wins",
    value: 18,
    label: "Analysis",
    Icon: ChessKnight,
    x: 52,
    y: 73,
    size: 13,
    valueSize: 3.4,
    accent: "bg-blue-400",
  },
  {
    id: "lessons",
    value: 8,
    label: "Studies",
    Icon: BookOpen,
    x: 67,
    y: 48,
    size: 16,
    valueSize: 5,
    accent: "bg-orange-400",
  },
  {
    id: "goals",
    value: 26,
    label: "Target",
    Icon: Target,
    x: 83,
    y: 29,
    size: 12,
    valueSize: 3.3,
    accent: "bg-yellow-400",
  },
  {
    id: "awards",
    value: 9,
    label: "Victory",
    Icon: Crown,
    x: 90,
    y: 58,
    size: 12,
    valueSize: 3.2,
    accent: "bg-green-400",
  },
];

export default function DiamondStats() {
  return (
    <section
      aria-label="Stats"
      className="relative mx-auto aspect-[2/1] w-full max-w-[1150px] overflow-hidden text-neutral-100"
    >
      {/* ====== Arka plandaki küçük dekoratif kareler ====== */}
      <div
        aria-hidden="true"
        className="bg-yelloww-800/60 absolute top-[42%] left-[48%] aspect-square w-[5%] rotate-45 rounded-sm"
      />
      <div
        aria-hidden="true"
        className="absolute top-[27%] left-[58%] aspect-square w-[3%] rotate-45 rounded-sm bg-gray-800/50"
      />
      <div
        aria-hidden="true"
        className="absolute top-[63%] left-[22%] aspect-square w-[4%] rotate-45 rounded-sm bg-teal-800"
      />
      <div
        aria-hidden="true"
        className="absolute top-[60%] left-[70%] aspect-square w-[4%] rotate-45 rounded-sm bg-purple-800/70"
      />

      {/* ====== İstatistikleri gösteren kareler ====== */}
      <ul className="m-0 list-none p-0">
        {stats.map(({ id, value, label, Icon, x, y, size, valueSize, accent }) => (
          <li
            key={id}
            className="absolute aspect-square -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%`, width: `${size}%` }}
          >
            {/* ====== Ana karenin alt ucundan çıkan sarı parça ====== */}
            {accent && (
              <span
                aria-hidden="true"
                className={`absolute -bottom-[22%] left-1/2 z-1 aspect-square w-[26%] -translate-x-1/2 rotate-45 rounded-[0.7cqw] ${accent}`}
              />
            )}

            {/* ====== Kareyi döndür ====== */}
            <div className="relative flex size-full rotate-45 items-center justify-center rounded-xl border-2 border-[#5638ea] bg-[#5435E2]">
              {/* ====== İçeriği ters yönde döndür: ikon ve rakam düz kalsın ====== */}
              <div className="flex w-full -rotate-45 flex-col items-center text-center">
                <Icon aria-hidden="true" className="text-primary mb-2 size-5" />
                <span className="leading-none font-bold tracking-tight" style={{ fontSize: `${valueSize}cqw` }}>
                  {value}
                </span>
                <span className="mt-2 leading-none font-medium tracking-wide text-neutral-100">{label}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
