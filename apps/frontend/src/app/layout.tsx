import type { Metadata } from "next";
import { Inter_Tight, Newsreader } from "next/font/google";
import { MoreHorizontal } from "lucide-react";
import "./globals.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/kibo-ui/theme-switcher";
import { AnimationProvider } from "@/providers/animation-provider";
import { AboutDialog } from "@/components/about-dialog";
import { ThemeFavicon } from "@/components/theme-favicon";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Simeon Rubin",
  description:
    "A range of projects made by Simeon Rubin, a Designer and Developer",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Simeon Rubin",
    description:
      "A range of projects made by Simeon Rubin, a Designer and Developer",
    url: "https://simeonrubin.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${interTight.variable} ${newsreader.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeFavicon />
          <AnimationProvider>
            <div className="fixed top-4 right-4 z-[1100]">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-md hover:bg-accent hover:rounded-xl transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="z-[1100] w-fit min-w-0 p-2 rounded-3xl"
                >
                  <div className="mb-2">
                    <ThemeSwitcher className="w-fit" />
                  </div>
                  <AboutDialog />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {children}
          </AnimationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
