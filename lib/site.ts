type SiteConfig = {
  name: string;
  url: string;
  description: string;
  author: { name: string; github: string; email: string };
  repo: { url: string; branch: string };
  feedPath: string;
};

const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const site = {
  name: "grxxn.log",
  url: productionHost ? `https://${productionHost}` : "http://localhost:3000",
  description: "만들고, 배우고, 기록합니다.",
  author: { name: "grxxn", github: "grxxn", email: "devgrxxn@gmail.com" },
  repo: { url: "https://github.com/grxxn/grxxn-log", branch: "main" },
  feedPath: "/feed.xml",
} satisfies SiteConfig;
