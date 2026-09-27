import type { WorkExample as WorkExampleData } from "@/content/about";
import { TextLink } from "@/components/ui/text-link";
import { WorkExample } from "./work-example";

type WorkAccordionProps = {
  title: string;
  summary: string;
  examples: WorkExampleData[];
  reasons: string[];
  related: { title: string; href: string } | undefined;
  defaultOpen?: boolean;
};

// 같은 name으로 한 번에 하나만 열리는 일하는 방식 아코디언 항목을 렌더링함
export function WorkAccordion({
  title,
  summary,
  examples,
  reasons,
  related,
  defaultOpen = false,
}: WorkAccordionProps) {
  return (
    <details
      name="work"
      open={defaultOpen}
      className="group border-t border-border last:border-b"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 hover:text-accent md:py-7 [&::-webkit-details-marker]:hidden">
        <h3 className="text-[17px] leading-[1.5] font-medium break-keep md:text-xl">
          {title}
        </h3>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="size-5 shrink-0 text-fg-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 10h14" />
          <path d="M10 3v14" className="group-open:hidden" />
        </svg>
      </summary>
      <div className="flex max-w-[760px] flex-col gap-[22px] pb-8 md:gap-7 md:pb-11">
        <p className="text-base leading-[1.75] break-keep md:text-[17px] md:leading-[1.8]">
          {summary}
        </p>
        {examples.map((example, i) => (
          <WorkExample key={i} example={example} />
        ))}
        {reasons.map((reason) => (
          <p
            key={reason}
            className="text-[15px] leading-[1.8] break-keep text-fg-muted md:text-base"
          >
            {reason}
          </p>
        ))}
        {related && (
          <p className="text-[15px] break-keep">
            <span className="text-fg-muted">관련 글 · </span>
            <TextLink href={related.href}>{related.title} →</TextLink>
          </p>
        )}
      </div>
    </details>
  );
}
