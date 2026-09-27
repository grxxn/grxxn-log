import Link from "next/link";
import type { ThumbTone } from "@/lib/posts";
import { PagedList } from "./paged-list";
import { PostSmallItem } from "./post-small-item";

const PAGE_SIZE = 4;

type OtherPost = {
  slug: string;
  permalink: string;
  title: string;
  date: string;
  no: string;
  thumb: string;
  tone: ThumbTone;
};

type OtherPostsProps = {
  posts: OtherPost[];
};

// 현재 글을 뺀 글 목록을 4개씩 나눠 페이지네이션과 함께 렌더링함
export function OtherPosts({ posts }: OtherPostsProps) {
  if (posts.length === 0) return null;

  const pages = Array.from(
    { length: Math.ceil(posts.length / PAGE_SIZE) },
    (_, i) => (
      <ul key={i}>
        {posts.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE).map((post) => (
          <PostSmallItem
            key={post.slug}
            href={post.permalink}
            title={post.title}
            date={post.date}
            no={post.no}
            thumb={post.thumb}
            tone={post.tone}
          />
        ))}
      </ul>
    ),
  );

  return (
    <section aria-labelledby="other-posts" className="mt-[88px] md:mt-32">
      <div className="flex items-center justify-between md:items-baseline">
        <h2 id="other-posts" className="text-[15px] font-semibold">
          다른 글
        </h2>
        <Link href="/" className="py-2.5 text-sm text-fg-muted md:py-0">
          전체 글 보기
        </Link>
      </div>
      <div className="mt-2 md:mt-5">
        <PagedList label="다른 글 페이지" pages={pages} />
      </div>
    </section>
  );
}
