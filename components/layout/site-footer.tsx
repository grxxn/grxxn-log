import { site } from "@/lib/site";

// 저작권 표기와 GitHub, RSS 링크가 있는 사이트 푸터를 렌더링함
export function SiteFooter() {
  return (
    <footer className="mt-20 flex items-center justify-between border-t border-border pt-8 pb-10 text-[13px] leading-[1.7] md:mt-[117px] md:pb-16">
      <p className="font-mono">© 2026 {site.author.name}</p>
      <ul className="flex gap-5 text-fg-muted">
        <li>
          <a href={`https://github.com/${site.author.github}`}>GitHub</a>
        </li>
        <li>
          <a href="/feed.xml">RSS</a>
        </li>
      </ul>
    </footer>
  );
}
