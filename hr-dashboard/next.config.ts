import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This app lives inside the amdar-ims repo for now and will be split out
  // later; pinning the root stops Next inferring it from the parent lockfile.
  turbopack: { root: __dirname },
};

export default nextConfig;
