import type { Metadata } from "next";
import { Rajdhani } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
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
    <ClerkProvider appearance={{ baseTheme: dark, variables: { fontSize: "1.6rem" } }}>
      <html lang="en">
        <body className={`${rajdhani.className} antialiased`}>
          <header>
            <Navbar />
            <GamesIndexed />
          </header>
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
