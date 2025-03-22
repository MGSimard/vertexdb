import type { Metadata, Viewport } from "next";
import { Rajdhani } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { dark } from "@clerk/themes";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GamesIndexed } from "@/components/layout/GamesIndexed";
import { Toaster } from "sonner";
import { siteMetadata } from "@/utils/siteMetadata";
import "@/styles/core.css";
import "@/styles/custom.css";

const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#211B7B" }, // Light theme primary color
    { media: "(prefers-color-scheme: dark)", color: "#F75049" }, // Dark theme primary color
  ],
};

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark, variables: { fontSize: "1.6rem" } }}>
      <html lang="en" suppressHydrationWarning /*for next-themes*/>
        <body className={`${rajdhani.className} antialiased`}>
          <ThemeProvider disableTransitionOnChange defaultTheme="system" enableSystem>
            <header>
              <Navbar />
              <GamesIndexed />
            </header>
            {children}
            <Footer />
            <div id="portal" />
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
