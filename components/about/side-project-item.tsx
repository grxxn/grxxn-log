import { PostThumbnail } from "@/components/post/post-thumbnail";
import { TextLink } from "@/components/ui/text-link";
import type { ThumbTone } from "@/lib/posts";

type SideProjectItemProps = {
  no: string;
  tone: ThumbTone;
  name: string;
  period: string;
  thumb: string;
  description: string;
  stack: string[];
  links: { label: string; href: string }[];
};

// 썸네일, 기간, 이름, 설명, 링크로 된 가로형 사이드 프로젝트 항목을 렌더링함
export function SideProjectItem({
  no,
  tone,
  name,
  period,
  thumb,
  description,
  stack,
  links,
}: SideProjectItemProps) {
  return (
    <li className="flex items-start gap-[18px] border-t border-border py-6 md:items-center md:gap-11 md:py-9">
      <PostThumbnail
        label={`P.${no}`}
        keyword={thumb}
        tone={tone}
        caption={stack.join(" · ")}
      />
      <div className="min-w-0">
        <p className="font-mono text-xs text-fg-muted md:text-[13px]">
          {period}
        </p>
        <h3 className="mt-1.5 text-[17px] leading-[1.6] font-medium break-keep md:mt-2.5 md:text-[22px] md:leading-[1.55]">
          {name}
        </h3>
        <p className="mt-1.5 text-[15px] leading-[1.75] break-keep text-fg-muted md:mt-2.5 md:text-base">
          {description}
        </p>
        <ul className="mt-2 flex flex-wrap gap-4 text-sm md:mt-3.5 md:gap-5">
          {links.map((link) => (
            <li key={link.href}>
              <TextLink href={link.href} className="inline-block py-1 md:py-0">
                {link.label}
              </TextLink>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
