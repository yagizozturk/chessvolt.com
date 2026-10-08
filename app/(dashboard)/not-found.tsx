import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | ChessVolt",
  description:
    "The page you're looking for could not be found. Explore chess openings, puzzles and studies on ChessVolt.",
};

export default function DashboardNotFound() {
  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        <h1 className="text-2xl font-bold">Page Not Found</h1>
        <p className="text-muted-foreground">
          The page you&apos;re looking for could not be found. Explore chess openings, puzzles and studies on ChessVolt.
        </p>
      </div>
    </div>
  );
}
