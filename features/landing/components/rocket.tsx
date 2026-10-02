import Image from "next/image";

export function Rocket() {
  return (
    <section className="flex justify-center pt-30">
      <h2 className="text-2xl font-bold tracking-tight text-neutral-100">Rocket</h2>
      <img src="/images/hero/bg-rocket-rise.png" alt="ChessVolt Dashboard Preview" width="800" />
    </section>
  );
}
