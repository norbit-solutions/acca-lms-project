import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3333",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3333",
      },
      {
        protocol: 'https',
        hostname: 'pub-21b67f544eae4559b7436b81b0250a58.r2.dev',
        pathname: '/**',
      },
    ],
    // Allow unoptimized images for local development
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
