type JsonLdProps = {
  data: Record<string, unknown>;
};

// 검색 엔진용 구조화 데이터를 script 태그로 렌더링함
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
