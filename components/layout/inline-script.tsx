"use client";

type InlineScriptProps = {
  html: string;
};

// 서버 HTML에서만 실행되고 클라이언트 렌더링에서는 비활성화되는 인라인 스크립트를 렌더링함
export function InlineScript({ html }: InlineScriptProps) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
