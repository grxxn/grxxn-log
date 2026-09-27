import { PostListItem } from "@/components/post/post-list-item";
import { PublishGrass } from "@/components/post/publish-grass";
import {
  getPosts,
  getPublishGrass,
  groupByYear,
  withThumbMeta,
} from "@/lib/posts";
import { site } from "@/lib/site";

const GRASS_WEEKS = 30;

// 잔디와 연도별 글 목록이 있는 홈 페이지를 렌더링함
export default function Home() {
  const groups = groupByYear(withThumbMeta(getPosts()));

  return (
    <>
      <section className="pt-14 md:flex md:items-end md:justify-between md:gap-10 md:pt-28">
        <div>
          <h1 className="text-[32px] leading-[1.3] font-semibold break-keep md:text-[40px] md:tracking-[-0.01em]">
            글
          </h1>
          <p className="mt-3 text-base leading-[1.75] break-keep text-fg-muted md:mt-3.5 md:text-[17px]">
            {site.description}
          </p>
        </div>
        <div className="mt-6 md:mt-0">
          <PublishGrass counts={getPublishGrass(GRASS_WEEKS)} />
        </div>
      </section>

      <div className="mt-12 flex flex-col gap-12 md:mt-[88px] md:gap-[72px]">
        {groups.map(({ year, posts }) => (
          <section key={year} aria-labelledby={`year-${year}`}>
            <h2
              id={`year-${year}`}
              className="font-mono text-xs font-medium tracking-[0.04em] text-fg-muted md:text-[13px]"
            >
              {year}
            </h2>
            <ul className="mt-2 md:mt-3">
              {posts.map((post) => (
                <PostListItem
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
        ))}
      </div>
    </>
  );
}
