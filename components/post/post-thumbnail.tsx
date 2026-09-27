import type { ThumbTone } from "@/lib/posts";

const TONE_CLASS = {
  deep: "bg-thumb-deep-bg text-thumb-deep-fg",
  moss: "bg-thumb-moss-bg text-thumb-moss-fg",
  pale: "bg-thumb-pale-bg text-thumb-pale-fg",
} satisfies Record<ThumbTone, string>;

const SIZE_CLASS = {
  md: "h-[70px] w-[104px] rounded px-2.5 py-[9px] md:h-40 md:w-60 md:rounded-md md:px-5 md:py-[18px]",
  sm: "h-[70px] w-[104px] rounded px-2.5 py-[9px] md:h-20 md:w-[120px] md:px-3 md:py-2.5",
} satisfies Record<string, string>;

const KEYWORD_CLASS = {
  md: "md:text-[22px] md:leading-[1.35]",
  sm: "md:text-sm",
} satisfies Record<keyof typeof SIZE_CLASS, string>;

type PostThumbnailProps = {
  label: string;
  keyword: string;
  tone: ThumbTone;
  size?: keyof typeof SIZE_CLASS;
  caption?: string;
};

// 번호, 키워드, 아래 캡션으로 만든 장식용 썸네일을 크기별로 렌더링함
export function PostThumbnail({
  label,
  keyword,
  tone,
  size = "md",
  caption = "grxxn.log",
}: PostThumbnailProps) {
  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 flex-col justify-between ${SIZE_CLASS[size]} ${TONE_CLASS[tone]}`}
    >
      <span className="font-mono text-[11px] tracking-[0.04em]">{label}</span>
      <span
        className={`text-xs leading-[1.3] font-medium break-keep ${KEYWORD_CLASS[size]}`}
      >
        {keyword}
      </span>
      {size === "md" && (
        <span className="hidden font-mono text-[11px] md:block">{caption}</span>
      )}
    </div>
  );
}
