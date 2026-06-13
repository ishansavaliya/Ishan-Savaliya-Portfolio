import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Note: the control portal path is intentionally NOT listed here —
        // listing it in robots.txt would publicly reveal the hidden URL.
        // It's protected by auth + has no inbound links, so it won't be indexed.
        disallow: ["/api"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
