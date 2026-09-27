"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavLinkProps = {
  href: string;
  prefix?: string;
  children: ReactNode;
};

// 현재 경로와 일치하면 활성 상태로 표시되는 헤더 메뉴 링크를 렌더링함
export function NavLink({ href, prefix, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (prefix !== undefined && pathname.startsWith(prefix));

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`inline-flex min-h-11 items-center px-2.5 text-[15px] md:px-0 ${
        isActive ? "text-fg" : "text-fg-muted"
      }`}
    >
      <span
        className={`border-b-2 pb-1 ${
          isActive ? "border-accent" : "border-transparent"
        }`}
      >
        {children}
      </span>
    </Link>
  );
}
