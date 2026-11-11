import type { Metadata } from "next";
import { JetBrains_Mono, Rajdhani } from "next/font/google";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const display = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Rafail Jabbarov — Computer Engineering",
  description:
    "Portfolio of Rafail Jabbarov, Computer Engineering student at the University of Victoria. Embedded systems, PCB design, DSP and infrastructure automation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: themeInitScript sets data-theme before React hydrates
    <html lang="en" className={`${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
