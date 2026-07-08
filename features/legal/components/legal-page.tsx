type LegalPageProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function LegalPage({ title, description, children }: LegalPageProps) {
  return (
    <main className="container mx-auto max-w-3xl px-4 pt-28 pb-16 md:px-6 md:pt-32">
      <div className="mb-10 text-center">
        <h1 className="text-secondary text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
        <p className="text-secondary/80 mx-auto mt-4 max-w-xl text-lg leading-relaxed">{description}</p>
      </div>
      <div className="border-border/60 bg-card rounded-xl border p-6 shadow-lg md:p-8">{children}</div>
    </main>
  );
}
