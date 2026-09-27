# CLAUDE.md

@AGENTS.md

grxxn.log — 5년차 프론트엔드 개발자 grxxn의 기술 블로그 겸 포트폴리오.
이직용 포트폴리오를 겸하므로 코드 품질, 성능, 접근성, 디자인 완성도가 곧 결과물이다.

- 기획과 목표: @PROJECT.md
- 디자인 기준 (색, 서체, 간격, 컴포넌트): @DESIGN.md
- 세팅 순서와 상세 설정: @SETUP.md

## 스택

- Next.js 16 App Router, React 19, TypeScript (strict)
- 콘텐츠: Velite + MDX (`content/posts/<slug>/index.mdx`), 출력은 `.velite/` (`#site/content`로 import)
- 스타일: Tailwind CSS v4 + CSS 변수 디자인 토큰 (`styles/tokens.css`)
- 서체: IBM Plex Sans KR + IBM Plex Mono (`next/font/google`)
- 코드 하이라이팅: rehype-pretty-code (Shiki)
- 패키지 매니저: **pnpm** (npm/yarn 사용 금지)
- 배포: Vercel

## 명령어

- `pnpm dev` — Velite watch + Next dev 동시 실행
- `pnpm build` — velite build 후 next build
- `pnpm content` — Velite만 빌드 (스키마 변경 후 타입 재생성)
- `pnpm typecheck` — tsc --noEmit
- `pnpm lint`

## 작업 완료 전 반드시 확인

1. `pnpm typecheck` 통과
2. `pnpm lint` 통과
3. 콘텐츠/스키마를 건드렸다면 `pnpm content` 통과
4. 페이지 구조를 바꿨다면 `pnpm build` 통과
5. UI를 바꿨다면 DESIGN.md의 값과 어긋나지 않는지 확인

실패한 상태로 작업을 끝났다고 보고하지 말 것.

## 디렉터리 규칙

- `app/` — 라우트만. 로직은 `lib/`, UI는 `components/`로 뺀다
- `components/ui/` 범용 UI, `components/mdx/` MDX 전용, `components/layout/` 헤더/푸터
- `components/post/` 글 관련 (목록 항목, 썸네일, 잔디, 목차, 이전/다음 글, 댓글)
- 라우트: `/` 글 목록, `/posts/[slug]` 글 상세, `/about` 소개, `app/not-found.tsx` 404
- `lib/posts.ts` — 포스트 조회는 반드시 이 함수들을 거친다 (`#site/content` 직접 import는 lib 안에서만)
- `.velite/`, `public/static/`은 생성물. 직접 수정 금지

## 코드 컨벤션

- 기본은 **서버 컴포넌트**. `'use client'`는 상태/이벤트/브라우저 API가 필요한 가장 작은 컴포넌트에만
- `any` 금지. 불가피하면 `unknown` + 타입 가드
- `as` 타입 단언 최소화, 설정 객체는 `satisfies` 사용
- 컴포넌트 파일명 kebab-case (`theme-toggle.tsx`), 컴포넌트명 PascalCase, named export
- props 타입은 컴포넌트 바로 위에 `type XxxProps`로 정의
- 새 의존성 추가 전에 이유를 먼저 설명하고 확인받을 것

## 주석 규칙

- 주석은 코드만으로 의도가 드러나지 않는 기능 설명에만, **1줄로** 작성
- 예외: 함수/메서드에는 항상 바로 위에 무슨 일을 하는지 1줄 주석을 단다
  - 형식: 동작을 서술형으로 (예: `// 드래그앤드랍으로 카드 순서를 이동시킴`, `// 태그별로 게시글을 필터링함`)
  - 구현 방식이 아니라 역할을 설명한다
- 스타일 설명 주석 금지 (예: `// 버튼 여백`, `// 다크모드 색상`)
- 히스토리성 주석 금지 (예: `// 기존 로직에서 변경`, `// 추가됨`, `// TODO: 이전 버전`)
- 주석 처리된 옛 코드를 남기지 않는다. 이력은 git이 관리한다

## 디자인 규칙

**DESIGN.md가 기준이다.** 값을 추측하지 말고 DESIGN.md에서 찾는다. 없는 화면이나 요소는 만들기 전에 먼저 상의한다.

- 색상은 **시맨틱 토큰만** 사용: `bg-bg`, `bg-bg-subtle`, `text-fg`, `text-fg-muted`, `text-fg-subtle`, `border-border`, `border-border-strong`, `text-accent`, `bg-grass-*`
- Tailwind 기본 팔레트(`bg-gray-100`, `text-green-600` 등)와 임의값(`bg-[#fff]`) 사용 금지
- 새 색이 필요하면 DESIGN.md에 먼저 추가하고, `styles/tokens.css`에 primitive → semantic 순서로 반영한 뒤 `globals.css`의 `@theme`에 노출
- 다크모드는 토큰으로 해결. 컴포넌트에 `dark:` 변형을 늘어놓지 않는다
- 서체: 한글이 들어가는 텍스트는 `font-sans`, 로고/날짜/연도/기간/기술 스택/코드는 `font-mono`
- 한글 텍스트에는 `break-keep` (`word-break: keep-all`)
- 본문 자간은 0. 음수 자간은 페이지 제목(40px)에만
- 구분은 1px 선과 여백으로만 한다
- 마지막 콘텐츠와 푸터 사이는 데스크톱 117px, 모바일 80px 고정. `margin-top: auto`로 푸터를 바닥에 붙이지 않는다
- 헤더 오른쪽은 테마 토글 → `글` → `소개` 순서. RSS는 푸터에만 둔다
- 다크모드 색은 DESIGN.md의 다크 토큰만 쓴다. 썸네일 3톤은 라이트와 같다
- **금지**: 그라데이션, 그림자, 둥근 카드, 한쪽만 굵은 선이 있는 카드, 아이콘+제목+설명 3단 카드, 블러/글로우, 이모지, 섹션마다 붙는 스크롤 애니메이션
- 본문 타이포그래피는 `prose` 클래스 + 토큰 오버라이드

## 콘텐츠(MDX) 규칙

- 프론트매터 스키마는 `velite.config.ts`가 단일 진실 공급원. 타입을 따로 정의하지 않는다
- 스키마 필드 추가/변경 시 기존 글 전체가 통과하는지 `pnpm content`로 확인
- 새 MDX 컴포넌트는 `components/mdx/`에 만들고 `mdx-components.tsx`에 등록
- 글 본문(`content/posts/**`)은 요청받지 않는 한 수정하지 않는다

## 성능·접근성 기준

- 글 페이지는 SSG (`generateStaticParams`). 요청 시점 렌더링이 필요하면 먼저 상의
- 이미지는 `next/image`, 폰트는 `next/font`
- 인터랙티브 요소는 키보드로 조작 가능해야 하고 포커스 스타일을 없애지 않는다
- 시맨틱 HTML 우선 (`<article>`, `<nav>`, `<time dateTime>`, `<details>`, `<dl>`), 아이콘 버튼에는 `aria-label`
- 현재 메뉴에는 `aria-current="page"`, 장식용 썸네일에는 `aria-hidden="true"`
- 테마 토글은 현재 상태에 맞는 `aria-label` ("다크 모드로 전환" / "라이트 모드로 전환")
- 모바일 터치 영역 44px 이상
- 목표: Lighthouse 성능/접근성/SEO 95+

## 작업 방식

- 큰 기능은 구현 전에 짧은 계획(변경할 파일, 접근 방식)을 먼저 제시
- 한 번에 한 단계씩. SETUP.md의 Step 단위로 진행
- Next.js API가 버전에 따라 다를 수 있으니 확실하지 않으면 공식 문서를 확인한 뒤 작성
- 커밋 메시지: Conventional Commits (`feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `chore:`, `content:`)
- 설명과 커밋 메시지는 한국어로
