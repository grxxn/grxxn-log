import { buildRssFeed } from "@/lib/feed";

export const dynamic = "force-static";

// 발행된 글 목록을 RSS 피드로 반환함
export function GET() {
  return new Response(buildRssFeed(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
