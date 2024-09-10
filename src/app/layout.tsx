import type { Metadata } from "next";
import { Rajdhani } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { dark } from "@clerk/themes";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GamesIndexed } from "@/components/layout/GamesIndexed";
import { Toaster } from "sonner";
import "@/styles/core.css";
import "@/styles/custom.css";

const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "VERTEXDB",
  description: "Description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark, variables: { fontSize: "1.6rem" } }}>
      <html lang="en" suppressHydrationWarning /*for next-themes*/>
        <head>
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="msapplication-TileColor" content="#F75049" />
        </head>
        <body className={`${rajdhani.className} antialiased`}>
          <ThemeProvider disableTransitionOnChange>
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
