"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { Zap, ArrowLeft, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";

type JourneyHeaderProps = {
  user: User;
  backHref?: string;
};

export function JourneyHeader({ user, backHref = "/dashboard" }: JourneyHeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#1a1147]/95 backdrop-blur supports-[backdrop-filter]:bg-[#1a1147]/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 hover:text-white"
            asChild
          >
            <Link href={backHref}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-6 bg-white/20" />
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold text-white"
          >
            <Zap className="h-5 w-5 text-[#FFB800]" />
            chessvolt
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 hover:text-white"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <span className="hidden text-sm text-white/60 md:inline">
            {user.email ?? user.user_metadata?.full_name ?? "Kullanıcı"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 md:mr-1" />
            <span className="hidden md:inline">Çıkış</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
