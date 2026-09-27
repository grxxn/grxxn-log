import type { ReactNode } from "react";
import type { WorkExample as WorkExampleData } from "@/content/about";

type WorkExampleProps = {
  example: WorkExampleData;
};

type ExampleFigureProps = {
  caption: string | undefined;
  children: ReactNode;
};

// 예시 아래에 캡션을 붙여 figure로 감쌈
function ExampleFigure({ caption, children }: ExampleFigureProps) {
  return (
    <figure>
      {children}
      {caption && (
        <figcaption className="mt-3 text-[13px] leading-[1.7] break-keep text-fg-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// 주석 줄만 흐리게 표시한 코드 블록을 렌더링함
function CodeExample({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-md bg-bg-subtle p-4 font-mono text-xs leading-[1.75] whitespace-pre-wrap md:px-6 md:py-5 md:text-[13px] md:whitespace-pre">
      <code>
        {code.split("\n").map((line, i) => (
          <span
            key={i}
            className={`block ${line.trimStart().startsWith("//") ? "text-fg-subtle" : ""}`}
          >
            {line || " "}
          </span>
        ))}
      </code>
    </pre>
  );
}

// 일하는 방식 아코디언 안의 코드, 다이어그램, 목록, 수치 예시를 렌더링함
export function WorkExample({ example }: WorkExampleProps) {
  switch (example.kind) {
    case "code":
      return (
        <ExampleFigure caption={example.caption}>
          <CodeExample code={example.code} />
        </ExampleFigure>
      );
    case "diagram":
      return (
        <ExampleFigure caption={example.caption}>
          <ol className="flex flex-col gap-3 md:flex-row md:items-center">
            {example.steps.map((step, i) => (
              <li
                key={step.label}
                className="flex flex-col gap-3 md:flex-row md:items-center"
              >
                {i > 0 && (
                  <span aria-hidden="true" className="font-mono text-fg-muted">
                    <span className="md:hidden">↓</span>
                    <span className="hidden md:inline">→</span>
                  </span>
                )}
                <div className="rounded-md border border-border-strong px-4 py-3.5">
                  <p className="text-xs font-semibold text-fg-muted">
                    {step.label}
                  </p>
                  <p className="mt-1 font-mono text-[13px]">{step.value}</p>
                </div>
              </li>
            ))}
          </ol>
        </ExampleFigure>
      );
    case "lists":
      return (
        <div className="grid gap-[22px] md:grid-cols-2 md:gap-10">
          {example.lists.map((list) => (
            <div key={list.title}>
              <h4 className="text-base leading-[1.6] font-semibold break-keep md:text-[17px]">
                {list.title}
              </h4>
              <ul className="mt-2 list-disc pl-5 text-[15px] leading-[1.8] break-keep marker:text-fg-subtle md:text-base">
                {list.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    case "metrics":
      return (
        <ExampleFigure caption={example.caption}>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4">
            {example.metrics.map((metric) => (
              <div
                key={metric.label}
                className="border-t border-border-strong pt-3"
              >
                <dt className="text-[13px] break-keep text-fg-muted">
                  {metric.label}
                </dt>
                <dd className="mt-1 font-mono text-[22px] font-medium">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        </ExampleFigure>
      );
  }
}
