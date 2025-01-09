import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enables React strict mode
  basePath: "/chess-club-frontend", // GitHub Pages requires this
  assetPrefix: "/chess-club-frontend/", // Ensures correct asset paths

  images: {
    unoptimized: true, // Disable Next.js image optimization for static hosting (GitHub Pages)
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@public": `${__dirname}/public`, // Allows easier imports from the public folder
    };
    return config;
  },
};

export default nextConfig;
