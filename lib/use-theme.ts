import { useSyncExternalStore } from "react";
import type { Theme } from "./theme";

// <html data-theme> 속성이 바뀔 때마다 구독자에게 알림
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
};

// 현재 <html>에 적용된 테마를 읽음
export const readTheme = (): Theme | null => {
  const theme = document.documentElement.dataset.theme;
  return theme === "light" || theme === "dark" ? theme : null;
};

// 서버에서는 테마를 알 수 없으므로 null을 반환함
const getServerSnapshot = (): Theme | null => null;

// 사이트에 적용된 테마를 구독하고, 마운트 전에는 null을 반환함
export const useTheme = () =>
  useSyncExternalStore(subscribe, readTheme, getServerSnapshot);
