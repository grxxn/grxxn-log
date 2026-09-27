import type { ThumbTone } from "@/lib/posts";

export const OG_SIZE = { width: 1200, height: 630 };

// 이미지 렌더러는 CSS 변수를 읽지 못해 styles/tokens.css의 썸네일 톤 값을 그대로 옮김
const TONE_COLORS = {
  deep: { background: "#23472e", color: "#eef3ea" },
  moss: { background: "#cfe0c6", color: "#1e3a26" },
  pale: { background: "#e6ece0", color: "#2f5a3a" },
} satisfies Record<ThumbTone, { background: string; color: string }>;

type OgThumbnailProps = {
  label: string;
  keyword: string;
  caption: string;
  tone: ThumbTone;
};

// 글 썸네일과 같은 번호·키워드·캡션 3단 구성을 1200×630 OG 이미지로 렌더링함
export function OgThumbnail({ label, keyword, caption, tone }: OgThumbnailProps) {
  const mono = { fontFamily: "IBM Plex Mono", fontSize: 32 };

  return (
    <div
      style={{
        ...TONE_COLORS[tone],
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
      }}
    >
      <span style={{ ...mono, letterSpacing: "0.04em" }}>{label}</span>
      <span
        style={{
          fontFamily: "IBM Plex Sans KR",
          fontSize: 96,
          fontWeight: 500,
          lineHeight: 1.35,
          wordBreak: "keep-all",
        }}
      >
        {keyword}
      </span>
      <span style={mono}>{caption}</span>
    </div>
  );
}
