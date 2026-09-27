"use client";

import { useEffect, useRef, useState } from "react";
import {
  GISCUS_ORIGIN,
  getGiscusTheme,
  giscusAttributes,
  readGiscusMessage,
} from "@/lib/giscus";
import { getPreferredTheme, type Theme } from "@/lib/theme";
import { readTheme, useTheme } from "@/lib/use-theme";

// giscus iframe에 테마 변경을 알림
const sendTheme = (container: HTMLElement | null, theme: Theme) => {
  const frame = container?.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
  frame?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: getGiscusTheme(theme) } } },
    GISCUS_ORIGIN,
  );
};

// giscus 댓글을 사이트 테마와 연동해 렌더링하고 댓글 수를 제목 옆에 표시함
export function Comments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const [count, setCount] = useState<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || container.hasChildNodes()) return;

    const script = document.createElement("script");
    script.src = `${GISCUS_ORIGIN}/client.js`;
    script.async = true;
    script.crossOrigin = "anonymous";
    for (const [key, value] of Object.entries(giscusAttributes)) {
      script.setAttribute(`data-${key}`, value);
    }
    script.setAttribute(
      "data-theme",
      getGiscusTheme(readTheme() ?? getPreferredTheme()),
    );
    container.append(script);
  }, []);

  useEffect(() => {
    if (theme) sendTheme(containerRef.current, theme);
  }, [theme]);

  useEffect(() => {
    let isThemeSynced = false;

    // giscus가 보낸 메시지로 댓글 수를 갱신하고, 로드 전에 놓친 테마 변경을 한 번 맞춤
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== GISCUS_ORIGIN) return;
      const message = readGiscusMessage(event.data);
      if (!message) return;

      if (!isThemeSynced) {
        isThemeSynced = true;
        const current = readTheme();
        if (current) sendTheme(containerRef.current, current);
      }
      if (message.commentCount !== undefined) setCount(message.commentCount);
      else if (message.error?.includes("Discussion not found")) setCount(0);
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <section aria-labelledby="comments-title" className="mt-16 md:mt-24">
      <h2
        id="comments-title"
        className="flex items-baseline gap-2 text-lg font-semibold md:text-xl"
      >
        댓글
        {count !== undefined && (
          <span className="font-mono text-[13px] font-normal text-fg-muted md:text-sm">
            {count}
          </span>
        )}
      </h2>
      <div ref={containerRef} className="giscus mt-4 md:mt-6" />
      <p className="mt-3 font-mono text-xs text-fg-muted md:mt-4">
        giscus · GitHub Discussions
      </p>
    </section>
  );
}
