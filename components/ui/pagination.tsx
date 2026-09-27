type PaginationProps = {
  label: string;
  current: number;
  total: number;
  onChange: (page: number) => void;
};

const ITEM_CLASS =
  "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center px-2 text-sm";

// 이전/다음과 번호 버튼으로 현재 페이지를 바꾸는 페이지네이션을 렌더링함
export function Pagination({ label, current, total, onChange }: PaginationProps) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <nav aria-label={label} className="pt-4 md:pt-6">
      <ul className="flex items-center justify-center gap-1 md:gap-2">
        <li className={current === 1 ? "invisible" : undefined}>
          <button
            type="button"
            onClick={() => onChange(current - 1)}
            disabled={current === 1}
            className={`${ITEM_CLASS} text-fg-muted`}
          >
            ← 이전
          </button>
        </li>
        {pages.map((page) => {
          const isCurrent = page === current;
          return (
            <li key={page}>
              <button
                type="button"
                onClick={() => onChange(page)}
                aria-current={isCurrent ? "page" : undefined}
                aria-label={`${page}페이지`}
                className={`${ITEM_CLASS} font-mono ${
                  isCurrent
                    ? "text-fg underline decoration-accent decoration-2 underline-offset-[6px]"
                    : "text-fg-muted"
                }`}
              >
                {page}
              </button>
            </li>
          );
        })}
        <li className={current === total ? "invisible" : undefined}>
          <button
            type="button"
            onClick={() => onChange(current + 1)}
            disabled={current === total}
            className={`${ITEM_CLASS} text-fg-muted`}
          >
            다음 →
          </button>
        </li>
      </ul>
    </nav>
  );
}
