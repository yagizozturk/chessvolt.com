"use client";

import { CollectionHeader } from "@/components/collection/collection-header";
import { Input } from "@/components/ui/input";
import { OpeningBoardCard } from "@/features/openings/components/opening-board-card";
import type { OpeningWithVariantCount } from "@/features/openings/repository/opening.repository";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

type OpeningsListProps = {
  openings: OpeningWithVariantCount[];
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function OpeningsList({ openings }: OpeningsListProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return openings;
    const q = normalize(query.trim());
    return openings.filter((o) => {
      const name = normalize(o.name);
      const eco = o.ecoCode ? normalize(o.ecoCode) : "";
      return name.includes(q) || eco.includes(q);
    });
  }, [openings, query]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 px-2 py-3">
        <CollectionHeader
          title="Openings"
          imageSrc="/images/challanges/legend_games2.png"
          imageAlt="Openings"
          description="Test your repertoire skills and master the openings."
          quote="Play the opening like a book, the middlegame like a magician, and the endgame like a machine."
          author="Rudolf Spielmann"
          itemCount={openings.length}
          itemLabel="openings"
        />
        <div className="relative w-full max-w-[180px] shrink-0">
          <Search className="text-muted-foreground pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Search openings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 pl-8 text-sm"
            aria-label="Search openings..."
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 px-2 py-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((opening, index) => (
          <OpeningBoardCard
            key={opening.id}
            id={opening.id}
            name={opening.name}
            num={index + 1}
            width={250}
            height={250}
            href={`/openings/${opening.slug}/${opening.id}`}
            fen={opening.displayFen}
            variantCount={opening.variantCount}
            description={opening.description}
          />
        ))}
      </div>
    </div>
  );
}
