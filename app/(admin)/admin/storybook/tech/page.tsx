import Link from "next/link";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const techTopics = [
  {
    title: "useState",
    description: "Store local component state and trigger re-renders with a setter function.",
    href: "/admin/storybook/tech/use-state",
  },
  {
    title: "Record<string, string[]>",
    description: "A typed key-value map — like Dictionary<string, List<string>> in C#.",
    href: "/admin/storybook/tech/record",
  },
] as const;

export default function TechShowcasePage() {
  return (
    <section id="tech" className="space-y-6">
      <div>
        <h2 className="text-foreground text-2xl font-semibold tracking-tight">Tech</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Technologies and patterns used in this project. Pick a topic to read the explanation and try a live example.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {techTopics.map((topic) => (
          <Link key={topic.href} href={topic.href} className="block">
            <Card className="hover:bg-muted/40 h-full transition-colors">
              <CardHeader>
                <CardTitle className="text-base">{topic.title}</CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
