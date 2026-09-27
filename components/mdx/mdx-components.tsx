import type { ElementType } from "react";
import { CodeBlock } from "./code-block";
import { Memo } from "./memo";

export type MDXComponents = Record<string, ElementType>;

export const mdxComponents = {
  figure: CodeBlock,
  Memo,
} satisfies MDXComponents;
