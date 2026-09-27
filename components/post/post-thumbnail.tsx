import type { ThumbTone } from "@/lib/posts";

const TONE_CLASS = {
  deep: "bg-thumb-deep-bg text-thumb-deep-fg",
  moss: "bg-thumb-moss-bg text-thumb-moss-fg",
  pale: "bg-thumb-pale-bg text-thumb-pale-fg",
} satisfies Record<ThumbTone, string>;

type PostThumbnailProps = {
  label: string;
  keyword: string;
  tone: ThumbTone;
  caption?: string;
};

// 번호, 키워드, 아래 캡션으로 만든 장식용 썸네일을 렌더링함
export function PostThumbnail({
  label,
  keyword,
  tone,
  caption = "grxxn.log",
}: PostThumbnailProps) {
  return (
    <div
      aria-hidden="true"
      className={`flex h-[70px] w-[104px] shrink-0 flex-col justify-between rounded px-2.5 py-[9px] md:h-40 md:w-60 md:rounded-md md:px-5 md:py-[18px] ${TONE_CLASS[tone]}`}
    >
      <span className="font-mono text-[11px] tracking-[0.04em]">{label}</span>
      <span className="text-xs leading-[1.3] font-medium break-keep md:text-[22px] md:leading-[1.35]">
        {keyword}
      </span>
      <span className="hidden font-mono text-[11px] md:block">{caption}</span>
    </div>
  );
}
