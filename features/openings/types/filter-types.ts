export const TYPE_FILTER_LINKS = [
  { label: "All", href: "/openings", value: null },
  { label: "White", href: "/openings?type=white", value: "white" },
  { label: "Black", href: "/openings?type=black", value: "black" },
] as const;
