import type { Metadata } from "next";
import { Rajdhani } from "next/font/google";
import { Providers } from "@/utils/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GamesIndexed } from "@/components/layout/GamesIndexed";
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
    <html lang="en">
      <body className={`${rajdhani.className} antialiased`}>
        <Providers>
          <header>
            <Navbar />
            <GamesIndexed />
          </header>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
