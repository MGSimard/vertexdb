import type { Metadata } from "next";
export const siteMetadata: Metadata = {
  applicationName: "VertexDB",
  authors: [{ name: "MGSimard", url: "https://mgsimard.dev" }],
  title: {
    default: "VertexDB",
    template: "VertexDB | %s",
  },
  description: "VertexDB is a community-powered resource database for video games.",
  manifest: "/manifest.webmanifest",
  icons: [
    { rel: "shortcut icon", url: "/metadata/favicon.ico" },
    { rel: "icon", type: "image/png", sizes: "96x96", url: "/metadata/icon.png" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/metadata/apple-icon.png" },
  ],
  openGraph: {
    title: "VertexDB",
    description: "VertexDB is a community-powered resource database for video games.",
    url: "https://vertexdb.vercel.app/",
    siteName: "VertexDB",
    type: "website",
    images: [{ url: "/metadata/opengraph-image.png", width: 1200, height: 600 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VertexDB",
    description: "VertexDB is a community-powered resource database for video games.",
    images: ["/metadata/twitter-image.png"],
    creator: "@MGSimard",
  },
};
