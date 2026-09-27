# 개인 블로그 프로젝트 세팅 가이드

Next.js(App Router) + TypeScript + Velite(MDX) + Tailwind CSS v4 기반 grxxn.log 세팅 순서.
각 단계는 "완료 조건"을 만족하면 커밋하고 다음 단계로 넘어간다.
화면 관련 값은 모두 DESIGN.md가 기준이다.

---

## 기술 스택 요약

| 영역 | 선택 | 선택 이유 |
|---|---|---|
| 프레임워크 | Next.js 16 (App Router, 최신 안정 패치) | RSC 경험, 채용 시장 수요, SSG로 블로그에 적합 |
| 언어 | TypeScript (strict) | 타입 안정성, 엄격한 설정 자체가 어필 포인트 |
| 콘텐츠 | Velite + MDX | Zod 스키마 기반 타입/검증, 빌드 타임 컴파일, Contentlayer 대체재 |
| 코드 하이라이팅 | rehype-pretty-code (Shiki) | 빌드 타임 하이라이팅, 런타임 JS 0 |
| 스타일 | Tailwind CSS v4 + CSS 변수 디자인 토큰 | CSS-first `@theme`, 3계층 토큰 구조 |
| 서체 | IBM Plex Sans KR + IBM Plex Mono (next/font/google) | 흔하지 않은 한글 서체 + 고정폭 메타 정보의 대비 |
| 다크모드 | 인라인 스크립트 + `useSyncExternalStore` (직접 구현) | FOUC 없는 테마 전환, 의존성 없음 |
| 댓글 | giscus | GitHub Discussions 기반, 개발 블로그에 적합 |
| 배포 | Vercel | Next.js 기능 무설정 지원, PR 프리뷰 |
| CI | GitHub Actions + Lighthouse CI | 타입/빌드/성능 회귀 방지 |
| 의존성 관리 | pnpm + Renovate | 보안 패치 자동 추적 |

> Next.js는 보안 릴리스가 정기적으로 나온다. 시작 전 https://nextjs.org/blog 에서 현재 안정(Active LTS) 버전을 확인할 것.

---

## Step 1. 프로젝트 생성 ✅

```bash
pnpm create next-app@latest grxxn-log \
  --typescript --tailwind --eslint --app --no-src-dir \
  --import-alias "@/*"
cd grxxn-log
```

`CLAUDE.md`, `SETUP.md`, `PROJECT.md`, `DESIGN.md`를 루트에 둔다.
Next.js가 생성한 `CLAUDE.md`/`AGENTS.md` 관리 블록이 있다면 지우지 않고 유지한다.

### 디렉터리 구조

```
app/
  layout.tsx                # 폰트, 테마 스크립트, 헤더/푸터
  page.tsx                  # 글 목록 (홈 = 글 목록)
  not-found.tsx             # 404
  about/page.tsx            # 소개
  posts/[slug]/page.tsx     # 글 상세
  tags/[tag]/page.tsx       # 태그별 목록
  feed.xml/route.ts         # RSS
  sitemap.ts
  robots.ts
  opengraph-image.tsx
components/
  layout/                   # site-header, site-footer, theme-toggle
  post/                     # post-list-item, post-thumbnail, publish-grass, toc, post-nav, comments
  about/                    # career-item, work-accordion
  mdx/                      # Callout, CodeTabs 등
  ui/                       # 범용 UI
lib/
  posts.ts                  # 포스트 조회/정렬/그룹/잔디 데이터
  site.ts                   # 사이트 메타 정보
content/
  posts/<slug>/index.mdx
styles/
  tokens.css                # 디자인 토큰
```

**완료 조건:** `pnpm dev`로 기본 페이지가 뜬다.

---

## Step 2. TypeScript 엄격 설정 ✅

`tsconfig.json`의 `compilerOptions`에 추가:

```jsonc
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true,
  "noImplicitOverride": true,
  "noFallthroughCasesInSwitch": true,
  "paths": {
    "@/*": ["./*"],
    "#site/content": ["./.velite"]
  }
}
```

`package.json` 스크립트에 `"typecheck": "tsc --noEmit"` 추가.

```ts
// lib/site.ts
type SiteConfig = {
  name: string
  url: string
  description: string
  author: { name: string; github: string; email: string }
}

export const site = {
  name: 'grxxn.log',
  url: 'https://grxxn.dev',
  description: '만들고, 배우고, 기록합니다.',
  author: { name: 'grxxn', github: '[GitHub 아이디]', email: '[이메일]' },
} satisfies SiteConfig
```

**완료 조건:** `pnpm typecheck` 통과.

---

## Step 3. 디자인 토큰 + 서체 + 공통 레이아웃 ✅

값은 DESIGN.md 2~4장을 그대로 옮긴다.

### 토큰

```css
/* styles/tokens.css */

:root {
  --moss-0: #f6f7f2;
  --moss-50: #e9eee4;
  --moss-100: #e1e6dc;
  --moss-150: #dde2d8;
  --moss-200: #c9d3c3;
  --moss-500: #6b786e;
  --moss-600: #5e6b61;
  --moss-900: #1b211c;

  --green-50: #eef3ea;
  --green-100: #e6ece0;
  --green-200: #cfe0c6;
  --green-300: #a9c6a0;
  --green-600: #2f6b3f;
  --green-700: #2f5a3a;
  --green-750: #1f4a2b;
  --green-800: #23472e;
  --green-900: #1e3a26;
}

:root {
  --color-bg: var(--moss-0);
  --color-bg-subtle: var(--moss-50);
  --color-fg: var(--moss-900);
  --color-fg-muted: var(--moss-600);
  --color-fg-subtle: var(--moss-500);
  --color-border: var(--moss-150);
  --color-border-strong: var(--moss-200);
  --color-accent: var(--green-600);
  --color-accent-hover: var(--green-750);
  --color-grass-0: var(--moss-100);
  --color-grass-1: var(--green-300);
  --color-grass-2: var(--green-600);

  --color-thumb-deep-bg: var(--green-800);
  --color-thumb-deep-fg: var(--green-50);
  --color-thumb-moss-bg: var(--green-200);
  --color-thumb-moss-fg: var(--green-900);
  --color-thumb-pale-bg: var(--green-100);
  --color-thumb-pale-fg: var(--green-700);
}

[data-theme='dark'] {
  --color-bg: #141a15;
  --color-bg-subtle: #1d251f;
  --color-fg: #e6ece0;
  --color-fg-muted: #9aa89d;
  --color-fg-subtle: #7e8c81;
  --color-border: #2a342c;
  --color-border-strong: #36423a;
  --color-accent: #7fb88c;
  --color-accent-hover: #9acba5;
  --color-grass-0: #232c25;
  --color-grass-1: #3e6b48;
  --color-grass-2: #7fb88c;
}
```

다크모드 값은 글 목록 다크, 소개 다크 시안 기준이다.

```css
/* app/globals.css */
@import 'tailwindcss';
@import '../styles/tokens.css';
@plugin '@tailwindcss/typography';

@custom-variant dark (&:where([data-theme='dark'], [data-theme='dark'] *));

@theme inline {
  --color-bg: var(--color-bg);
  --color-bg-subtle: var(--color-bg-subtle);
  --color-fg: var(--color-fg);
  --color-fg-muted: var(--color-fg-muted);
  --color-fg-subtle: var(--color-fg-subtle);
  --color-border: var(--color-border);
  --color-border-strong: var(--color-border-strong);
  --color-accent: var(--color-accent);
  --color-accent-hover: var(--color-accent-hover);
  --color-grass-0: var(--color-grass-0);
  --color-grass-1: var(--color-grass-1);
  --color-grass-2: var(--color-grass-2);
  --font-sans: var(--font-plex-sans), system-ui, sans-serif;
  --font-mono: var(--font-plex-mono), ui-monospace, monospace;
}

body {
  @apply bg-bg text-fg font-sans antialiased;
}
```

### 서체

```tsx
// app/layout.tsx (일부)
import { IBM_Plex_Sans_KR, IBM_Plex_Mono } from 'next/font/google'

const plexSans = IBM_Plex_Sans_KR({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-plex-sans',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-plex-mono',
  display: 'swap',
})
```

한글 글리프는 unicode-range로 필요할 때 로드된다. 옵션이 버전에 따라 다를 수 있으니 공식 문서로 확인한다.

### 테마

```bash
pnpm add -D @tailwindcss/typography
```

next-themes 대신 Next.js 공식 가이드(`preventing-flash-before-hydration`)의 패턴으로 직접 구현한다. next-themes 0.4.6은 클라이언트 컴포넌트 안에서 `<script>`를 렌더링해 React 19 dev 환경에서 경고가 나고, 필요한 코드도 짧기 때문이다.

- `lib/theme.ts`: 저장 키, 시스템 설정 쿼리, `<head>`에 넣는 인라인 스크립트 (localStorage → 없으면 `prefers-color-scheme`으로 `<html data-theme>` 설정)
- `app/layout.tsx`: `<html suppressHydrationWarning>` + `<head>`에 인라인 스크립트
- `components/layout/theme-toggle.tsx` (클라이언트 컴포넌트): `useSyncExternalStore`로 `data-theme`을 구독하는 44×44px 아이콘 버튼, 라이트는 달/다크는 해 아이콘, 상태에 맞는 `aria-label`. 서버 스냅샷은 `null`이라 마운트 전에는 아이콘 자리만 비워 hydration 불일치를 막는다. 저장된 선택이 없으면 시스템 설정 변경을 따라간다

### 공통 레이아웃

- `components/layout/site-header.tsx`: 로고 + [테마 토글, `글`, `소개`], 현재 경로에 `aria-current="page"` (`/`와 `/posts/*`는 `글`) (DESIGN.md 5장 헤더)
- `components/layout/site-footer.tsx`: `© 2026 grxxn` + `GitHub`/`RSS`. 마지막 콘텐츠와의 간격 데스크톱 117px, 모바일 80px 고정 (DESIGN.md 5장 푸터)
- 콘텐츠 폭 880px 컨테이너, 모바일 좌우 24px

**완료 조건:** 빈 페이지에 헤더/푸터가 시안과 같은 간격으로 보이고, 토글과 시스템 설정 모두에서 깜빡임 없이 라이트/다크가 바뀐다.

---

## Step 4. Velite + 글 목록 페이지 → 첫 배포

```bash
pnpm add -D velite concurrently rehype-pretty-code shiki rehype-slug rehype-autolink-headings remark-gfm
```

```ts
// velite.config.ts
import { defineConfig, defineCollection, s } from 'velite'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'

const posts = defineCollection({
  name: 'Post',
  pattern: 'posts/**/index.mdx',
  schema: s
    .object({
      title: s.string().max(99),
      slug: s.slug('posts'),
      date: s.isodate(),
      updated: s.isodate().optional(),
      description: s.string().max(200),
      thumb: s.string().max(24),
      tags: s.array(s.string()).default([]),
      series: s.string().optional(),
      draft: s.boolean().default(false),
      toc: s.toc(),
      metadata: s.metadata(),
      body: s.mdx(),
    })
    .transform((data) => ({ ...data, permalink: `/posts/${data.slug}` })),
})

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { posts },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: { light: 'github-light', dark: 'github-dark' } }],
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
})
```

- `thumb`: 썸네일 가운데에 들어갈 키워드 (예: `Velite`, `Design Tokens`)
- 썸네일 번호(`No.06`)와 톤은 날짜순 번호로 계산한다. 프론트매터에 넣지 않는다.

`package.json` 스크립트:

```json
{
  "scripts": {
    "dev": "concurrently -k \"velite dev\" \"next dev\"",
    "build": "velite build && next build",
    "content": "velite build",
    "typecheck": "tsc --noEmit",
    "lint": "eslint ."
  }
}
```

`.gitignore`에 `.velite`, `public/static` 추가.

### MDX 렌더러

```tsx
// components/mdx/mdx-content.tsx
import * as runtime from 'react/jsx-runtime'
import { mdxComponents } from './mdx-components'

// 컴파일된 MDX 코드 문자열을 React 컴포넌트로 변환함
const useMDXComponent = (code: string) => {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

// MDX 본문을 커스텀 컴포넌트와 함께 렌더링함
export function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code)
  return <Component components={mdxComponents} />
}
```

### 포스트 조회 유틸

```ts
// lib/posts.ts
import { posts } from '#site/content'

type Post = (typeof posts)[number]
export type ThumbTone = 'deep' | 'moss' | 'pale'

const TONES: ThumbTone[] = ['deep', 'moss', 'pale']

// 개발 환경이 아니면 초안 글을 제외함
const isPublished = (p: Post) => process.env.NODE_ENV === 'development' || !p.draft

// 발행된 글을 최신순으로 반환함
export const getPosts = () =>
  posts.filter(isPublished).sort((a, b) => +new Date(b.date) - +new Date(a.date))

// slug로 글 하나를 찾음
export const getPostBySlug = (slug: string) => getPosts().find((p) => p.slug === slug)

// 모든 글의 태그를 중복 없이 모음
export const getAllTags = () => [...new Set(getPosts().flatMap((p) => p.tags))]

// 오래된 글부터 1번으로 매긴 번호와 썸네일 톤을 붙임
export const withThumbMeta = (list: Post[]) => {
  const total = list.length
  return list.map((p, i) => {
    const no = total - i
    return { ...p, no: String(no).padStart(2, '0'), tone: TONES[(no - 1) % 3] ?? 'deep' }
  })
}

// 글을 연도별로 묶음
export const groupByYear = <T extends { date: string }>(list: T[]) => { /* ... */ }

// 최근 N주 동안 주별 발행 수를 0/1/2 단계로 계산함
export const getPublishGrass = (weeks: number) => { /* ... */ }
```

### 글 목록 페이지 (`/`)

DESIGN.md 5장의 "잔디", "글 목록 항목", "썸네일 템플릿"을 그대로 구현한다.

- `components/post/post-thumbnail.tsx`: 번호/키워드/톤을 받는 썸네일. OG 이미지와 소개 페이지에서도 재사용
- `components/post/post-list-item.tsx`: 가로형 항목 (항목 전체 링크, hover 시 제목만 `accent`)
- `components/post/publish-grass.tsx`: 데스크톱 30주 / 모바일 20주
- 연도별 그룹, 연도 라벨은 Mono
- 상세 페이지는 우선 제목과 본문만 렌더링하는 임시 버전 (`generateStaticParams`, 없는 slug는 `notFound()`)

**완료 조건:** 샘플 글 2~3개로 목록이 시안과 같은 간격으로 보이고, 프론트매터 누락 시 빌드가 실패한다. Vercel에 첫 배포.

---

## Step 5. 글 상세 페이지

DESIGN.md 6장 "글 상세"(데스크톱, 모바일, 다크)를 그대로 구현한다.

- [ ] 제목 영역: `← 글 목록`, 메타(번호·날짜·읽기 시간), 제목, 시리즈, 태그
- [ ] 본문 680px + 목차 152px 2열. 목차는 `lg:`(1024px) 이상에서만 표시
- [ ] 모바일(768px 미만): 제목 28px, 시리즈/태그 두 줄, 이전/다음 글 세로, 로그인 버튼 전체 폭, 코드 블록 가로 스크롤
- [ ] 목차(TOC): `post.toc` 사용, IntersectionObserver로 현재 섹션 하이라이트 (클라이언트 컴포넌트로 분리)
- [ ] 코드 블록: 복사 버튼, 파일명 표시(`title="file.ts"`), 라인 강조. 스타일은 DESIGN.md "코드 블록"
- [ ] MDX 커스텀 컴포넌트: `<Callout>`, `<CodeTabs>`, `<Demo>`
- [ ] 읽기 시간 (`post.metadata.readingTime`)
- [ ] 태그 페이지, 시리즈 이전/다음 글 네비게이션
- [ ] `GitHub에서 수정 제안하기` 링크 (저장소의 해당 MDX 편집 URL), `링크 복사` 버튼
- [ ] giscus 댓글: GitHub Discussions 활성화 → giscus 앱 설치 → 커스텀 테마 CSS로 라이트/다크 토큰 연동
- [ ] 하단 `다른 글`: 현재 글을 뺀 목록 4개씩 페이지네이션
- [ ] 이미지: 글 폴더에 함께 두고 `next/image`로 렌더링

---

## Step 6. 소개 페이지 (`/about`)

DESIGN.md 5장 "경력 블록", "아코디언"과 6장 "소개"를 그대로 구현한다.

- [ ] 인트로: 제목, 인사 문장(26px), 소개 문장, `이력서 PDF`/`GitHub`/`Email`
- [ ] 경력: `components/about/career-item.tsx`. 회사 프로젝트는 `<dl>`로 문제/한 일/결과
- [ ] 사이드 프로젝트: Step 4의 `post-thumbnail` 재사용
- [ ] 일하는 방식: `components/about/work-accordion.tsx`
  - `<details name="work">` + `<summary>`로 구현 (같은 name이면 한 번에 하나만 열림, JS 불필요)
  - 첫 항목(AI)만 `open`
  - `+`/`−` 아이콘은 `details[open]` 상태에 맞춰 CSS로 전환
- [ ] 경력, 프로젝트 데이터는 `content/about.ts` 같은 파일로 분리해서 페이지 코드와 섞지 않는다
- [ ] 모바일: 경력 1열, 토큰 다이어그램 세로, 코드 `pre-wrap` (DESIGN.md 6장 "소개 모바일")

---

## Step 6-1. 404 페이지

- [ ] `app/not-found.tsx`: 로그 한 줄 + 제목 + 설명 + 링크 + 최근 글 3개 (DESIGN.md 6장 "404")
- [ ] 로그 줄의 경로는 요청한 경로를 표시 (`usePathname` 클라이언트 컴포넌트로 분리)
- [ ] 모바일: 제목 32px, 긴 경로는 `break-all`로 줄바꿈 (DESIGN.md 6장 "404 모바일")

---

## Step 7. SEO

- [ ] `generateMetadata`로 글별 title/description/canonical/openGraph
- [ ] `opengraph-image.tsx`: DESIGN.md의 썸네일 템플릿 구성을 1200×630으로 (IBM Plex 폰트 파일 로드 필요)
- [ ] `app/sitemap.ts`, `app/robots.ts`
- [ ] `app/feed.xml/route.ts` RSS (푸터 RSS 링크와 연결)
- [ ] JSON-LD (`BlogPosting`) 구조화 데이터

---

## Step 8. 배포와 CI

### Vercel
1. GitHub 저장소 연결 → 자동 배포
2. 개인 도메인 연결 (`grxxn.dev` 후보)
3. Vercel Analytics + Speed Insights 활성화

### GitHub Actions ✅

- `.github/workflows/ci.yml`: PR과 `main` push에서 `pnpm install --frozen-lockfile` → `content` → `typecheck` → `lint` → `build` (Node 24, 버전은 `packageManager`의 pnpm)
- `.github/workflows/lighthouse.yml` + `lighthouserc.cjs`: Vercel 프리뷰 배포가 성공하면(`deployment_status`) 그 URL로 `/`, `/about`, `/posts/why-leave-velog`를 3회씩 측정. 성능·접근성·SEO 중앙값이 95점 미만이면 실패
  - 프리뷰에 Deployment Protection이 켜져 있으면 Vercel의 Protection Bypass for Automation 값을 저장소 시크릿 `VERCEL_AUTOMATION_BYPASS_SECRET`에 등록한다 (`x-vercel-protection-bypass` 헤더로 전달)
  - 리포트에 요청 헤더가 남을 수 있어 리포트 업로드(임시 공개 저장소, 아티팩트)는 켜지 않는다
- 측정값은 소개 페이지 "성능은 숫자로 확인합니다" 항목에 채운다

### Renovate ✅

- `renovate.json`: 나머지 의존성은 월요일 오전 9시 전(KST) 하나의 PR로 묶고, `next`/`eslint-config-next` 패치와 보안 취약점 알림은 일정과 관계없이 바로 PR
- 저장소에 Renovate GitHub 앱을 설치해야 동작한다

### 글 발행 흐름
1. `content/posts/<slug>/index.mdx` 작성 (`draft: true`)
2. PR 생성 → 프리뷰 URL에서 확인
3. `draft: false`로 변경 후 머지 → 프로덕션 배포

---

## 체크리스트 요약

- [x] Step 1 프로젝트 생성
- [x] 모든 화면 디자인 확정 → DESIGN.md (글 목록·소개·글 상세 각 데스크톱/모바일/다크, 404 데스크톱/모바일)
- [x] Claude Code 환경 세팅
- [x] Step 2 TS strict
- [x] Step 3 디자인 토큰 + 서체 + 헤더/푸터
- [ ] Step 4 Velite + 글 목록 → **첫 배포**
- [ ] Step 5 글 상세
- [ ] Step 6 소개 (데스크톱, 모바일)
- [ ] Step 6-1 404 (데스크톱, 모바일)
- [ ] Step 7 SEO
- [ ] Step 8 CI + 도메인
- [ ] 첫 글 발행: "벨로그를 떠나 직접 만든 블로그로 옮긴 이유"
