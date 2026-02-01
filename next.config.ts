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
    ],
  },
};

export default nextConfig;
