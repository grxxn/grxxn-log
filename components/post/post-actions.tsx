import { TextLink } from "@/components/ui/text-link";
import { CopyLinkButton } from "./copy-link-button";

type PostActionsProps = {
  editUrl: string;
};

// GitHub 수정 제안 링크와 링크 복사 버튼 줄을 렌더링함
export function PostActions({ editUrl }: PostActionsProps) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4 md:mt-12 md:pt-6">
      <TextLink
        href={editUrl}
        className="inline-flex min-h-11 items-center text-sm md:min-h-0"
      >
        GitHub에서 수정 제안하기
      </TextLink>
      <CopyLinkButton />
    </div>
  );
}
