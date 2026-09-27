import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/posts";
import { site } from "@/lib/site";

// 글 목록, 소개, 발행된 글 주소로 sitemap을 만듦
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  return [
    { url: site.url, lastModified: posts[0]?.date ?? new Date() },
    { url: `${site.url}/about` },
    ...posts.map((post) => ({
      url: `${site.url}${post.permalink}`,
      lastModified: post.updated ?? post.date,
    })),
  ];
}
