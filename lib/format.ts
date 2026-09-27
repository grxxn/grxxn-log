// ISO 날짜 문자열을 2026.09.25 형식으로 바꿈
export const formatDate = (isoDate: string) =>
  isoDate.slice(0, 10).replaceAll("-", ".");

// 읽기 시간(분)을 최소 1분인 "N분" 형식으로 바꿈
export const formatReadingTime = (minutes: number) =>
  `${Math.max(1, Math.round(minutes))}분`;
