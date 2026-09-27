// lhr에는 요청 헤더(보호 우회 시크릿)가 담긴 설정값도 있으므로 필요한 필드만 골라 출력함
import { appendFileSync, existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const resultsDir = process.argv[2] ?? ".lighthouseci";

const CATEGORIES = [
  ["performance", "성능"],
  ["accessibility", "접근성"],
  ["seo", "SEO"],
];

const METRICS = [
  ["first-contentful-paint", "FCP"],
  ["largest-contentful-paint", "LCP"],
  ["total-blocking-time", "TBT"],
  ["cumulative-layout-shift", "CLS"],
  ["speed-index", "Speed Index"],
];

// 마크다운 표 칸이 깨지지 않도록 줄바꿈과 파이프를 이스케이프함
const cell = (value) =>
  String(value ?? "-")
    .replace(/\r?\n/g, " ")
    .replace(/\|/g, "\\|");

// 결과 폴더에서 lhr JSON을 모두 읽음
const readReports = (dir) => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.startsWith("lhr-") && name.endsWith(".json"))
    .map((name) => JSON.parse(readFileSync(join(dir, name), "utf8")));
};

// 같은 URL의 여러 측정 중 성능 점수가 중앙값인 측정을 고름
const pickMedianRun = (runs) => {
  const sorted = [...runs].sort(
    (a, b) =>
      (a.categories?.performance?.score ?? 0) -
      (b.categories?.performance?.score ?? 0),
  );
  return sorted[Math.floor(sorted.length / 2)];
};

// 카테고리 점수를 0~100 정수로 변환함
const toScore = (lhr, id) => {
  const score = lhr.categories?.[id]?.score;
  return typeof score === "number" ? Math.round(score * 100) : "-";
};

// 예상 절약 시간이 큰 개선 항목을 상위 N개 뽑음
const getTopOpportunities = (lhr, limit) =>
  Object.values(lhr.audits ?? {})
    .filter(
      (audit) =>
        audit.details?.type === "opportunity" &&
        (audit.details.overallSavingsMs ?? 0) > 0,
    )
    .sort((a, b) => b.details.overallSavingsMs - a.details.overallSavingsMs)
    .slice(0, limit)
    .map((audit) => ({
      title: audit.title,
      savingsMs: Math.round(audit.details.overallSavingsMs),
    }));

// LCP 요소의 라벨과 선택자를 찾음
const getLcpElement = (lhr) => {
  const details = lhr.audits?.["largest-contentful-paint-element"]?.details;
  const tables = details?.type === "list" ? details.items : [details];
  for (const table of tables ?? []) {
    const node = table?.items?.find(
      (item) => item?.node?.type === "node",
    )?.node;
    if (node) return { label: node.nodeLabel, selector: node.selector };
  }
  return null;
};

// 페이지 하나의 요약을 마크다운으로 만듦
const renderPage = (lhr, runCount) => {
  const url = new URL(lhr.finalDisplayedUrl ?? lhr.requestedUrl);
  const lines = [
    `### \`${url.pathname}\` (${runCount}회 중 성능 중앙값 측정)`,
    "",
  ];

  const headers = [
    ...CATEGORIES.map(([, label]) => label),
    ...METRICS.map(([, label]) => label),
  ];
  const values = [
    ...CATEGORIES.map(([id]) => toScore(lhr, id)),
    ...METRICS.map(([id]) => lhr.audits?.[id]?.displayValue),
  ];
  lines.push(
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    `| ${values.map(cell).join(" | ")} |`,
    "",
  );

  const opportunities = getTopOpportunities(lhr, 5);
  lines.push("**개선 항목 (예상 절약 상위 5개)**", "");
  if (opportunities.length === 0) {
    lines.push("없음", "");
  } else {
    lines.push("| 항목 | 예상 절약 |", "| --- | ---: |");
    for (const { title, savingsMs } of opportunities) {
      lines.push(`| ${cell(title)} | ${savingsMs} ms |`);
    }
    lines.push("");
  }

  const lcp = getLcpElement(lhr);
  lines.push(
    `**LCP 요소**: ${lcp ? `${cell(lcp.label)} (\`${cell(lcp.selector)}\`)` : "찾지 못함"}`,
    "",
  );
  return lines.join("\n");
};

// 모든 페이지 요약을 로그와 Actions 실행 요약에 씀
const main = () => {
  const reports = readReports(resultsDir);
  const sections = ["## Lighthouse 측정 결과", ""];

  if (reports.length === 0) {
    sections.push(
      `\`${resultsDir}\`에 lhr 결과가 없습니다. 측정 단계 로그를 확인하세요.`,
    );
  } else {
    const runsByUrl = new Map();
    for (const lhr of reports) {
      runsByUrl.set(lhr.requestedUrl, [
        ...(runsByUrl.get(lhr.requestedUrl) ?? []),
        lhr,
      ]);
    }
    for (const runs of runsByUrl.values()) {
      sections.push(renderPage(pickMedianRun(runs), runs.length));
    }
  }

  const output = sections.join("\n");
  console.log(output);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${output}\n`);
  }
};

main();
