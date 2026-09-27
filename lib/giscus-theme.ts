import type { Theme } from "./theme";

type ThemePalette = {
  bg: string;
  bgSubtle: string;
  fg: string;
  fgMuted: string;
  fgSubtle: string;
  border: string;
  borderStrong: string;
  accent: string;
  accentHover: string;
  grass0: string;
};

// iframe 안에서는 사이트 CSS 변수를 읽을 수 없어 styles/tokens.css의 값을 그대로 옮김
const PALETTES = {
  light: {
    bg: "#f6f7f2",
    bgSubtle: "#e9eee4",
    fg: "#1b211c",
    fgMuted: "#5e6b61",
    fgSubtle: "#6b786e",
    border: "#dde2d8",
    borderStrong: "#c9d3c3",
    accent: "#2f6b3f",
    accentHover: "#1f4a2b",
    grass0: "#e1e6dc",
  },
  dark: {
    bg: "#141a15",
    bgSubtle: "#1d251f",
    fg: "#e6ece0",
    fgMuted: "#9aa89d",
    fgSubtle: "#7e8c81",
    border: "#2a342c",
    borderStrong: "#36423a",
    accent: "#7fb88c",
    accentHover: "#9acba5",
    grass0: "#232c25",
  },
} satisfies Record<Theme, ThemePalette>;

const FONT_IMPORT =
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+KR:wght@400;500;600&display=swap";

// 테마 파일 이름(light.css, dark.css)에서 테마를 꺼냄
export const parseGiscusThemeFile = (file: string): Theme | undefined => {
  const theme = file.replace(/\.css$/, "");
  return theme === "light" || theme === "dark" ? theme : undefined;
};

// DESIGN.md 댓글 항목에 맞춘 giscus 커스텀 테마 CSS를 만듦 (iframe 폭 720px = 화면 768px일 때의 콘텐츠 폭)
export const buildGiscusThemeCss = (theme: Theme) => {
  const c = PALETTES[theme];

  return `@import url("${FONT_IMPORT}");

main {
  --font-sans: "IBM Plex Sans KR", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", "IBM Plex Sans KR", ui-monospace, monospace;

  --color-prettylights-syntax-comment: ${c.fgSubtle};
  --color-prettylights-syntax-constant: ${c.accent};
  --color-prettylights-syntax-entity: ${c.accent};
  --color-prettylights-syntax-storage-modifier-import: ${c.fg};
  --color-prettylights-syntax-entity-tag: ${c.accent};
  --color-prettylights-syntax-keyword: ${c.fg};
  --color-prettylights-syntax-string: ${c.fgMuted};
  --color-prettylights-syntax-variable: ${c.fg};
  --color-prettylights-syntax-brackethighlighter-unmatched: ${c.fg};
  --color-prettylights-syntax-invalid-illegal-text: ${c.bg};
  --color-prettylights-syntax-invalid-illegal-bg: ${c.fg};
  --color-prettylights-syntax-carriage-return-text: ${c.bg};
  --color-prettylights-syntax-carriage-return-bg: ${c.fg};
  --color-prettylights-syntax-string-regexp: ${c.accent};
  --color-prettylights-syntax-markup-list: ${c.fg};
  --color-prettylights-syntax-markup-heading: ${c.fg};
  --color-prettylights-syntax-markup-italic: ${c.fg};
  --color-prettylights-syntax-markup-bold: ${c.fg};
  --color-prettylights-syntax-markup-deleted-text: ${c.fg};
  --color-prettylights-syntax-markup-deleted-bg: ${c.bgSubtle};
  --color-prettylights-syntax-markup-inserted-text: ${c.accent};
  --color-prettylights-syntax-markup-inserted-bg: ${c.bgSubtle};
  --color-prettylights-syntax-markup-changed-text: ${c.fg};
  --color-prettylights-syntax-markup-changed-bg: ${c.bgSubtle};
  --color-prettylights-syntax-markup-ignored-text: ${c.fgMuted};
  --color-prettylights-syntax-markup-ignored-bg: ${c.bgSubtle};
  --color-prettylights-syntax-meta-diff-range: ${c.accent};
  --color-prettylights-syntax-brackethighlighter-angle: ${c.fgMuted};
  --color-prettylights-syntax-sublimelinter-gutter-mark: ${c.borderStrong};
  --color-prettylights-syntax-constant-other-reference-link: ${c.accent};

  --color-btn-text: ${c.fg};
  --color-btn-bg: ${c.bg};
  --color-btn-border: ${c.borderStrong};
  --color-btn-shadow: none;
  --color-btn-inset-shadow: none;
  --color-btn-hover-bg: ${c.bgSubtle};
  --color-btn-hover-border: ${c.borderStrong};
  --color-btn-active-bg: ${c.bgSubtle};
  --color-btn-active-border: ${c.borderStrong};
  --color-btn-selected-bg: ${c.bgSubtle};
  --color-btn-primary-text: ${c.bg};
  --color-btn-primary-bg: ${c.fg};
  --color-btn-primary-border: ${c.fg};
  --color-btn-primary-shadow: none;
  --color-btn-primary-inset-shadow: none;
  --color-btn-primary-hover-bg: ${c.fg};
  --color-btn-primary-hover-border: ${c.fg};
  --color-btn-primary-selected-bg: ${c.fg};
  --color-btn-primary-selected-shadow: none;
  --color-btn-primary-disabled-text: ${c.fgMuted};
  --color-btn-primary-disabled-bg: ${c.bgSubtle};
  --color-btn-primary-disabled-border: ${c.border};
  --color-action-list-item-default-hover-bg: ${c.bgSubtle};
  --color-segmented-control-bg: ${c.bgSubtle};
  --color-segmented-control-button-bg: ${c.bg};
  --color-segmented-control-button-selected-border: ${c.borderStrong};

  --color-fg-default: ${c.fg};
  --color-fg-muted: ${c.fgMuted};
  --color-fg-subtle: ${c.fgSubtle};
  --color-canvas-default: ${c.bg};
  --color-canvas-overlay: ${c.bg};
  --color-canvas-inset: ${c.bg};
  --color-canvas-subtle: ${c.bgSubtle};
  --color-border-default: ${c.borderStrong};
  --color-border-muted: ${c.border};
  --color-neutral-muted: ${c.bgSubtle};
  --color-accent-fg: ${c.accent};
  --color-accent-emphasis: ${c.accent};
  --color-accent-muted: ${c.borderStrong};
  --color-accent-subtle: ${c.bgSubtle};
  --color-success-fg: ${c.accent};
  --color-attention-fg: ${c.fg};
  --color-attention-muted: ${c.borderStrong};
  --color-attention-subtle: ${c.bgSubtle};
  --color-danger-fg: ${c.fg};
  --color-danger-muted: ${c.borderStrong};
  --color-danger-subtle: ${c.bgSubtle};
  --color-primer-shadow-inset: none;
  --color-scale-gray-1: ${c.bgSubtle};
  --color-scale-blue-1: ${c.border};
  --color-social-reaction-bg-hover: ${c.bgSubtle};
  --color-social-reaction-bg-reacted-hover: ${c.bgSubtle};

  font-family: var(--font-sans);
  word-break: keep-all;
}

main .pagination-loader-container {
  background-image: none;
}

main .gsc-loading-image {
  display: none;
}

main .gsc-reactions,
main .gsc-comment-reactions,
main .gsc-reply-reactions {
  display: none;
}

main .gsc-left-header .gsc-comments-count,
main .gsc-left-header .gsc-comments-count-separator,
main .gsc-left-header .gsc-replies-count {
  display: none;
}

main .gsc-comment-box {
  border: 1px solid ${c.borderStrong};
  border-radius: 6px;
}

main .gsc-comment-box-tabs {
  background: ${c.bg};
  border-color: ${c.border};
}

main .gsc-comment-box-main {
  margin: 0;
  padding: 16px 16px 0;
}

main .gsc-comment-box-bottom {
  margin: 0;
  padding: 16px;
}

main .gsc-comment-box-buttons {
  flex: 1;
  margin-inline-start: 0;
}

main .gsc-comment-box-buttons .btn-primary {
  width: 100%;
  justify-content: center;
  margin-inline-start: 0;
}

main .gsc-comment-box-textarea {
  background: ${c.bg};
  font-size: 15px;
}

main .gsc-comment-box-markdown-hint {
  font-family: var(--font-mono);
  font-size: 12px;
}

main .btn {
  min-height: 44px;
  border-radius: 6px;
  box-shadow: none;
}

main .btn-primary:hover {
  opacity: 0.9;
}

main .gsc-comment > div {
  border-width: 1px 0 0;
  border-color: ${c.border};
  border-radius: 0;
  background: transparent;
}

main .gsc-comment-header,
main .gsc-comment-content,
main .gsc-comment-footer {
  padding-left: 0;
  padding-right: 0;
}

main .gsc-comment-header {
  padding-top: 20px;
}

main .gsc-comment-author-avatar img {
  width: 32px;
  height: 32px;
  background: ${c.grass0};
}

main .gsc-comment-author-avatar .link-primary {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  color: ${c.fg};
}

main .gsc-comment-author .link-secondary {
  font-size: 12px;
  color: ${c.fgMuted};
}

main .gsc-comment-author .color-box-border-info {
  border-color: ${c.borderStrong};
  border-radius: 4px;
  color: ${c.accent};
  font-family: var(--font-mono);
  font-size: 11px;
}

main .gsc-comment-content {
  font-size: 15px;
  line-height: 1.75;
}

main .gsc-replies {
  background: transparent;
  border-color: ${c.border};
}

main .gsc-tl-line {
  display: none;
}

main .markdown a,
main .color-text-link {
  color: ${c.accent};
  text-decoration: underline;
  text-underline-offset: 4px;
}

main .markdown a:hover,
main .color-text-link:hover {
  color: ${c.accentHover};
}

main .markdown code {
  background: ${c.bgSubtle};
  border-radius: 4px;
  font-family: var(--font-mono);
}

main .markdown pre {
  background: ${c.bgSubtle};
  border-radius: 6px;
}

main :focus-visible {
  outline: 2px solid ${c.accent};
  outline-offset: 2px;
}

@media (min-width: 720px) {
  main .gsc-comment-box-main {
    padding: 20px 24px 0;
  }

  main .gsc-comment-box-bottom {
    padding: 16px 24px 20px;
  }

  main .gsc-comment-box-buttons {
    flex: none;
    margin-inline-start: auto;
  }

  main .gsc-comment-box-buttons .btn-primary {
    width: auto;
  }

  main .gsc-comment-box-textarea {
    font-size: 16px;
  }

  main .gsc-comment-author-avatar img {
    width: 36px;
    height: 36px;
  }

  main .gsc-comment-author-avatar .link-primary {
    font-size: 14px;
  }

  main .gsc-comment-author .link-secondary {
    font-size: 13px;
  }

  main .gsc-comment-content {
    font-size: 16px;
  }
}
`;
};
