import { cn } from "@/lib/utils";

interface StatItemProps {
  icon: React.ReactNode;
  value: string | number;
  colorClassName?: string;
}

export const StatItem = ({ icon, value, colorClassName }: StatItemProps) => {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 transition-all">
      <div className="shrink-0">
        {icon}
      </div>
      <span className={cn(
        "text-[17px] font-black tracking-tight font-fredoka",
        colorClassName || "text-white"
      )}>
        {value}
      </span>
    </div>
  );
};

/* CN FUNCTION NOTE:
  The cn function combines clsx and tailwind-merge libraries.
  1. Enables clean management of conditional classes like isActive && "bg-blue-500".
  2. When Tailwind classes conflict (e.g. p-2 and p-4 together), ensures the last class wins to prevent style errors.
*/