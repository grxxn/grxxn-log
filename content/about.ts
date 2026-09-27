type AboutLink = { label: string; href: string };

type CareerProject = {
  name: string;
  problem: string;
  action: string;
  result: string;
  stack: string[];
};

type Career = {
  period: string;
  company: string;
  role: string;
  projects: CareerProject[];
};

type SideProject = {
  name: string;
  period: string;
  thumb: string;
  description: string;
  stack: string[];
  links: AboutLink[];
};

export type WorkExample =
  | { kind: "code"; code: string; caption?: string }
  | {
      kind: "diagram";
      steps: { label: string; value: string }[];
      caption?: string;
    }
  | { kind: "lists"; lists: { title: string; items: string[] }[] }
  | {
      kind: "metrics";
      metrics: { label: string; value: string }[];
      caption?: string;
    };

type WorkItem = {
  title: string;
  summary: string;
  examples: WorkExample[];
  reasons: string[];
  relatedSlug?: string;
};

type About = {
  greeting: [string, string];
  intro: string;
  links: AboutLink[];
  careers: Career[];
  sideProjects: SideProject[];
  works: WorkItem[];
};

export const about = {
  greeting: ["안녕하세요,", "5년차 프론트엔드 개발자 grxxn입니다."],
  intro:
    "[한두 문장 소개: 어떤 문제를 좋아하고, 어떤 방식으로 일하는 개발자인지]",
  links: [
    { label: "이력서 PDF", href: "/resume.pdf" },
    { label: "GitHub", href: "https://github.com/grxxn" },
    { label: "Email", href: "mailto:[이메일]" },
  ],
  careers: [
    {
      period: "2024.11 — 현재",
      company: "[회사 A]",
      role: "프론트엔드 개발자",
      projects: [
        {
          name: "[프로젝트 이름]",
          problem: "[어떤 문제가 있었는지]",
          action: "[무엇을 했는지]",
          result: "[결과를 수치로]",
          stack: ["Next.js", "TypeScript"],
        },
      ],
    },
    {
      period: "2022.08 — 2024.07",
      company: "[회사 B]",
      role: "프론트엔드 개발자",
      projects: [
        {
          name: "[프로젝트 이름]",
          problem: "[어떤 문제가 있었는지]",
          action: "[무엇을 했는지]",
          result: "[결과를 수치로]",
          stack: ["React", "TypeScript"],
        },
      ],
    },
    {
      period: "2021.09 — 2022.04",
      company: "[회사 C]",
      role: "프론트엔드 개발자",
      projects: [
        {
          name: "[프로젝트 이름]",
          problem: "[어떤 문제가 있었는지]",
          action: "[무엇을 했는지]",
          result: "[결과를 수치로]",
          stack: ["React", "JavaScript"],
        },
      ],
    },
  ],
  sideProjects: [
    {
      name: "grxxn.log",
      period: "2026.09 — 현재",
      thumb: "grxxn.log",
      description:
        "직접 설계하고 만든 기술 블로그 겸 포트폴리오. 기술 결정과 제작 과정을 글로 남깁니다.",
      stack: ["Next.js", "Velite", "Tailwind"],
      links: [
        { label: "제작기 보기", href: "/posts/why-leave-velog" },
        { label: "GitHub", href: "https://github.com/grxxn/grxxn-log" },
      ],
    },
  ],
  works: [
    {
      title: "AI는 도구로 다룹니다",
      summary:
        "반복되는 일은 AI에게 맡기고, 판단과 검증은 직접 합니다. 규칙은 문서로 남겨 매번 같은 기준으로 일하게 합니다.",
      examples: [
        {
          kind: "lists",
          lists: [
            {
              title: "AI에게 맡기는 일",
              items: [
                "보일러플레이트와 반복 작업",
                "스키마, 설정 파일 초안",
                "문서화된 기준과 구현 대조",
              ],
            },
            {
              title: "직접 판단하는 일",
              items: ["설계와 기술 선택", "디자인 기준 결정", "완료 여부 검증"],
            },
          ],
        },
        {
          kind: "code",
          code: `## 작업 완료 전 반드시 확인

1. \`pnpm typecheck\` 통과
2. \`pnpm lint\` 통과
3. 콘텐츠/스키마를 건드렸다면 \`pnpm content\` 통과
4. 페이지 구조를 바꿨다면 \`pnpm build\` 통과

실패한 상태로 작업을 끝났다고 보고하지 말 것.`,
          caption: "CLAUDE.md — 이 블로그 저장소의 AI 작업 규칙 일부",
        },
      ],
      reasons: [
        "AI가 만든 코드도 결국 제가 책임지는 코드입니다. 그래서 무엇을 맡길지보다 무엇으로 검증할지를 먼저 정합니다.",
      ],
    },
    {
      title: "디자인과 같은 언어로 이야기합니다",
      summary:
        "색과 간격을 토큰 이름으로 부르면 디자인과 코드가 같은 단어를 씁니다.",
      examples: [
        {
          kind: "diagram",
          steps: [
            { label: "Primitive", value: "--green-600" },
            { label: "Semantic", value: "--color-accent" },
            { label: "Tailwind", value: "text-accent" },
          ],
          caption: "다크모드는 Semantic 계층의 값만 바꿉니다",
        },
      ],
      reasons: [
        "컴포넌트는 Semantic 토큰만 알기 때문에 팔레트가 바뀌어도 컴포넌트 코드는 그대로입니다. 디자인 문서의 표가 곧 토큰 파일이 됩니다.",
      ],
      relatedSlug: "design-tokens-tailwind-v4",
    },
    {
      title: "타입으로 약속을 남깁니다",
      summary:
        "데이터의 모양은 스키마 한 곳에서 정하고, 나머지는 타입이 따라오게 합니다.",
      examples: [
        {
          kind: "code",
          code: `// 프론트매터 스키마가 곧 글의 타입이 된다
const posts = defineCollection({
  schema: s.object({
    title: s.string().max(99),
    date: s.isodate(),
    thumb: s.string().max(24),
    draft: s.boolean().default(false),
  }),
})

// 설정 객체는 단언 대신 satisfies로 검사한다
const TONE_CLASS = {
  deep: "bg-thumb-deep-bg",
  moss: "bg-thumb-moss-bg",
  pale: "bg-thumb-pale-bg",
} satisfies Record<ThumbTone, string>`,
          caption: "velite.config.ts, post-thumbnail.tsx 일부",
        },
      ],
      reasons: [
        "프론트매터가 빠지면 빌드가 실패하고, 톤이 하나 늘면 타입 에러가 납니다. 리뷰에서 말로 지켜야 했던 약속을 컴파일러가 대신 지킵니다.",
      ],
      relatedSlug: "velite-mdx-pipeline",
    },
    {
      title: "성능은 숫자로 확인합니다",
      summary:
        "빨라졌다는 느낌 대신 측정값으로 이야기하고, 회귀는 CI에서 막습니다.",
      examples: [
        {
          kind: "metrics",
          metrics: [
            { label: "성능", value: "95+" },
            { label: "접근성", value: "95+" },
            { label: "SEO", value: "95+" },
            { label: "런타임 하이라이팅 JS", value: "0 KB" },
          ],
          caption:
            "Lighthouse 목표치. 배포 후 Lighthouse CI 측정값으로 교체합니다",
        },
      ],
      reasons: [
        "글 페이지는 모두 정적으로 생성하고, 코드 하이라이팅은 빌드 타임에 끝냅니다. 클라이언트 컴포넌트는 상태가 필요한 가장 작은 단위로만 둡니다.",
      ],
    },
  ],
} satisfies About;
