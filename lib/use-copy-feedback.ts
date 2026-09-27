import { useEffect, useState } from "react";

const FEEDBACK_MS = 2000;

// 텍스트를 클립보드에 복사하고 잠시 완료 상태를 유지함
export function useCopyFeedback() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), FEEDBACK_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  // 클립보드 쓰기에 성공했을 때만 완료 상태로 바꿈
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {}
  };

  return { copied, copy };
}
