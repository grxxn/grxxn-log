import { ImageResponse } from "next/og";
import { OG_SIZE, OgThumbnail } from "@/components/og/og-thumbnail";
import { loadOgFonts } from "@/lib/og-fonts";
import { site } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `${site.name} — ${site.description}`;

// 글이 아닌 페이지에 쓰는 사이트 기본 OG 이미지를 만듦
export default async function Image() {
  const caption = new URL(site.url).host;

  return new ImageResponse(
    <OgThumbnail
      label={site.name}
      keyword={site.description}
      caption={caption}
      tone="deep"
    />,
    {
      ...OG_SIZE,
      fonts: await loadOgFonts({
        sans: site.description,
        mono: site.name + caption,
      }),
    },
  );
}
