import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { ThumbTone } from "@/lib/posts";
import { PostThumbnail } from "./post-thumbnail";

type PostSmallItemProps = {
  href: string;
  title: string;
  date: string;
  no: string;
  thumb: string;
  tone: ThumbTone;
};

// 작은 썸네일, 작성일, 제목으로 된 짧은 글 목록 항목을 렌더링함
export function PostSmallItem({
  href,
  title,
  date,
  no,
  thumb,
  tone,
}: PostSmallItemProps) {
  return (
    <li className="border-t border-border last:border-b">
      <Link
        href={href}
        className="group flex items-start gap-4 py-5 focus-visible:outline-offset-8 md:items-center md:gap-8 md:py-6"
      >
        <PostThumbnail
          label={`No.${no}`}
          keyword={thumb}
          tone={tone}
          size="sm"
        />
        <div className="min-w-0">
          <time
            dateTime={date}
            className="block font-mono text-xs text-fg-muted"
          >
            {formatDate(date)}
          </time>
          <h3 className="mt-1.5 text-base leading-[1.6] font-medium break-keep group-hover:text-accent md:text-[17px]">
            {title}
          </h3>
        </div>
      </Link>
    </li>
  );
}
