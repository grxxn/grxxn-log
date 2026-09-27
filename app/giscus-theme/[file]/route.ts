import { GISCUS_ORIGIN } from "@/lib/giscus";
import { buildGiscusThemeCss, parseGiscusThemeFile } from "@/lib/giscus-theme";

export const dynamicParams = false;

// 라이트/다크 테마 CSS 파일을 빌드 시점에 만듦
export function generateStaticParams() {
  return [{ file: "light.css" }, { file: "dark.css" }];
}

// giscus iframe이 교차 출처로 읽을 수 있게 CORS 헤더와 함께 테마 CSS를 반환함
export async function GET(
  _request: Request,
  { params }: RouteContext<"/giscus-theme/[file]">,
) {
  const theme = parseGiscusThemeFile((await params).file);
  if (!theme) return new Response(null, { status: 404 });

  return new Response(buildGiscusThemeCss(theme), {
    headers: {
      "Content-Type": "text/css; charset=utf-8",
      "Access-Control-Allow-Origin": GISCUS_ORIGIN,
    },
  });
}
