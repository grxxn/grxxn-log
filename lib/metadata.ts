import type { Metadata } from "next";
import { site } from "./site";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

// 페이지 주소를 canonical로 두고 모든 페이지에 RSS 링크를 붙임
export const createAlternates = (path: string) =>
  ({
    canonical: path,
    types: {
      "application/rss+xml": [{ url: site.feedPath, title: site.name }],
    },
  }) satisfies Metadata["alternates"];

// 사이트 이름과 언어를 공통으로 넣은 Open Graph 메타데이터를 만듦
export const createOpenGraph = (openGraph: OpenGraph): OpenGraph => ({
  siteName: site.name,
  locale: "ko_KR",
  ...openGraph,
});
