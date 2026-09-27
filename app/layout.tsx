import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans_KR } from "next/font/google";
import { InlineScript } from "@/components/layout/inline-script";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { createAlternates, createOpenGraph } from "@/lib/metadata";
import { site } from "@/lib/site";
import { themeScript } from "@/lib/theme";
import "./globals.css";

const plexSans = IBM_Plex_Sans_KR({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  alternates: createAlternates("/"),
  openGraph: createOpenGraph({ type: "website" }),
  twitter: { card: "summary_large_image" },
};

// 서체, 테마 초기화 스크립트, 헤더/푸터, 방문·성능 측정을 포함한 공통 레이아웃을 렌더링함
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${plexSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <InlineScript html={themeScript} />
      </head>
      <body>
        <div className="container-content pt-6 md:pt-14">
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
