---
name: run-grxxn-log
description: grxxn.log 블로그(Next.js 16)를 실행하고 헤드리스 Chrome으로 조작한다. dev 서버 띄우기/재사용, 페이지 스크린숏(데스크톱/모바일, 라이트/다크), 클릭·hover·Tab 포커스, 계산된 스타일로 DESIGN.md 값 대조, 콘솔/Next 에러 오버레이 확인, 프로덕션 빌드 실행. Use when asked to run, start, build, screenshot, or check the grxxn.log app in a browser.
---

grxxn.log는 Next.js 16 App Router 블로그다. 에이전트는 dev 서버(`localhost:3000`)에 붙어서
`.claude/skills/run-grxxn-log/driver.mjs`로 조작한다. 드라이버는 **의존성 0**:
로컬 Chrome을 `--headless=new`로 띄우고 Node 24 내장 `WebSocket`으로 CDP를 직접 부른다
(Playwright/`chromium-cli`는 이 프로젝트에 없고, 의존성 추가는 CLAUDE.md상 확인이 필요하다).

경로는 모두 저장소 루트 기준.

## Prerequisites

- macOS + Google Chrome (`/Applications/Google Chrome.app`). 다른 위치면 `CHROME_PATH=<실행 파일>`.
- Node 24 (전역 `WebSocket`/`fetch` 필요), pnpm (npm/yarn 금지).

```bash
node -v   # v24.8.0 에서 확인
pnpm install
```

## Run (agent path)

### 1. dev 서버 확보

사용자가 이미 `pnpm dev`를 띄워둔 경우가 많다. **먼저 확인하고, 있으면 재사용한다. 죽이지 않는다.**

```bash
lsof -ti:3000 -sTCP:LISTEN || (pnpm dev > /tmp/grxxn-dev.log 2>&1 &)
timeout 60 bash -c 'until curl -sf -o /dev/null http://localhost:3000; do sleep 1; done'
```

서버 로그는 누가 띄웠든 `.next/dev/logs/next-development.log`에 쌓인다.

### 2. 드라이버에 명령 파이프

```bash
node .claude/skills/run-grxxn-log/driver.mjs <<'EOF'
nav /
wait-for text=Documentation
screenshot home-light
style h1
scheme dark
screenshot home-dark
viewport mobile
screenshot home-mobile full
press Tab
eval document.activeElement.outerHTML.slice(0,60)
errors
EOF
```

스크린숏 → `$TMPDIR/grxxn-log-shots/<이름>.png` (`SHOTS_DIR`로 변경). 경로가 출력되니 **Read로 열어서 직접 볼 것.**
명령 하나라도 실패하거나 Next 에러 오버레이가 찍히면 종료 코드 1.

| 명령                                                    | 동작                                                                         |
| ------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `nav <경로\|URL>`                                       | `BASE_URL`(기본 `http://localhost:3000`) 기준으로 이동, load 대기            |
| `wait-for <css>` / `wait-for text=<문자열>`             | 나타날 때까지 폴링 (`TIMEOUT` 기본 30000ms)                                  |
| `click <sel>` / `hover <sel>`                           | 실제 마우스 이벤트 (React 핸들러, `:hover` 동작)                             |
| `press <Tab\|Enter\|Escape\|Space\|ArrowDown\|ArrowUp>` | 키 입력. 포커스 링 확인용                                                    |
| `viewport desktop\|mobile\|<w> <h>`                     | desktop=1280×900, mobile=390×844 @2x (DESIGN.md 모바일 기준 폭)              |
| `scheme light\|dark`                                    | `prefers-color-scheme` 에뮬레이션 (시스템 테마 흉내)                         |
| `style <sel> [prop,prop]`                               | 계산된 스타일 + 문서 기준 rect. 기본은 color/font/line-height/letter-spacing |
| `eval <js>`                                             | 페이지에서 JS 평가, JSON 출력                                                |
| `screenshot [이름] [full]`                              | PNG 저장. `full`은 전체 페이지                                               |
| `errors`                                                | 쌓인 console.error/예외/리소스 실패를 출력하고 비움                          |
| `sleep <ms>`, `help`, `quit`                            |                                                                              |

`style`은 DESIGN.md 값 대조에 쓴다. 예: `style text=만들고, 배우고 font-size,line-height,color`,
간격은 두 요소의 `rect.y`/`rect.h` 차이로 계산한다 (헤더 → 제목 112px, 마지막 콘텐츠 → 푸터 117px 등).

### 프로덕션 빌드로 확인

dev 서버가 떠 있어도 빌드는 가능하다 (dev는 `.next/dev`를 따로 쓴다). 포트를 겹치지 않게 3100에서 띄운다.

```bash
pnpm build
(pnpm start -p 3100 > /tmp/grxxn-start.log 2>&1 &)
timeout 30 bash -c 'until curl -sf -o /dev/null http://localhost:3100; do sleep 0.5; done'
printf 'nav /\nscreenshot prod-home\nerrors\n' | BASE_URL=http://localhost:3100 node .claude/skills/run-grxxn-log/driver.mjs
lsof -ti:3100 -sTCP:LISTEN | xargs kill
```

## Run (human path)

`pnpm dev` → 브라우저로 http://localhost:3000. Ctrl-C로 종료.

## Test

테스트 스위트는 아직 없다. 검증은 CLAUDE.md의 "작업 완료 전 반드시 확인" 순서를 따른다.

```bash
pnpm lint
pnpm build
```

## Gotchas

- **dev 서버는 디렉터리당 하나만.** 3000이 점유된 상태에서 `pnpm dev`를 또 치면 3001로 가는 척하다가
  `⨯ Another next dev server is already running.`으로 exit 1. 사용자 서버를 kill하지 말고 3000에 붙는다.
- **헤드리스 Chrome은 기본적으로 "포커스 없는 창"이라 `Tab`이 먹지 않는다.** 드라이버는
  `Emulation.setFocusEmulationEnabled`를 켜서 해결했다. 직접 CDP를 쓸 때도 필요하다.
- **Next dev 인디케이터(좌하단 `N` 버튼)가 스크린숏에 찍힌다.** 드라이버가 `nextjs-portal` shadow root의
  `[data-nextjs-toast]`만 숨긴다. 보고 싶으면 `SHOW_DEV_INDICATOR=1`. 에러 다이얼로그(`[data-nextjs-dialog]`)는
  숨기지 않고 내용을 출력한 뒤 종료 코드를 1로 만든다.
- **테마 전환 직후 스크린숏은 `transition-colors` 중간 색이 찍힌다** (다크 전환 직후 버튼이 회색/반투명으로 나옴).
  `scheme`은 `document.getAnimations()`가 끝날 때까지 기다리게 해뒀다. `click`으로 토글한 뒤에는 `sleep 300`을 넣을 것.
- **존재하지 않는 경로 이동 시 `errors`에 `status of 404` 로그가 한 줄 남는다.** 404 페이지 확인 중이면 정상.
- **`scheme dark`는 시스템 설정만 흉내 낸다.** next-themes 도입(SETUP.md Step 3) 후에는 localStorage의 사용자 선택이
  우선하므로, 토글 동작은 `click`으로 헤더 토글 버튼을 눌러 확인해야 한다 (아직 토글이 없어 미검증).
- **Write/Edit 후 PostToolUse 훅이 Prettier로 파일을 다시 포맷한다** (`.claude/hooks/format.mjs`).
  `sed`로 드라이버를 고칠 때는 포맷된 모양(큰따옴표, 세미콜론, 줄바꿈)을 기준으로 매칭할 것.
- 첫 `nav`는 Turbopack이 라우트를 컴파일하느라 느릴 수 있다. `sleep` 대신 `wait-for`를 쓴다.

## Troubleshooting

- **`Chrome을 찾지 못함`**: `CHROME_PATH`로 실행 파일을 지정한다. Playwright 캐시의 브라우저도 된다
  (이름이 `Chromium.app`이 아니라 `Google Chrome for Testing.app`이다):
  ```bash
  CHROME_PATH="$(find ~/Library/Caches/ms-playwright/chromium-*/chrome-mac-arm64 -maxdepth 4 -path '*Contents/MacOS/*' -type f | head -1)" \
    node .claude/skills/run-grxxn-log/driver.mjs <<< 'nav /'
  ```
- **`!! Next 에러 오버레이가 떠 있음:` + 스택**: 페이지 렌더링 에러. 출력된 파일:줄을 고친 뒤 다시 `nav`.
  서버 측 스택은 `.next/dev/logs/next-development.log`에도 있다.
- **`nav` 후 `net::ERR_CONNECTION_REFUSED`**: 서버가 안 떠 있다. 1단계의 포트 폴링부터 다시.
