import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      // Wires Tailwind CSS v4 into Turbopack (required for styles to apply).
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Remote image hosts allowed for next/image. Unsplash is used for the
    // demo product/journal photography; add your own CDN/host here later.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      // Local WordPress media (WooCommerce product images).
      { protocol: "http", hostname: "127.0.0.1", port: "8080", pathname: "/**" },
      { protocol: "http", hostname: "localhost", port: "8080", pathname: "/**" },
    ],
  },
};

export default nextConfig;
