import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// 모든 크롤러를 허용하고 sitemap 위치를 알림
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
