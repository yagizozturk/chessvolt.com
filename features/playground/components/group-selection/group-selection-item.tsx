import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utilities/cn";
import { Card } from "@/components/ui/card";

type GroupSelectionItemProps = {
  icon: LucideIcon;
  value: string | number;
  text: string;
  isSelected?: boolean;
  onClick?: () => void;
};

export default function GroupSelectionItem({
  icon: Icon,
  value,
  text,
  isSelected = false,
  onClick,
}: GroupSelectionItemProps) {
  return (
    <Card
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className={cn(
        "hover:bg-muted/80 flex cursor-pointer flex-col items-center justify-center gap-2 p-4 transition-colors",
        isSelected
          ? "border-primary bg-primary/10 ring-primary ring-2"
          : "border-border bg-muted/50",
      )}
    >
      <Icon
        className={cn(
          "h-10 w-10",
          isSelected ? "text-primary" : "text-muted-foreground",
        )}
      />
      <span
        className={cn(
          "text-center text-sm font-semibold",
          isSelected ? "text-primary" : "text-foreground",
        )}
      >
        {text}
      </span>
    </Card>
  );
}
