import type { Theme } from "./theme";

export const GISCUS_ORIGIN = "https://giscus.app";

export const GISCUS_THEME_PATH = "/giscus-theme";

export const giscusAttributes = {
  repo: "grxxn/grxxn-log",
  "repo-id": "R_kgDOUtvsSg",
  category: "Announcements",
  "category-id": "DIC_kwDOUtvsSs4DGfjA",
  mapping: "pathname",
  strict: "0",
  "reactions-enabled": "0",
  "emit-metadata": "1",
  "input-position": "top",
  lang: "ko",
  loading: "lazy",
} satisfies Record<string, string>;

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

// 사이트 테마에 맞는 giscus 테마 값을 만듦 (로컬 주소는 브라우저가 giscus.app의 접근을 막아 기본 테마를 씀)
export const getGiscusTheme = (theme: Theme, siteUrl: string) =>
  LOOPBACK_HOSTS.has(new URL(siteUrl).hostname)
    ? theme
    : `${siteUrl}${GISCUS_THEME_PATH}/${theme}.css`;

type GiscusMessage = {
  commentCount?: number;
  error?: string;
};

// giscus iframe이 보낸 메시지에서 댓글 수와 오류를 꺼냄
export const readGiscusMessage = (data: unknown): GiscusMessage | undefined => {
  if (typeof data !== "object" || data === null || !("giscus" in data)) return;
  const { giscus } = data;
  if (typeof giscus !== "object" || giscus === null) return;

  if ("error" in giscus && typeof giscus.error === "string") {
    return { error: giscus.error };
  }
  if (
    "discussion" in giscus &&
    typeof giscus.discussion === "object" &&
    giscus.discussion !== null &&
    "totalCommentCount" in giscus.discussion &&
    "totalReplyCount" in giscus.discussion &&
    typeof giscus.discussion.totalCommentCount === "number" &&
    typeof giscus.discussion.totalReplyCount === "number"
  ) {
    return {
      commentCount:
        giscus.discussion.totalCommentCount + giscus.discussion.totalReplyCount,
    };
  }
  return {};
};
