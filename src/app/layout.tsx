import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#211B7B" }, // Light theme primary color
    { media: "(prefers-color-scheme: dark)", color: "#F75049" }, // Dark theme primary color
  ],
};

export const metadata: Metadata = {
  title: "VERTEXDB",
  description:
    "VertexDB is a community-powered resource database for video games. It's also just a 4fun Nextjs project please don't nuke my servers dear lord thank you.",
  openGraph: { images: ["/twitter-image.png"] },
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicons/favicon-16x16.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicons/favicon-32x32.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/favicons/apple-touch-icon.png",
    },
    {
      rel: "mask-icon",
      color: "#f75049",
      url: "/favicons/safari-pinned-tab.svg",
    },
  ],
  manifest: "/favicons/site.webmanifest",
  other: {
    "msapplication-TileColor": "#F75049",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark, variables: { fontSize: "1.6rem" } }}>
      <html lang="en" suppressHydrationWarning /*for next-themes*/>
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
