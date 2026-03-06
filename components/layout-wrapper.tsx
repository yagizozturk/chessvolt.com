"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Landing page: no sidebar, page has its own Navbar
  if (pathname === "/") {
    return <>{children}</>;
  }

  // Auth pages: no sidebar
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password"
  ) {
    return <>{children}</>;
  }

  // Auth callback: no sidebar (redirect route)
  if (pathname?.startsWith("/auth/")) {
    return <>{children}</>;
  }

  // All other pages: sidebar + content
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
