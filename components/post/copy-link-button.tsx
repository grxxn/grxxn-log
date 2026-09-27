"use client";

import { useCopyFeedback } from "@/lib/use-copy-feedback";

// 현재 글 주소를 클립보드에 복사하는 버튼을 렌더링함
export function CopyLinkButton() {
  const { copied, copy } = useCopyFeedback();

  return (
    <button
      type="button"
      onClick={() => copy(location.href)}
      className="inline-flex h-11 min-w-[120px] cursor-pointer items-center justify-center rounded-md border border-border-strong px-3.5 py-2 text-sm md:h-10 md:px-4"
    >
      <span aria-live="polite">{copied ? "복사했습니다" : "링크 복사"}</span>
    </button>
  );
}
