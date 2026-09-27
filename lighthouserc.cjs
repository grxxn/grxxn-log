const baseUrl = process.env.LHCI_BASE_URL;
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

if (!baseUrl) throw new Error("LHCI_BASE_URL이 필요합니다.");

const paths = ["/", "/about", "/posts/why-leave-velog"];

module.exports = {
  ci: {
    collect: {
      url: paths.map((path) => new URL(path, baseUrl).toString()),
      numberOfRuns: 3,
      settings: {
        skipAudits: ["is-crawlable"],
        ...(bypassSecret
          ? {
              extraHeaders: JSON.stringify({
                "x-vercel-protection-bypass": bypassSecret,
              }),
            }
          : {}),
      },
    },
    assert: {
      assertions: {
        "categories:performance": [
          "error",
          { minScore: 0.95, aggregationMethod: "median" },
        ],
        "categories:accessibility": [
          "error",
          { minScore: 0.95, aggregationMethod: "median" },
        ],
        "categories:seo": [
          "error",
          { minScore: 0.95, aggregationMethod: "median" },
        ],
      },
    },
  },
};
