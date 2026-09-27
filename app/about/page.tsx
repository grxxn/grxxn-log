import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CareerItem } from "@/components/about/career-item";
import { SideProjectItem } from "@/components/about/side-project-item";
import { WorkAccordion } from "@/components/about/work-accordion";
import { TextLink } from "@/components/ui/text-link";
import { about } from "@/content/about";
import { formatThumbNo, getPostBySlug, getThumbTone } from "@/lib/posts";

export const metadata: Metadata = {
  title: "소개",
  description: about.greeting.join(" "),
};

type AboutSectionProps = {
  id: string;
  label: string;
  children: ReactNode;
};

// 섹션 라벨과 내용을 묶은 소개 페이지 섹션을 렌더링함
function AboutSection({ id, label, children }: AboutSectionProps) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="text-[15px] font-semibold break-keep">
        {label}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

// slug로 관련 글을 찾아 제목과 주소를 반환함
const getRelatedPost = (slug: string | undefined) => {
  const post = slug ? getPostBySlug(slug) : undefined;
  return post && { title: post.title, href: post.permalink };
};

// 인트로, 경력, 사이드 프로젝트, 일하는 방식으로 구성된 소개 페이지를 렌더링함
export default function AboutPage() {
  return (
    <div className="flex flex-col gap-[88px] pt-14 md:gap-32 md:pt-28">
      <section>
        <h1 className="text-[32px] leading-[1.3] font-semibold break-keep md:text-[40px] md:tracking-[-0.01em]">
          소개
        </h1>
        <p className="mt-5 text-[22px] leading-[1.6] break-keep md:mt-7 md:text-[26px] md:leading-[1.65]">
          {about.greeting[0]}
          <br />
          {about.greeting[1]}
        </p>
        <p className="mt-5 max-w-[680px] text-base leading-[1.8] break-keep text-fg-muted md:mt-7 md:text-lg">
          {about.intro}
        </p>
        <ul className="mt-5 flex flex-wrap gap-5 text-base md:mt-9 md:gap-7">
          {about.links.map((link) => (
            <li key={link.label}>
              <TextLink href={link.href} className="inline-block py-1 md:py-0">
                {link.label}
              </TextLink>
            </li>
          ))}
        </ul>
      </section>

      <AboutSection id="career" label="경력">
        <ul>
          {about.careers.map((career) => (
            <CareerItem key={career.period} {...career} />
          ))}
        </ul>
      </AboutSection>

      <AboutSection id="side-projects" label="사이드 프로젝트">
        <ul>
          {about.sideProjects.map((project, i) => (
            <SideProjectItem
              key={project.name}
              no={formatThumbNo(i + 1)}
              tone={getThumbTone(i + 1)}
              {...project}
            />
          ))}
        </ul>
      </AboutSection>

      <AboutSection id="work" label="일하는 방식">
        {about.works.map((work, i) => (
          <WorkAccordion
            key={work.title}
            title={work.title}
            summary={work.summary}
            examples={work.examples}
            reasons={work.reasons}
            related={getRelatedPost(
              "relatedSlug" in work ? work.relatedSlug : undefined,
            )}
            defaultOpen={i === 0}
          />
        ))}
      </AboutSection>
    </div>
  );
}
