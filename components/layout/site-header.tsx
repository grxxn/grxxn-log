import Link from "next/link";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme-toggle";

// 로고와 테마 토글, 주요 메뉴가 있는 사이트 헤더를 렌더링함
export function SiteHeader() {
  return (
    <header className="flex h-11 items-center justify-between">
      <Link
        href="/"
        className="inline-flex h-11 items-center font-mono text-[17px] font-medium"
      >
        grxxn<span className="text-accent">.log</span>
      </Link>
      <nav aria-label="주요 메뉴" className="flex items-center md:gap-5">
        <ThemeToggle />
        <div className="flex items-center md:gap-9">
          <NavLink href="/" prefix="/posts/">
            글
          </NavLink>
          <NavLink href="/about" prefix="/about/">
            소개
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
