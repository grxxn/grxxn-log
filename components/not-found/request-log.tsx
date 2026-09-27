"use client";

import { usePathname } from "next/navigation";

// 요청한 경로를 GET 로그 한 줄로 보여줌
export function RequestLog() {
  const pathname = usePathname();

  return (
    <p className="font-mono text-[13px] break-all text-fg-muted md:text-sm">
      GET {pathname} <span className="text-accent">→ 404</span>
    </p>
  );
}
