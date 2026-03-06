import Link from "next/link";
import { Button } from "@/components/ui/button";

export const GameNavbar = () => {
  return (
    <header className="shrink-0 border-b">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          chessvolt
        </Link>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">Çıkış</Link>
        </Button>
      </div>
    </header>
  );
};
