import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXContent } from "@/components/mdx/mdx-content";
import { Comments } from "@/components/post/comments";
import { OtherPosts } from "@/components/post/other-posts";
import { PostActions } from "@/components/post/post-actions";
import { PostHeader } from "@/components/post/post-header";
import { PostNav } from "@/components/post/post-nav";
import { Toc } from "@/components/post/toc";
import { JsonLd } from "@/components/ui/json-ld";
import { createBlogPostingJsonLd } from "@/lib/json-ld";
import { createAlternates, createOpenGraph } from "@/lib/metadata";
import {
  getOtherPosts,
  getPostBySlug,
  getPostDetail,
  getPosts,
} from "@/lib/posts";

// 발행된 모든 글의 slug로 정적 경로를 만듦
export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

// 글 제목, 요약, 날짜, 태그로 검색·공유용 메타데이터를 만듦
export async function generateMetadata({
  params,
}: PageProps<"/posts/[slug]">): Promise<Metadata> {
  const post = getPostBySlug((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: createAlternates(post.permalink),
    openGraph: createOpenGraph({
      type: "article",
      title: post.title,
      description: post.description,
      url: post.permalink,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      tags: post.tags,
    }),
  };
}

// 제목 영역, 본문과 목차, 수정 제안, 이전/다음 글, 댓글, 다른 글이 있는 글 상세 페이지를 렌더링함
export default async function PostPage({ params }: PageProps<"/posts/[slug]">) {
  const detail = getPostDetail((await params).slug);
  if (!detail) notFound();
  const { post, prev, next, series, editUrl } = detail;

  return (
    <article>
      <JsonLd data={createBlogPostingJsonLd(post)} />
      <PostHeader
        no={post.no}
        date={post.date}
        readingTime={post.metadata.readingTime}
        title={post.title}
        series={series}
        tags={post.tags}
      />
      <div className="mt-8 border-t border-border pt-9 md:mt-12 md:pt-14 lg:grid lg:grid-cols-[680px_152px] lg:gap-12">
        <div className="prose max-w-[680px] break-keep">
          <MDXContent code={post.body} />
        </div>
        <aside className="hidden lg:block">
          <Toc items={post.toc} />
        </aside>
      </div>
      <PostActions editUrl={editUrl} />
      <PostNav prev={prev} next={next} />
      <Comments key={post.slug} />
      <OtherPosts posts={getOtherPosts(post.slug)} />
    </article>
  );
}
