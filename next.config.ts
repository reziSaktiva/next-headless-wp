import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/wp-content/**",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["axios"],
  },
};

export default nextConfig;
