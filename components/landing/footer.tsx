import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Logo ve Motto */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="font-bold text-2xl tracking-tighter text-primary">
              VOLT
            </Link>
            <p className="mt-4 text-muted-foreground max-w-xs text-sm leading-relaxed">
              A gamified, community-focused, and modern learning platform. 
              Push your limits, shine with Volt.
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Learn</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/courses" className="text-muted-foreground hover:text-foreground">Courses</Link></li>
              <li><Link href="/challenge" className="text-muted-foreground hover:text-foreground">Roadmap</Link></li>
              <li><Link href="/leaderboard" className="text-muted-foreground hover:text-foreground">Ranking</Link></li>
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">Terms</Link></li>
              <li><Link href="/cookies" className="text-muted-foreground hover:text-foreground">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2026 VOLT Learning Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:underline text-balance tracking-tight">English (EN)</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

{
    /** Notes:
     * 1. Grid Layout: Responsive with 2 columns on mobile, 4-5 on desktop.
     * 2. Social Icons: Standard social media area using Lucide-react icons.
     * 3. Color Balance: "text-muted-foreground" keeps side menus less dominant than main content.
     * 4. Footer: Copyright and language selection at bottom, separated by a thin line.
     */
}