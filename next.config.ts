import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_REACT_APP_API_URL?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["@n8n/chat"],
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
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    if (!apiUrl) return [];

    return [
      {
        source: "/api/proxy/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
