import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.amdari.io",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "api.amdari.io",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "api.amdari.io",
        pathname: "/api/storage/**",
      },
      {
        protocol: "https",
        hostname: "api.amdari.io",
        pathname: "/api/images/**",
      },
      {
        protocol: "https",
        hostname: "api.amdari.io",
        pathname: "/tools/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
