import type { ReactNode } from "react";
import * as runtime from "react/jsx-runtime";
import { mdxComponents, type MDXComponents } from "./mdx-components";

type MDXModule = {
  default: (props: { components: MDXComponents }) => ReactNode;
};

// 실행 결과가 MDX 모듈 형태인지 확인함
const isMDXModule = (value: unknown): value is MDXModule =>
  typeof value === "object" &&
  value !== null &&
  "default" in value &&
  typeof value.default === "function";

// 컴파일된 MDX 코드 문자열을 실행해 본문 렌더 함수를 꺼냄
const getMDXRenderer = (code: string) => {
  const mod: unknown = new Function(code)({ ...runtime });
  if (!isMDXModule(mod)) throw new Error("MDX 코드를 실행할 수 없습니다.");
  return mod.default;
};

type MDXContentProps = {
  code: string;
};

// MDX 본문을 커스텀 컴포넌트와 함께 렌더링함
export function MDXContent({ code }: MDXContentProps) {
  const render = getMDXRenderer(code);
  return render({ components: mdxComponents });
}
