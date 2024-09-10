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
    {
      rel: "shortcut icon",
      url: "/favicon.ico",
    },
  ],
  manifest: "/favicons/site.webmanifest",
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
