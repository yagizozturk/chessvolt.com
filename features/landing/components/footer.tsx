import { BookOpenText, LogIn, Swords, TrendingUpDown, UserPlus, Zap } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const links = [
    { href: "/openings", label: "Opening Crusher", icon: BookOpenText },
    { href: "/challenge", label: "Challenges", icon: Swords },
    { href: "/arrows", label: "Arrows Game", icon: TrendingUpDown },
  ];

  return (
    <footer className="border-border/40 mt-20 border-t bg-[#3b247c]">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Link
              href="/"
              className="text-foreground flex items-center gap-2 text-2xl font-bold tracking-tighter transition-opacity hover:opacity-90"
            >
              <Zap className="fill-primary text-primary h-6 w-6" />
              <span>ChessVolt</span>
            </Link>
            <p className="text-muted-foreground mt-4 max-w-xs text-sm leading-relaxed">
              A gamified, community-focused, and modern learning platform. Push your limits, shine with Volt.
            </p>
          </div>
          <div className="flex flex-col items-center gap-6 md:items-end">
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-1 md:justify-end">
              {links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-end">
              <Link
                href="/login"
                className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </Link>
              <Link
                href="/signup"
                className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                Sign up
              </Link>
            </div>
          </div>
        </div>

        <div className="text-muted-foreground mt-8 flex justify-center pt-8 text-xs tracking-wide">
          <span>© 2026 VOLT Learning Inc.</span>
        </div>
      </div>
    </footer>
  );
}
