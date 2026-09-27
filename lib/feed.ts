import { getPosts } from "./posts";
import { site } from "./site";

const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

// XML 특수 문자를 엔티티로 바꿈
const escapeXml = (text: string) =>
  text.replace(/[&<>"']/g, (char) => XML_ESCAPES[char] ?? char);

// ISO 날짜를 RSS가 쓰는 RFC 822 형식으로 바꿈
const toRfc822 = (isoDate: string) => new Date(isoDate).toUTCString();

// 발행된 글 전체로 RSS 2.0 피드 XML을 만듦
export const buildRssFeed = () => {
  const posts = getPosts();
  const feedUrl = `${site.url}${site.feedPath}`;

  const items = posts
    .map((post) => {
      const url = `${site.url}${post.permalink}`;
      const categories = post.tags
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join("\n");
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRfc822(post.date)}</pubDate>
      <description>${escapeXml(post.description)}</description>
${categories}
    </item>`;
    })
    .join("\n");

  const lastBuildDate = posts[0] ? toRfc822(posts[0].date) : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${site.url}</link>
    <description>${escapeXml(site.description)}</description>
    <language>ko</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
};
