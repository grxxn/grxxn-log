export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

export const DARK_QUERY = "(prefers-color-scheme: dark)";

// 저장된 테마가 있으면 그 값을, 없으면 시스템 설정을 반환함
export const getPreferredTheme = (): Theme => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {}
  return matchMedia(DARK_QUERY).matches ? "dark" : "light";
};

// 첫 페인트 전에 <html data-theme>을 설정하는 인라인 스크립트
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("${DARK_QUERY}").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}})()`;
