import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/auth/",
        "/dashboard/",
        "/payment/",
        "/chat",
        "/ai-chat/",
        "/logout",
        "/p/",
        "/api/",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
