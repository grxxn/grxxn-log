import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { ThumbTone } from "@/lib/posts";
import { PostThumbnail } from "./post-thumbnail";

type PostListItemProps = {
  href: string;
  title: string;
  date: string;
  no: string;
  thumb: string;
  tone: ThumbTone;
};

// 썸네일, 작성일, 제목으로 된 가로형 글 목록 항목을 렌더링함
export function PostListItem({
  href,
  title,
  date,
  no,
  thumb,
  tone,
}: PostListItemProps) {
  return (
    <li className="border-t border-border">
      <Link
        href={href}
        className="group flex items-start gap-[18px] py-6 focus-visible:outline-offset-8 md:items-center md:gap-11 md:py-9"
      >
        <PostThumbnail no={no} keyword={thumb} tone={tone} />
        <div className="min-w-0">
          <time
            dateTime={date}
            className="block font-mono text-xs text-fg-muted md:text-[13px]"
          >
            {formatDate(date)}
          </time>
          <h3 className="mt-1.5 text-[17px] leading-[1.6] font-medium break-keep group-hover:text-accent md:mt-3 md:text-[22px] md:leading-[1.55]">
            {title}
          </h3>
        </div>
      </Link>
    </li>
  );
}
