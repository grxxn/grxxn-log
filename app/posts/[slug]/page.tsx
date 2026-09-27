import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXContent } from "@/components/mdx/mdx-content";
import { getPostBySlug, getPosts } from "@/lib/posts";

// 발행된 모든 글의 slug로 정적 경로를 만듦
export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

// 글 제목과 요약으로 페이지 메타데이터를 만듦
export async function generateMetadata({
  params,
}: PageProps<"/posts/[slug]">): Promise<Metadata> {
  const post = getPostBySlug((await params).slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}

// 글 제목과 본문을 렌더링함
export default async function PostPage({ params }: PageProps<"/posts/[slug]">) {
  const post = getPostBySlug((await params).slug);
  if (!post) notFound();

  return (
    <article className="pt-10 md:pt-24">
      <h1 className="text-[28px] leading-[1.4] font-semibold tracking-[-0.01em] break-keep md:text-[40px] md:leading-[1.35]">
        {post.title}
      </h1>
      <div className="prose mt-9 max-w-[680px] break-keep md:mt-14">
        <MDXContent code={post.body} />
      </div>
    </article>
  );
}
