export function Rocket() {
  return (
    <section className="flex justify-center pt-30">
      <div className="@container relative w-full max-w-[800px]">
        <img
          src="/images/hero/bg-rocket-rise.png"
          alt="ChessVolt Dashboard Preview"
          width={1775}
          height={996}
          className="h-auto w-full"
        />
        <p className="absolute top-[26%] right-[58%] max-w-[6ch] -translate-y-1/2 text-right text-[11cqw] leading-tight font-extrabold tracking-tighter text-neutral-100 uppercase">
          Boost Chess
        </p>
        <p className="absolute top-[26%] left-[60.5%] max-w-[7ch] -translate-y-1/2 text-[11cqw] leading-tight font-extrabold tracking-tighter text-neutral-100 uppercase">
          Your Skill
        </p>
      </div>
    </section>
  );
}
