"use client";

import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@/lib/supabase/client";

interface ProfileLogoutButtonProps {
  iconOnly?: boolean;
}

export function ProfileLogoutButton({ iconOnly = false }: ProfileLogoutButtonProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (iconOnly) {
    return (
      <>
        <Button
          type="button"
          variant="volt"
          size="icon"
          className="md:hidden"
          onClick={handleLogout}
          disabled={isLoggingOut}
          aria-label="Log out"
        >
          {isLoggingOut ? <Spinner /> : <LogOutIcon />}
        </Button>
        <Button type="button" variant="volt" className="hidden md:inline-flex" onClick={handleLogout} disabled={isLoggingOut}>
          {isLoggingOut ? <Spinner data-icon="inline-start" /> : <LogOutIcon data-icon="inline-start" />}
          Log out
        </Button>
      </>
    );
  }

  return (
    <Button type="button" variant="volt" onClick={handleLogout} disabled={isLoggingOut}>
      {isLoggingOut ? <Spinner data-icon="inline-start" /> : <LogOutIcon data-icon="inline-start" />}
      Log out
    </Button>
  );
}
