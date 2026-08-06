export const TYPE_FILTER_LINKS = [
  { label: "All", href: "/openings", value: null },
  { label: "White Openings", href: "/openings?type=white", value: "white" },
  { label: "Black Openings", href: "/openings?type=black", value: "black" },
] as const;
