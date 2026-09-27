type SiteConfig = {
  name: string;
  url: string;
  description: string;
  author: { name: string; github: string; email: string };
  repo: { url: string; branch: string };
};

export const site = {
  name: "grxxn.log",
  url: "https://grxxn.dev",
  description: "만들고, 배우고, 기록합니다.",
  author: { name: "grxxn", github: "grxxn", email: "[이메일]" },
  repo: { url: "https://github.com/grxxn/grxxn-log", branch: "main" },
} satisfies SiteConfig;
