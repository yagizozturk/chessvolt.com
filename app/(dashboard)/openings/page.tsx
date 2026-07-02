import Image from "next/image";
import Link from "next/link";

import { OpeningBoardCard } from "@/features/openings/components/opening-board-card";
import {
  getOpeningsWithVariantCount,
  getOpeningsWithVariantCountByType,
} from "@/features/openings/services/openings.service";
import { TYPE_FILTER_LINKS } from "@/features/openings/types/filter-types";
import { getPublicUser } from "@/lib/supabase/auth";
import { cn } from "@/lib/utils";

type SearchParams = Promise<{ type?: string }>;

export default async function OpeningsPage({ searchParams }: { searchParams: SearchParams }) {
  const { supabase } = await getPublicUser();
  const params = await searchParams;
  const filterType = params.type?.trim() ?? "";

  const openings = filterType
    ? await getOpeningsWithVariantCountByType(supabase, filterType)
    : await getOpeningsWithVariantCount(supabase);

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-10">
      <div className="flex flex-col gap-8">
        <div className="flex gap-2 rounded-lg bg-[#113DC4]">
          <div className="min-w-0 flex-1 space-y-2 p-4">
            <p className="text-primary text-sm font-semibold">From e4 openings to d4, indian setups</p>
            <h2 className="text-3xl font-bold">Learn Openings To Master The Game</h2>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {TYPE_FILTER_LINKS.map(({ label, href, value }) => {
                const isActive = value === null ? filterType === "" : filterType.toLowerCase() === value.toLowerCase();
                return (
                  <Link
                    key={label}
                    href={href}
                    scroll={false}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted/80 text-foreground hover:bg-muted/60 border",
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="overflow-hidden rounded-lg">
            <Image
              src="/images/openings/bg-openings.png"
              alt="Opening"
              width={268}
              height={200}
              className="object-contain"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {openings.length === 0 && filterType ? (
            <p className="text-muted-foreground col-span-2 text-center text-sm">
              No openings match this type. Set the opening&apos;s type in admin (e.g. white, black, popular).
            </p>
          ) : null}
          {openings.map((opening) => {
            return (
              <OpeningBoardCard
                key={opening.id}
                id={opening.id}
                name={opening.name}
                description={opening.description}
                variantCount={opening.variantCount}
                size={240}
                href={`/openings/${opening.slug}/${opening.id}`}
                fen={opening.displayFen}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
