import type { ImageResponse } from "next/og";

type OgFontOptions = NonNullable<
  NonNullable<ConstructorParameters<typeof ImageResponse>[1]>["fonts"]
>;

const GOOGLE_FONTS_CSS = "https://fonts.googleapis.com/css2";

type OgFontWeight = 400 | 500;

// Google Fonts에서 주어진 글자만 담은 TTF 서브셋을 받아옴
const loadGoogleFont = async (
  family: string,
  weight: OgFontWeight,
  text: string,
) => {
  const query = new URLSearchParams({
    family: `${family}:wght@${weight}`,
    text: [...new Set(text)].join(""),
  });
  const css = await fetch(`${GOOGLE_FONTS_CSS}?${query}`).then((res) =>
    res.text(),
  );
  const src = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
  if (!src) throw new Error(`${family} ${weight} 폰트 주소를 찾지 못했습니다.`);

  const font = await fetch(src);
  if (!font.ok) throw new Error(`${family} ${weight} 폰트를 받지 못했습니다.`);
  return font.arrayBuffer();
};

type OgFontTexts = {
  sans: string;
  mono: string;
};

// OG 이미지에 들어갈 글자로 IBM Plex Sans KR 500과 IBM Plex Mono 400을 준비함
export const loadOgFonts = async ({
  sans,
  mono,
}: OgFontTexts): Promise<OgFontOptions> => {
  const [sansData, monoData] = await Promise.all([
    loadGoogleFont("IBM Plex Sans KR", 500, sans),
    loadGoogleFont("IBM Plex Mono", 400, mono),
  ]);
  return [
    { name: "IBM Plex Sans KR", data: sansData, weight: 500, style: "normal" },
    { name: "IBM Plex Mono", data: monoData, weight: 400, style: "normal" },
  ];
};
