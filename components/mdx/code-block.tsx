import {
  Children,
  isValidElement,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";
import { CopyCodeButton } from "./copy-code-button";

type CodeTitleElement = ReactElement<{ children?: ReactNode }>;

// rehype-pretty-code가 만든 파일명 캡션 요소인지 확인함
const isCodeTitle = (node: ReactNode): node is CodeTitleElement =>
  isValidElement<Record<string, unknown>>(node) &&
  "data-rehype-pretty-code-title" in node.props;

type CodeBlockProps = ComponentProps<"figure">;

// 코드 블록을 파일명 바와 복사 버튼이 있는 형태로 렌더링함
export function CodeBlock({ children, ...props }: CodeBlockProps) {
  if (!("data-rehype-pretty-code-figure" in props)) {
    return <figure {...props}>{children}</figure>;
  }

  const nodes = Children.toArray(children);
  const title = nodes.find(isCodeTitle);
  const code = nodes.filter((node) => !isCodeTitle(node));

  return (
    <figure
      {...props}
      className="not-prose relative mb-6 rounded-md bg-bg-subtle md:mb-7"
    >
      {title ? (
        <div className="flex items-center justify-between gap-4 border-b border-border py-1.5 pr-2 pl-4 md:py-2.5 md:pr-4 md:pl-6">
          <figcaption className="min-w-0 truncate font-mono text-xs text-fg-muted">
            {title.props.children}
          </figcaption>
          <CopyCodeButton />
        </div>
      ) : (
        <div className="absolute top-3 right-3">
          <CopyCodeButton />
        </div>
      )}
      {code}
    </figure>
  );
}
