import { ImageResponse } from "next/og";
import { OG_SIZE, OgThumbnail } from "@/components/og/og-thumbnail";
import { loadOgFonts } from "@/lib/og-fonts";
import { getPostDetail, getPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `${site.name} 글 썸네일`;

// 발행된 모든 글의 OG 이미지를 빌드 시점에 만듦
export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

// 글 번호, 썸네일 키워드, 톤으로 글의 OG 이미지를 만듦
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const detail = getPostDetail((await params).slug);
  if (!detail) return new Response(null, { status: 404 });
  const { post } = detail;
  const label = `No.${post.no}`;

  return new ImageResponse(
    <OgThumbnail
      label={label}
      keyword={post.thumb}
      caption={site.name}
      tone={post.tone}
    />,
    {
      ...OG_SIZE,
      fonts: await loadOgFonts({ sans: post.thumb, mono: label + site.name }),
    },
  );
}
