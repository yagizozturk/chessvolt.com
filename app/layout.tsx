import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Geist_Mono, IBM_Plex_Sans } from "next/font/google";

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
  metadataBase: new URL("https://chessvolt.com"),
  title: {
    default: "ChessVolt",
    template: "%s | ChessVolt",
  },
  // title: "ChessVolt",
  description:
    "ChessVolt is a gamified, community focused, and modern chess learning platform that helps players understand chess, practice puzzles, study openings and famous games, and improve with Volt Coach. Push your limits, shine with Volt.",
  icons: {
    icon: "/images/favicon/favicon.svg",
  },
  applicationName: "ChessVolt",
  keywords: [
    "ChessVolt",
    "chess learning platform",
    "chess training platform",
    "learn chess",
    "improve chess",
    "study chess",
    "AI chess coach",
    "Volt Coach",
    "chess coach",
    "chess puzzles",
    "chess openings",
    "opening variations",
    "opening variants",
    "chess training",
    "chess practice",
    "chess games",
    "famous chess games",
  ],
  authors: [
    {
      name: "ChessVolt",
      url: "https://chessvolt.com",
    },
  ],
  robots: {
    index: true, // Allow indexing of the main site. Admin layout.tsx has its own robots metadata to prevent indexing of admin pages.
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(ibmPlexSans.variable, geistMono.variable, "dark font-sans")}>
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
