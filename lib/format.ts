// ISO 날짜 문자열을 2026.09.25 형식으로 바꿈
export const formatDate = (isoDate: string) =>
  isoDate.slice(0, 10).replaceAll("-", ".");
