import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Local development - CMS media files
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/media/**",
      },
      // Local development - CMS API media endpoint
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/api/media/**",
      },
      // Local development - CMS API media file endpoint
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/api/media/file/**",
      },
      // Vercel deployment - media files
      {
        protocol: "https",
        hostname: "*.vercel.app",
        pathname: "/media/**",
      },
      // Vercel deployment - API media endpoint
      {
        protocol: "https",
        hostname: "*.vercel.app",
        pathname: "/api/media/**",
      },
      // Production - custom domain
      {
        protocol: "https",
        hostname: "cms.simeonrubin.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "cms.simeonrubin.com",
        pathname: "/api/media/**",
      },
    ],
  },
};

export default nextConfig;
