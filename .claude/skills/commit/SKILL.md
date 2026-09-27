---
name: commit
description: 변경사항을 검증하고 Conventional Commits 형식의 한국어 커밋을 만든다
disable-model-invocation: true
allowed-tools: Bash(git status:*) Bash(git diff:*) Bash(git add:*) Bash(git commit:*) Bash(pnpm typecheck) Bash(pnpm lint)
---

## 현재 변경사항

!`git status --short`

!`git diff HEAD --stat`

## 할 일

1. `pnpm typecheck`와 `pnpm lint`를 실행한다. 실패하면 커밋하지 말고 원인을 알려준다
2. 변경사항이 성격이 다른 여러 묶음이면 나눠서 커밋할지 먼저 제안한다
3. 커밋 메시지는 한국어, 다음 중 하나로 시작한다: `feat:` `fix:` `style:` `refactor:` `docs:` `chore:` `content:`
   - 제목은 50자 이내, 무엇을 했는지가 아니라 무엇이 달라졌는지
   - 필요하면 본문에 이유를 2~3줄
4. `git add`로 관련 파일만 올리고 커밋한다. `.env*`, 생성물 폴더는 올리지 않는다
5. push는 하지 않는다
