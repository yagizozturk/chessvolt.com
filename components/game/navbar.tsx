import { Button } from "@/components/ui/button";
import Link from "next/link";

export const GameNavbar = () => {
  return (
    <header className="border-border shrink-0 border-b">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          chessvolt
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Log out</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
