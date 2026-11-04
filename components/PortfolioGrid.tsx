"use client";
import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/content/portfolio";
import { portfolioCategories } from "@/content/portfolio";
import { ProjectMeta, ProjectVisual } from "./sections";

export function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [cat, setCat] = useState<string>("ALL");
  const list = cat === "ALL" ? projects : projects.filter((p) => p.category === cat);
  const cats = ["ALL", ...portfolioCategories];
  const ratios = ["16 / 10", "4 / 5", "4 / 5", "16 / 10"];
  return (
    <div>
      <div role="group" aria-label="카테고리 필터" className="flex flex-wrap gap-x-8 gap-y-3 border-b border-line pb-5">
        {cats.map((c) => (
          <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}
            className={`t-label min-h-11 border-b-2 py-2 transition-colors ${cat === c ? "border-accent text-navy" : "border-transparent text-mute hover:text-navy"}`}>
            {c}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{list.length}개 프로젝트 표시 중</p>
      {list.length === 0 ? (
        <p className="py-24 text-center text-mute">이 카테고리에 등록된 프로젝트가 아직 없습니다.</p>
      ) : (
        <ul className="mt-14 grid gap-x-8 gap-y-20 md:grid-cols-12">
          {list.map((p, i) => {
            const wide = i % 3 === 0;
            return (
              <li key={p.slug} className={wide ? "md:col-span-8" : "md:col-span-4 md:mt-24"}>
                <Link href={`/portfolio/${p.slug}`} className="group block">
                  <ProjectVisual p={p} ratio={wide ? "16 / 10" : ratios[1]} />
                  <ProjectMeta p={p} />
                  <p className="t-small mt-3 text-mute">{p.scope.join(" · ")}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
