import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { OpeningIdeas } from "@/features/openings/types/opening-variant";

type IdeaViewerProps = {
  ideas: OpeningIdeas;
  className?: string;
};

type IdeaItem = {
  label: string;
  value: string;
};

export default function IdeaViewer({ ideas, className }: IdeaViewerProps) {
  const items: IdeaItem[] = [
    { label: "Core idea", value: ideas.core_idea },
    { label: "Common mistake", value: ideas.common_mistake },
  ].filter((item) => item.value?.trim().length > 0);

  if (items.length === 0) return null;

  return (
    <Card className={className}>
      <div className="flex flex-col gap-3 px-4 sm:px-5">
        <CardTitle className="text-base">Ideas</CardTitle>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.label} className="space-y-1">
              <p className="text-xs font-semibold tracking-wide uppercase">
                {item.label}
              </p>
              <CardDescription className="text-sm leading-relaxed">
                {item.value}
              </CardDescription>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
