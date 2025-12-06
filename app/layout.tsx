import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { MobileNav } from "@/components/layout/mobile-nav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair"
});

export const metadata: Metadata = {
  title: "Tanin | Cellier Premium",
  description: "Gestion de cave à vin pour œnologues",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground min-h-screen pb-20`}>
        {children}
        <MobileNav />
      </body>
    </html>
  );
}
