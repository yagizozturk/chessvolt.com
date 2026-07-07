import Image from "next/image";

export function Curve() {
  return (
    <section className="bg-[#8434ed] pt-20 pb-10">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
              Introducing Hermann Ebbinghaus
            </h2>
            <p className="text-foreground/80 mx-auto max-w-2xl text-lg leading-relaxed">
              <span className="text-primary font-medium">Hermann Ebbinghaus</span> was a German psychologist who studied
              memory and learning. He is best known for his work on the{" "}
              <span className="text-primary font-medium">forgetting curve</span>. ChessVolt is using his work to help
              you practice chess.
            </p>
          </div>
          <div>
            <Image src="/images/hero/curve-4.png" alt="The Forgetting Curve" width={1536} height={1024} />
          </div>
        </div>
      </div>
    </section>
  );
}
