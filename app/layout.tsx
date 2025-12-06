import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ConditionalNav } from "@/components/layout/conditional-nav";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { getTheme } from "@/lib/theme";
import { Toaster } from "sonner";
import { WineThemeProvider } from "@/lib/contexts/wine-theme-context";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0a",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getTheme();

  return (
    <html lang="fr" className="dark">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground min-h-screen pb-24`}>
        <ThemeProvider theme={theme}>
          <WineThemeProvider>
            {children}
            <ConditionalNav />
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                },
              }}
              expand={false}
              richColors
            />
          </WineThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
