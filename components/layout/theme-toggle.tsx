"use client";

import { useEffect, useLayoutEffect } from "react";
import {
  DARK_QUERY,
  THEME_STORAGE_KEY,
  getPreferredTheme,
  type Theme,
} from "@/lib/theme";
import { useTheme } from "@/lib/use-theme";

// <html>에 테마를 적용함
const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
};

// 라이트/다크 테마를 전환하는 헤더 버튼을 렌더링함
export function ThemeToggle() {
  const theme = useTheme();

  useLayoutEffect(() => {
    applyTheme(getPreferredTheme());
  }, []);

  useEffect(() => {
    const media = matchMedia(DARK_QUERY);
    const onSystemChange = () => applyTheme(getPreferredTheme());
    media.addEventListener("change", onSystemChange);
    return () => media.removeEventListener("change", onSystemChange);
  }, []);

  // 반대 테마로 바꾸고 선택을 저장함
  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
  };

  const label =
    theme === "dark"
      ? "라이트 모드로 전환"
      : theme === "light"
        ? "다크 모드로 전환"
        : "테마 전환";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className="inline-flex size-11 cursor-pointer items-center justify-center text-fg-muted"
    >
      {theme === "dark" && <SunIcon />}
      {theme === "light" && <MoonIcon />}
    </button>
  );
}

// 해 아이콘을 렌더링함
function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

// 달 아이콘을 렌더링함
function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  );
}
