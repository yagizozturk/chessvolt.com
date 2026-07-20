export const VOLTS_VIEW_VALUES = ["openings", "collections"] as const;

export type VoltsView = (typeof VOLTS_VIEW_VALUES)[number];

export const DEFAULT_VOLTS_VIEW: VoltsView = "openings";

export const VOLTS_VIEW_OPTIONS = [
  { label: "Opening variants", value: "openings" as const, href: "/volts?view=openings" },
  { label: "Collections", value: "collections" as const, href: "/volts?view=collections" },
] as const;

export function parseVoltsView(value: string | undefined): VoltsView {
  if (value && VOLTS_VIEW_VALUES.includes(value as VoltsView)) {
    return value as VoltsView;
  }

  return DEFAULT_VOLTS_VIEW;
}
