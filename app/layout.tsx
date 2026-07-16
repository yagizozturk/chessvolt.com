// TODO: Refactor
import type { Metadata } from "next";
import { Geist_Mono, IBM_Plex_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import { ThemeProvider } from "@/components/theme-provider/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  title: "ChessVolt",
  description:
    "ChessVolt is a gamified, community-focused, and modern learning platform. Push your limits, shine with Volt.",
  icons: {
    icon: "/images/favicon/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(ibmPlexSans.variable, geistMono.variable, "dark font-sans")}
    >
      <body suppressHydrationWarning className="bg-background min-h-svh antialiased">
        {/* Dark mode is forced site-wide for now; re-enable light/system when ready. */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </ThemeProvider>
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
