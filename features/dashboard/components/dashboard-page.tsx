import { ChevronRight } from "lucide-react";
import Link from "next/link";

import type { GrandVoltScoreResult } from "@/components/calculator/volt-calculator/grand-volt.types";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CollectionWithRiddleCountAndThemes } from "@/features/collection/types/collection";
import { UserCollectionCard } from "@/features/user-collection/components/user-collection-card";
import { getDisplayName } from "@/features/profile/utilities/user-avatar";
import type { UserProfileData } from "@/features/profile/types/user-profile";

const QUICK_LINKS = [
  {
    title: "My Collections",
    description: "Continue your custom practice lists.",
    href: "/user-collection",
  },
  {
    title: "Library",
    description: "Browse curated riddle collections.",
    href: "/collection",
  },
  {
    title: "Riddles",
    description: "Discover random riddles by theme.",
    href: "/riddles",
  },
  {
    title: "Openings",
    description: "Train opening ideas and variants.",
    href: "/openings",
  },
] as const;

type DashboardPageProps = {
  profile: UserProfileData;
  grandVoltScore: GrandVoltScoreResult;
  recentCollections: CollectionWithRiddleCountAndThemes[];
};

export function DashboardPage({ profile, grandVoltScore, recentCollections }: DashboardPageProps) {
  const displayName = getDisplayName(profile);
  const hasGrandVoltActivity = grandVoltScore.sequenceCount > 0;

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-6 pb-16">
      <div className="flex flex-col gap-8">
        <div className="flex gap-2 rounded-lg bg-[#113DC4]">
          <div className="min-w-0 flex-1 space-y-2 p-4">
            <p className="text-primary text-sm font-semibold">Welcome back</p>
            <h1 className="text-3xl font-bold">Hi, {displayName}</h1>
            <p className="max-w-xl text-sm text-white/80">
              Pick up where you left off with your collections, riddles, and openings.
            </p>
          </div>
          <div className="flex items-end p-4">
            <div className="rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-white/70">Grand Volt</p>
              <p className="text-2xl font-bold">
                {hasGrandVoltActivity ? `${grandVoltScore.volt}/${grandVoltScore.maxVolt}` : "—"}
              </p>
            </div>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2">
          {QUICK_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="group">
              <Card className="h-full transition-colors group-hover:border-primary/40">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle>{link.title}</CardTitle>
                    <CardDescription>{link.description}</CardDescription>
                  </div>
                  <ChevronRight className="text-muted-foreground mt-1 size-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </CardHeader>
              </Card>
            </Link>
          ))}
        </section>

        {recentCollections.length > 0 ? (
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Your collections</h2>
                <p className="text-muted-foreground text-sm">Jump back into a recent practice list.</p>
              </div>
              <Link href="/user-collection" className="text-primary text-sm font-medium hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {recentCollections.map((collection) => (
                <UserCollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
