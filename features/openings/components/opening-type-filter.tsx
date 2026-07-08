// TODO: Refactor
"use client";

import { useRouter } from "next/navigation";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TYPE_FILTER_LINKS } from "@/features/openings/types/filter-types";

type OpeningTypeFilterProps = {
  filterType: string;
};

function getSelectValue(filterType: string) {
  const match = TYPE_FILTER_LINKS.find((link) =>
    link.value === null ? filterType === "" : link.value.toLowerCase() === filterType.toLowerCase(),
  );

  return match?.value ?? "all";
}

export function OpeningTypeFilter({ filterType }: OpeningTypeFilterProps) {
  const router = useRouter();
  const selectValue = getSelectValue(filterType);

  return (
    <div className="min-w-0 sm:max-w-56">
      <Select
        value={selectValue}
        onValueChange={(value) => {
          const link = TYPE_FILTER_LINKS.find((item) => (item.value ?? "all") === value);
          if (link) router.push(link.href);
        }}
      >
        <SelectTrigger
          id="opening-type"
          className="w-full rounded-xl border-2 bg-background"
          aria-label="Filter by opening type"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {TYPE_FILTER_LINKS.map(({ label, value }) => (
              <SelectItem key={label} value={value ?? "all"}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
