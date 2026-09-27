import { posts, type Post } from "#site/content";
import { site } from "./site";

export type { Post };

export type ThumbTone = "deep" | "moss" | "pale";

const TONES = ["deep", "moss", "pale"] as const satisfies ThumbTone[];

const DAY_MS = 24 * 60 * 60 * 1000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

// 개발 환경이 아니면 초안 글을 제외함
const isPublished = (post: Post) =>
  process.env.NODE_ENV === "development" || !post.draft;

// 발행된 글을 최신순으로 반환함
export const getPosts = () =>
  posts
    .filter(isPublished)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

// slug로 글 하나를 찾음
export const getPostBySlug = (slug: string) =>
  getPosts().find((post) => post.slug === slug);

// 1부터 시작하는 번호에 맞춰 썸네일 톤을 deep → moss → pale 순서로 고름
export const getThumbTone = (no: number): ThumbTone =>
  TONES[(no - 1) % TONES.length] ?? "deep";

// 번호를 두 자리 문자열로 바꿈
export const formatThumbNo = (no: number) => String(no).padStart(2, "0");

// 오래된 글부터 1번으로 매긴 번호와 썸네일 톤을 붙임
export const withThumbMeta = <T>(list: T[]) =>
  list.map((post, i) => {
    const no = list.length - i;
    return { ...post, no: formatThumbNo(no), tone: getThumbTone(no) };
  });

// 글 상세에 필요한 번호, 이전/다음 글, 시리즈 순서, 수정 제안 주소를 함께 찾음
export const getPostDetail = (slug: string) => {
  const list = withThumbMeta(getPosts());
  const index = list.findIndex((post) => post.slug === slug);
  const post = list[index];
  if (!post) return undefined;

  const seriesPosts = post.series
    ? list.filter((item) => item.series === post.series).reverse()
    : [];
  const series = post.series
    ? {
        name: post.series,
        index: seriesPosts.findIndex((item) => item.slug === slug) + 1,
        total: seriesPosts.length,
      }
    : undefined;

  return {
    post,
    prev: list[index + 1],
    next: list[index - 1],
    series,
    editUrl: `${site.repo.url}/edit/${site.repo.branch}/content/${post.path}/index.mdx`,
  };
};

// 현재 글을 뺀 나머지 글을 최신순으로, 목록과 같은 번호와 톤을 붙여 반환함
export const getOtherPosts = (slug: string) =>
  withThumbMeta(getPosts()).filter((post) => post.slug !== slug);

// 글을 연도별로 묶음
export const groupByYear = <T extends { date: string }>(list: T[]) => {
  const groups = new Map<string, T[]>();
  for (const post of list) {
    const year = post.date.slice(0, 4);
    groups.set(year, [...(groups.get(year) ?? []), post]);
  }
  return [...groups].map(([year, items]) => ({ year, posts: items }));
};

// 날짜 문자열을 1970-01-01부터 센 일 수로 바꿈
const toDayNumber = (isoDate: string) =>
  Math.floor(Date.parse(isoDate.slice(0, 10)) / DAY_MS);

// 그 날이 속한 주의 월요일을 일 수로 반환함
const toWeekStart = (day: number) => day - ((day + 3) % 7);

// 최근 N주 동안 주별 발행 수를 오래된 주부터 반환함
export const getPublishGrass = (weeks: number) => {
  const today = Math.floor((Date.now() + KST_OFFSET_MS) / DAY_MS);
  const firstWeek = toWeekStart(today) - (weeks - 1) * 7;
  const counts = Array.from({ length: weeks }, () => 0);

  for (const post of getPosts()) {
    const index = (toWeekStart(toDayNumber(post.date)) - firstWeek) / 7;
    if (index >= 0 && index < weeks) counts[index] = (counts[index] ?? 0) + 1;
  }
  return counts;
};
