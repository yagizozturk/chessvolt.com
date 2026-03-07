import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const GameNavbar = () => {
  return (
    <header className="shrink-0 border-b border-border">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          chessvolt
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Log out</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
