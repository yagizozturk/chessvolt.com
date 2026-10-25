import { ChessKnight, Zap } from "lucide-react";
import Image from "next/image";

import { VoltButton } from "@/components/volt-button/volt-button";

export function Hero() {
  return (
    <section
      aria-label="Learn chess with ChessVolt"
      className="bg-brand overflow-hidden bg-[radial-gradient(ellipse_at_80%_47%,#4f2cba_0,transparent_48%)] px-5 text-white md:px-8 xl:px-[50px]"
    >
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-10 pt-4 pb-3 md:min-h-[660px] md:grid-cols-2 md:gap-3 md:pt-16 md:pb-10 xl:min-h-[710px] xl:gap-5">
        <div className="max-w-xl min-w-0 md:max-w-none">
          <p className="text-secondary-foreground mb-4 flex items-center gap-2.5 text-xs font-bold tracking-widest md:mb-4">
            <ChessKnight aria-hidden="true" className="text-primary size-6" />
            CHESS TRAINING THAT STICKS
          </p>
          <h1 className="mb-6 max-w-2xl text-4xl leading-none font-extrabold tracking-tight sm:text-5xl md:text-6xl xl:text-7xl">
            Turn your mistakes into <span className="text-primary">better moves.</span>
          </h1>
          <p className="text-secondary-foreground mb-7 max-w-md text-base leading-relaxed md:text-lg">
            Your games are full of lessons. Find the moves you missed, understand the ideas, and revisit them until they
            stick.
          </p>
          {/* ====== Get Started button  ====== */}
          <VoltButton href="/dashboard" label="Get Started" />
          {/* ====== Lichess ve chess.com bannerları  ====== */}
          <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-white/15 pt-6">
            <span className="text-secondary-foreground text-xs">Learn from your games on</span>
            <div className="flex items-center gap-4 text-base font-semibold text-[#f2ebff] xl:text-lg">
              <span className="flex items-center gap-1.5">
                <span aria-hidden="true" className="text-2xl text-emerald-400">
                  ♟
                </span>{" "}
                chess.com
              </span>
              {/* ====== Seperator  ====== */}
              <span aria-hidden="true" className="h-5 w-px bg-white/20" />
              <span className="flex items-center gap-1.5">
                <span aria-hidden="true" className="text-2xl">
                  ♘
                </span>{" "}
                lichess.org
              </span>
            </div>
          </div>
        </div>

        {/* ====== Volt un söylediği sözler  ====== */}
        {/* ====== Isolate : elementin içinde yer alan katmanları (z-index değerlerini), dış dünyadaki diğer elementlerden izole eder. Böylece dışarıdaki stillerin içerideki katman sıralamasını yanlışlıkla bozmasının önüne geçer.  ====== */}
        <div className="relative isolate mx-auto mt-2 w-full max-w-md min-w-0 pt-2 md:mt-0 md:max-w-none">
          {/* ====== Volt un söylediği sözlerin arka planındaki yuvarlak  ====== */}
          <div
            aria-hidden="true"
            className="absolute top-[8%] left-[12%] z-0 aspect-square w-[88%] rounded-full border border-[#c6a8ff]/15 shadow-[0_0_0_43px_#b788ff05,0_0_0_44px_#c6a8ff0b]"
          />
          {/* ====== Volt un söylediği sözlerin ilki  ====== */}
          <div className="absolute -top-2.5 left-0 z-20 flex -rotate-6 items-center gap-3 rounded-xl bg-white px-3.5 py-2.5 text-black shadow-[0_8px_30px_#1c0a541c] md:top-0 md:left-2 md:px-4 md:py-3.5">
            <span
              aria-hidden="true"
              className="grid size-7 shrink-0 place-items-center rounded-full bg-[#e5eedb] font-bold text-emerald-700"
            >
              ✓
            </span>
            <div className="text-xs leading-relaxed">
              <strong className="block">A mistake today.</strong>
              <span className="text-secondary block">A better move tomorrow.</span>
            </div>
          </div>
          {/* ====== Volt un söylediği sözlerin arka planındaki resim  ====== */}
          <Image
            src="/images/hero/bg-volt-piece-hold.png"
            alt="Volt, the friendly orange chess coach, holding a golden knight"
            width={1280}
            height={1280}
            priority
            sizes="(max-width: 767px) 28rem, (max-width: 1279px) 55vw, 650px"
            className="relative z-10 block h-auto w-full max-w-none drop-shadow-[0_20px_35px_#17084b3a] md:-ml-[5%] md:w-[115%] xl:-ml-[4%] xl:w-[112%] 2xl:w-[116%]"
          />
          {/* ====== Volt un söylediği sözlerin ikinci  ====== */}
          <div className="absolute right-0 bottom-0 z-30 flex rotate-3 items-center gap-2.5 rounded-xl border border-white/15 bg-purple-700/90 px-4 py-3 text-xs shadow-[0_8px_28px_#24106038] md:right-4 md:bottom-2">
            <Zap aria-hidden="true" className="text-primary size-6 shrink-0" />
            Meet your next good move.
          </div>
        </div>
      </div>
    </section>
  );
}
