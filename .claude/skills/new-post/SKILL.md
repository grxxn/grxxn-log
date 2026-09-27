---
name: new-post
description: 새 블로그 글의 MDX 파일을 Velite 스키마에 맞게 만든다
disable-model-invocation: true
argument-hint: "[slug] [제목]"
---

새 글을 만든다. slug: `$0`, 제목: `$1`

1. `velite.config.ts`의 posts 스키마를 먼저 읽고 필수 필드를 확인한다 (아직 없으면 SETUP.md Step 4의 스키마를 기준으로 한다)
2. `content/posts/$0/index.mdx`를 만든다. 이미 있으면 덮어쓰지 말고 알려준다
3. 프론트매터를 스키마의 필수 필드로 모두 채운다
   - `title`: $1
   - `date`: 오늘 날짜 (YYYY-MM-DD)
   - `description`: 비워두지 말고 `[한 줄 요약]`으로 둔다
   - `thumb`: 썸네일 키워드. 제목에서 한두 단어를 제안한다 (24자 이내)
   - `tags`: 제목에 맞는 태그 2~3개 제안
   - `draft: true`
4. 본문에는 `## 들어가며` 제목 하나만 넣는다. 본문 내용은 쓰지 않는다
5. `pnpm content`로 스키마 검증이 통과하는지 확인한다
