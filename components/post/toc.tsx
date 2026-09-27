"use client";

import { useEffect, useState } from "react";

type TocItem = {
  title: string;
  url: string;
};

type TocProps = {
  items: TocItem[];
};

const ACTIVE_LINE_RATIO = 0.3;
// 30% 선 아래 전체를 관찰 영역으로 삼아 빠르게 스크롤해도 선을 넘는 순간을 놓치지 않음
const BELOW_VIEWPORT_MARGIN = "10000%";

// 본문 소제목 목록을 보여주고 지금 읽고 있는 섹션을 표시함
export function Toc({ items }: TocProps) {
  const [activeUrl, setActiveUrl] = useState(items[0]?.url);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.url.slice(1)))
      .filter((heading) => heading !== null);
    const lastHeading = headings.at(-1);
    const contentEnd = lastHeading?.parentElement?.lastElementChild;
    if (!lastHeading || !contentEnd) return;
    let isContentEndVisible = false;

    // 본문 끝이 보이면 마지막 소제목을, 아니면 화면 위쪽 30% 선을 지난 마지막 소제목을 현재 섹션으로 정함
    const updateActive = () => {
      const line = window.innerHeight * ACTIVE_LINE_RATIO;
      const passed = headings.filter(
        (heading) => heading.getBoundingClientRect().top <= line,
      );
      const current = isContentEndVisible
        ? lastHeading
        : (passed.at(-1) ?? headings[0]);
      if (current) setActiveUrl(`#${current.id}`);
    };

    const headingObserver = new IntersectionObserver(updateActive, {
      rootMargin: `-${ACTIVE_LINE_RATIO * 100}% 0px ${BELOW_VIEWPORT_MARGIN} 0px`,
    });
    const endObserver = new IntersectionObserver(([entry]) => {
      isContentEndVisible = entry?.isIntersecting ?? false;
      updateActive();
    });
    headings.forEach((heading) => headingObserver.observe(heading));
    endObserver.observe(contentEnd);
    return () => {
      headingObserver.disconnect();
      endObserver.disconnect();
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="목차" className="sticky top-14">
      <p className="text-[13px] font-semibold text-fg-muted">목차</p>
      <ul className="mt-3.5 flex flex-col gap-3.5">
        {items.map((item) => {
          const isActive = item.url === activeUrl;
          return (
            <li key={item.url}>
              <a
                href={item.url}
                aria-current={isActive ? "true" : undefined}
                className={`block text-sm leading-[1.6] break-keep ${
                  isActive ? "font-medium text-accent" : "text-fg-muted"
                }`}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
