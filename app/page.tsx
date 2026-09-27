import { site } from "@/lib/site";

// 글 목록 페이지를 렌더링함
export default function Home() {
  return (
    <section className="pt-14 md:pt-28">
      <h1 className="text-[32px] leading-[1.3] font-semibold break-keep md:text-[40px] md:tracking-[-0.01em]">
        글
      </h1>
      <p className="mt-3 text-base leading-[1.75] break-keep text-fg-muted md:text-[17px]">
        {site.description}
      </p>
    </section>
  );
}
