import type { Metadata } from "next";
import { PostSmallItem } from "@/components/post/post-small-item";
import { RequestLog } from "@/components/not-found/request-log";
import { TextLink } from "@/components/ui/text-link";
import { getPosts, withThumbMeta } from "@/lib/posts";

const RECENT_COUNT = 3;

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
};

// 요청 경로 로그, 안내 문구, 최근 글 3개가 있는 404 페이지를 렌더링함
export default function NotFound() {
  const recentPosts = withThumbMeta(getPosts()).slice(0, RECENT_COUNT);

  return (
    <div className="pt-[88px] md:pt-40">
      <section className="flex flex-col gap-4 md:gap-5">
        <RequestLog />
        <h1 className="text-[32px] leading-[1.3] font-semibold break-keep md:text-[40px] md:tracking-[-0.01em]">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-base leading-[1.8] break-keep text-fg-muted md:text-[17px] md:leading-[1.75]">
          주소가 바뀌었거나 삭제된 글일 수 있어요.
        </p>
        <ul className="mt-1 flex flex-wrap gap-5 text-[15px] md:mt-3 md:gap-7">
          <li>
            <TextLink href="/" className="inline-block py-2.5 md:py-0">
              글 목록으로
            </TextLink>
          </li>
          <li>
            <TextLink href="/about" className="inline-block py-2.5 md:py-0">
              소개 보기
            </TextLink>
          </li>
        </ul>
      </section>

      {recentPosts.length > 0 && (
        <section aria-labelledby="recent-posts" className="mt-[88px] md:mt-32">
          <h2 id="recent-posts" className="text-[15px] font-semibold">
            최근 글
          </h2>
          <ul className="mt-4 md:mt-5">
            {recentPosts.map((post) => (
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
        </section>
      )}
    </div>
  );
}
