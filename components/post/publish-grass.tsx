const MOBILE_WEEKS = 20;

const LEVEL_CLASS = ["bg-grass-0", "bg-grass-1", "bg-grass-2"] as const;

// 주별 발행 수를 잔디 색 클래스로 바꿈
const toLevelClass = (count: number) =>
  LEVEL_CLASS[Math.min(count, LEVEL_CLASS.length - 1)];

// 발행 수 배열을 모두 더함
const sum = (counts: number[]) => counts.reduce((a, b) => a + b, 0);

type GrassRowProps = {
  counts: number[];
  className: string;
  cellClassName: string;
};

// 주별 발행 수를 한 줄짜리 잔디로 렌더링함
function GrassRow({ counts, className, cellClassName }: GrassRowProps) {
  return (
    <div
      role="img"
      aria-label={`최근 ${counts.length}주 동안 글 ${sum(counts)}편 발행`}
      className={`gap-1 ${className}`}
    >
      {counts.map((count, i) => (
        <span
          key={i}
          className={`rounded-xs ${cellClassName} ${toLevelClass(count)}`}
        />
      ))}
    </div>
  );
}

type PublishGrassProps = {
  counts: number[];
};

// 최근 주별 글 발행 기록을 잔디로 렌더링함
export function PublishGrass({ counts }: PublishGrassProps) {
  return (
    <div className="md:flex md:flex-col md:items-end">
      <GrassRow
        counts={counts.slice(-MOBILE_WEEKS)}
        className="flex md:hidden"
        cellClassName="size-[9px]"
      />
      <GrassRow
        counts={counts}
        className="hidden md:flex"
        cellClassName="size-2.5"
      />
      <p className="mt-3 hidden font-mono text-xs text-fg-muted md:block">
        최근 {counts.length}주 · 글 {sum(counts)}편
      </p>
    </div>
  );
}
