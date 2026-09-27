import Link from "next/link";
import type { ReactNode } from "react";

type TextLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

// 내부 경로는 next/link로, 외부 주소는 a 태그로 밑줄 링크를 렌더링함
export function TextLink({ href, children, className = "" }: TextLinkProps) {
  const classes = `text-link ${className}`;
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={classes}>
      {children}
    </a>
  );
}
