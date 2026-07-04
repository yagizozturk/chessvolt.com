interface PageHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export function PageHeader({
  title,
  description,
  className = "bg-[linear-gradient(to_right,_#4A00E0,_#8E2DE2)]",
}: PageHeaderProps) {
  return (
    <div className={`flex flex-col gap-2 rounded-xl p-6 ${className}`}>
      <h1 className="text-xl font-bold md:text-2xl">{title}</h1>
      <p className="text-muted-foreground text-sm md:text-base">{description}</p>
    </div>
  );
}
