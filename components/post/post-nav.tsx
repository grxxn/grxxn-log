import Link from "next/link";

type NavPost = {
  title: string;
  permalink: string;
};

type PostNavProps = {
  prev: NavPost | undefined;
  next: NavPost | undefined;
};

type PostNavLinkProps = {
  post: NavPost;
  label: string;
  align: "start" | "end";
};

// 이전 글과 다음 글로 이동하는 링크를 렌더링함
export function PostNav({ prev, next }: PostNavProps) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="이전 글과 다음 글"
      className="mt-8 border-b border-border md:mt-12 md:grid md:grid-cols-2 md:gap-10 md:border-b-0"
    >
      {prev ? (
        <PostNavLink post={prev} label="← 이전 글" align="start" />
      ) : (
        <div className="hidden border-t border-border md:block" />
      )}
      {next ? (
        <PostNavLink post={next} label="다음 글 →" align="end" />
      ) : (
        <div className="hidden border-t border-border md:block" />
      )}
    </nav>
  );
}

// 라벨과 제목으로 된 이전/다음 글 링크 한 칸을 렌더링함
function PostNavLink({ post, label, align }: PostNavLinkProps) {
  return (
    <Link
      href={post.permalink}
      className={`group block border-t border-border py-5 md:py-6 ${
        align === "end" ? "md:text-right" : ""
      }`}
    >
      <span className="block text-[13px] text-fg-muted">{label}</span>
      <span className="mt-1.5 block text-base leading-[1.6] font-medium break-keep group-hover:text-accent md:text-[17px]">
        {post.title}
      </span>
    </Link>
  );
}
