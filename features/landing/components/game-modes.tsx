import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Headphones,
  Puzzle,
  Zap,
  MousePointer2,
  Type,
  Sparkles,
} from "lucide-react";

export function GameModes() {
  const modes = [
    {
      title: "Quick Match",
      description:
        "Match words and meanings in a race against time, improve your reflexes.",
      icon: <Zap className="h-8 w-8 text-amber-500" />,
      color: "bg-amber-500/15",
      accent: "border-l-4 border-l-amber-500",
    },
    {
      title: "Fill in the Blanks",
      description:
        "Place the right words to understand sentence structure.",
      icon: <Type className="h-8 w-8 text-sky-500" />,
      color: "bg-sky-500/15",
      accent: "border-l-4 border-l-sky-500",
    },
    {
      title: "Listen and Write",
      description:
        "Strengthen your pronunciation and listening by writing sentences you hear flawlessly.",
      icon: <Headphones className="h-8 w-8 text-violet-500" />,
      color: "bg-violet-500/15",
      accent: "border-l-4 border-l-violet-500",
    },
    {
      title: "Drag and Drop",
      description:
        "Create the correct sentence order by dragging complex words.",
      icon: <MousePointer2 className="h-8 w-8 text-emerald-500" />,
      color: "bg-emerald-500/15",
      accent: "border-l-4 border-l-emerald-500",
    },
    {
      title: "Dialogue Simulation",
      description:
        "Practice conversational dialogue in realistic scenarios with AI.",
      icon: <MessageSquare className="h-8 w-8 text-orange-500" />,
      color: "bg-orange-500/15",
      accent: "border-l-4 border-l-orange-500",
    },
    {
      title: "Brain Teasers",
      description: "Level up with challenging puzzles that test your logic.",
      icon: <Puzzle className="h-8 w-8 text-rose-500" />,
      color: "bg-rose-500/15",
      accent: "border-l-4 border-l-rose-500",
    },
  ];

  return (
    <section className="bg-secondary/40 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 flex flex-col items-center text-center">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/10 text-primary mb-6 inline-flex gap-2 rounded-full px-6 py-2 text-base backdrop-blur-md [&_svg]:size-5"
          >
            <Sparkles />
            Varied and Fun Modes
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            No Time to Get Bored
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
            Turn your learning challenge into an adventure with different
            game modes for every level.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modes.map((mode, index) => (
            <Card
              key={index}
              className={`${mode.accent} border border-border/50 bg-background shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl`}
            >
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className={`rounded-2xl p-3 ${mode.color}`}>
                  {mode.icon}
                </div>
                <CardTitle className="text-xl">{mode.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {mode.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

{
  /** Notes:
   * 1. Color Palette: Visual variety with different soft backgrounds (bg-color/10) per game mode.
   * 2. Icon Design: Playful feel using Lucide icons in 2xl size and rounded boxes (rounded-2xl).
   * 3. Hover Effects: Light background change on cards to indicate user interaction.
   * 4. Layout: Grid distributes 6 game modes evenly on screen.
   */
}
