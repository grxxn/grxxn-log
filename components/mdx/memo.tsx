import type { ReactNode } from "react";

type MemoProps = {
  children: ReactNode;
};

// 본문 흐름을 벗어난 보충 설명을 메모 박스로 보여줌
export function Memo({ children }: MemoProps) {
  return (
    <aside className="mb-6 rounded-md border border-border-strong px-[18px] py-4 md:mb-7 md:px-6 md:py-5">
      <span className="block text-[13px] font-semibold text-fg-muted">
        메모
      </span>
      <div className="mt-2 text-[15px] leading-[1.8] md:text-base [&>:first-child]:mt-0! [&>:last-child]:mb-0!">
        {children}
      </div>
    </aside>
  );
}
