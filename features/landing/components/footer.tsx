import { Zap } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const links = [
    { href: "/contact", label: "Contact Us" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
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
          </div>
          <div className="flex flex-col items-center gap-6 md:items-end">
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-1 md:justify-end">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
