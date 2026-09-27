"use client";

import { useState, type ReactNode } from "react";
import { Pagination } from "@/components/ui/pagination";

type PagedListProps = {
  label: string;
  pages: ReactNode[];
};

// 서버에서 렌더링한 페이지 묶음 중 하나만 보여주고 페이지네이션으로 전환함
export function PagedList({ label, pages }: PagedListProps) {
  const [current, setCurrent] = useState(1);

  return (
    <>
      {pages[current - 1]}
      {pages.length > 1 && (
        <Pagination
          label={label}
          current={current}
          total={pages.length}
          onChange={setCurrent}
        />
      )}
    </>
  );
}
