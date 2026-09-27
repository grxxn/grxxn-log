import { Fragment } from "react";

type CareerProject = {
  name: string;
  problem: string;
  action: string;
  result: string;
  stack: string[];
};

const PROJECT_FIELDS = [
  { key: "problem", label: "문제" },
  { key: "action", label: "한 일" },
  { key: "result", label: "결과" },
] as const satisfies { key: keyof CareerProject; label: string }[];

type CareerItemProps = {
  period: string;
  company: string;
  role: string;
  projects: CareerProject[];
};

// 기간, 회사, 직무와 프로젝트별 문제/한 일/결과를 담은 경력 항목을 렌더링함
export function CareerItem({
  period,
  company,
  role,
  projects,
}: CareerItemProps) {
  return (
    <li className="border-t border-border py-10 last:border-b md:grid md:grid-cols-[180px_1fr] md:gap-10">
      <p className="font-mono text-xs text-fg-muted md:text-[13px] md:leading-[33px]">
        {period}
      </p>
      <div className="mt-2 md:mt-0">
        <h3 className="text-xl leading-[1.5] font-medium break-keep md:text-[22px]">
          {company}
        </h3>
        <p className="mt-1 text-sm break-keep text-fg-muted md:text-[15px]">
          {role}
        </p>
        <ul className="mt-9 flex flex-col gap-10">
          {projects.map((project) => (
            <li key={project.name}>
              <h4 className="text-base leading-[1.6] font-semibold break-keep md:text-[17px]">
                {project.name}
              </h4>
              <dl className="mt-3 grid grid-cols-[44px_1fr] gap-y-2 md:grid-cols-[56px_1fr]">
                {PROJECT_FIELDS.map(({ key, label }) => (
                  <Fragment key={key}>
                    <dt className="text-[13px] leading-[27px] text-fg-muted md:leading-7">
                      {label}
                    </dt>
                    <dd className="text-[15px] leading-[1.8] break-keep md:text-base md:leading-[1.75]">
                      {project[key]}
                    </dd>
                  </Fragment>
                ))}
              </dl>
              <p className="mt-4 font-mono text-xs text-fg-muted">
                {project.stack.join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
