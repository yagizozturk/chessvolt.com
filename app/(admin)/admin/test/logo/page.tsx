import { ChessVoltLogo } from "@/components/chessvolt-logo";

export default function LogoTestPage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="bg-brand flex min-h-[70vh] w-full flex-col items-center justify-center rounded-lg px-6 py-24">
        <ChessVoltLogo size="hero" href="/" />
      </section>

      <section className="flex flex-col items-center gap-6 rounded-lg border px-6 py-12">
        <p className="text-muted-foreground text-sm font-medium">Landing page size</p>
        <ChessVoltLogo size="default" />
      </section>
    </div>
  );
}
