"use client";

import { useRef } from "react";
import { useCopyFeedback } from "@/lib/use-copy-feedback";

// 같은 코드 블록의 코드를 클립보드에 복사하는 버튼을 렌더링함
export function CopyCodeButton() {
  const ref = useRef<HTMLButtonElement>(null);
  const { copied, copy } = useCopyFeedback();

  // 버튼이 속한 코드 블록에서 코드 텍스트를 읽어 복사함
  const copyCode = () => {
    const code = ref.current?.closest("figure")?.querySelector("pre")?.textContent;
    if (code) copy(code);
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={copyCode}
      className="inline-flex h-9 min-w-[98px] shrink-0 cursor-pointer items-center justify-center rounded border border-border-strong bg-bg-subtle px-3 py-1 text-xs text-fg-muted md:h-8"
    >
      <span aria-live="polite">{copied ? "복사했습니다" : "복사"}</span>
    </button>
  );
}
