"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Arrow } from "./ui";

type S = { slug: string; no: string; name: string; en: string; summary: string; featured: boolean };
type G = { id: string; label: string; slugs: string[] };

export function ServiceExplorer({ services, groups }: { services: S[]; groups: G[] }) {
  const [q, setQ] = useState("");
  const [g, setG] = useState("all");
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    const slugs = g === "all" ? null : groups.find((x) => x.id === g)?.slugs ?? [];
    return services.filter((s) => (!slugs || slugs.includes(s.slug)) && (!t || `${s.name} ${s.en} ${s.summary}`.toLowerCase().includes(t)));
  }, [q, g, services, groups]);
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6 pb-6">
        <div role="group" aria-label="서비스 분류" className="flex flex-wrap gap-x-6 gap-y-1">
          {[{ id: "all", label: "전체" }, ...groups].map((x) => (
            <button key={x.id} type="button" aria-pressed={g === x.id} onClick={() => setG(x.id)}
              className={`min-h-11 border-b-2 py-2 text-[0.92rem] font-medium transition-colors ${g === x.id ? "border-accent text-navy" : "border-transparent text-mute hover:text-navy"}`}>{x.label}</button>
          ))}
        </div>
        <div className="w-full sm:w-72">
          <label htmlFor="svc-q" className="sr-only">서비스 검색</label>
          <input id="svc-q" type="search" className="field !py-2.5" placeholder="서비스 검색 (예: 쇼핑몰, SEO)" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{list.length}개 서비스</p>
      {list.length === 0 ? (
        <p className="border-t border-navy py-20 text-center text-mute">검색 결과가 없습니다. 다른 키워드로 찾아보시거나 <Link href="/contact" className="u-link text-accent">상담 신청</Link>으로 문의해 주세요.</p>
      ) : (
        <ol className="border-t border-navy">
          {list.map((s) => (
            <li key={s.slug} className="border-b border-line">
              <Link href={`/services/${s.slug}`} className="row-hover group grid gap-x-8 gap-y-3 py-7 md:grid-cols-12 md:py-9">
                <span className="t-label pt-2 text-accent md:col-span-1">{s.no}</span>
                <div className="md:col-span-4"><h2 className="text-[1.5rem] font-semibold tracking-tight md:text-[1.75rem]"><span className="u-link">{s.name}</span></h2><p className="t-label mt-3 text-mute" style={{ letterSpacing: ".1em" }}>{s.en}</p></div>
                <p className="t-body text-mute md:col-span-5">{s.summary}</p>
                <div className="flex items-start justify-between gap-4 md:col-span-2 md:justify-end">
                  {s.featured && <span className="t-label bg-navy px-2.5 py-2 text-white" style={{ fontSize: ".62rem" }}>MAIN</span>}
                  <Arrow className="mt-2 text-navy transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
