import type { Post } from "./posts";
import { site } from "./site";

// 글 상세 검색 결과에 쓰일 BlogPosting 구조화 데이터를 만듦
export const createBlogPostingJsonLd = (post: Post) => {
  const url = `${site.url}${post.permalink}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: url,
    image: `${url}/opengraph-image`,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: "ko",
    keywords: post.tags,
    author: {
      "@type": "Person",
      name: site.author.name,
      url: `https://github.com/${site.author.github}`,
    },
  };
};
