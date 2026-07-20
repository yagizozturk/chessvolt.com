"use client";

import { useRouter } from "next/navigation";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VOLTS_VIEW_OPTIONS, type VoltsView } from "@/features/volts/types/volts-view";

type VoltsViewFilterProps = {
  view: VoltsView;
};

export function VoltsViewFilter({ view }: VoltsViewFilterProps) {
  const router = useRouter();

  return (
    <div className="min-w-0 sm:max-w-56">
      <Select
        value={view}
        onValueChange={(value) => {
          const option = VOLTS_VIEW_OPTIONS.find((item) => item.value === value);
          if (option) router.push(option.href);
        }}
      >
        <SelectTrigger
          id="volts-view"
          className="w-full rounded-xl border-2 bg-background"
          aria-label="Filter volts by source"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {VOLTS_VIEW_OPTIONS.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
