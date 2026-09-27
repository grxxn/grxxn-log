import Link from "next/link";
import { formatDate, formatReadingTime } from "@/lib/format";

type PostHeaderProps = {
  no: string;
  date: string;
  readingTime: number;
  title: string;
  series: { name: string; index: number; total: number } | undefined;
  tags: string[];
};

// 목록 링크, 번호·날짜·읽기 시간, 제목, 시리즈와 태그로 된 글 제목 영역을 렌더링함
export function PostHeader({
  no,
  date,
  readingTime,
  title,
  series,
  tags,
}: PostHeaderProps) {
  const hasSubline = series !== undefined || tags.length > 0;

  return (
    <header className="pt-10 md:pt-24">
      <Link
        href="/"
        className="inline-block py-2.5 text-sm text-fg-muted md:py-0"
      >
        ← 글 목록
      </Link>
      <p className="mt-4 flex flex-wrap gap-3 font-mono text-xs text-fg-muted md:mt-10 md:gap-4 md:text-[13px]">
        <span>No.{no}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={date}>{formatDate(date)}</time>
        <span aria-hidden="true">·</span>
        <span>{formatReadingTime(readingTime)}</span>
      </p>
      <h1 className="mt-3.5 max-w-[760px] text-[28px] leading-[1.4] font-semibold tracking-[-0.01em] break-keep md:mt-[18px] md:text-[40px] md:leading-[1.35]">
        {title}
      </h1>
      {hasSubline && (
        <div className="mt-3.5 flex flex-col gap-1.5 text-sm break-keep text-fg-muted md:mt-[18px] md:flex-row md:items-center md:gap-6">
          {series && (
            <p>
              시리즈 · {series.name} {series.index}/{series.total}
            </p>
          )}
          {series && tags.length > 0 && (
            <span aria-hidden="true" className="hidden md:inline">
              ·
            </span>
          )}
          {tags.length > 0 && (
            <ul className="flex flex-wrap gap-3" aria-label="태그">
              {tags.map((tag) => (
                <li key={tag}>#{tag}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </header>
  );
}
