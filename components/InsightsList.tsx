"use client";
import Link from "next/link";
import { useState } from "react";
import type { Post } from "@/content/posts";

export function InsightsList({ posts, categories }: { posts: Post[]; categories: readonly string[] }) {
  const [cat, setCat] = useState("전체");
  const [q, setQ] = useState("");
  const t = q.trim().toLowerCase();
  const list = posts.filter((p) => (cat === "전체" || p.category === cat) && (!t || `${p.title} ${p.excerpt}`.toLowerCase().includes(t)));
  return (
    <div>
      <div role="group" aria-label="카테고리 필터" className="flex flex-wrap gap-x-6 gap-y-1 border-b border-line pb-4">
        {["전체", ...categories].map((c) => (
          <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}
            className={`min-h-11 border-b-2 py-2 text-[0.92rem] font-medium transition-colors ${cat === c ? "border-accent text-navy" : "border-transparent text-mute hover:text-navy"}`}>{c}</button>
        ))}
      </div>
      <div className="mt-5 max-w-sm"><label htmlFor="post-q" className="sr-only">글 검색</label><input id="post-q" type="search" className="field !py-2.5" placeholder="글 검색 (예: 비용, SEO)" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      {list.length === 0 ? <p className="py-24 text-center text-mute">조건에 맞는 글이 없습니다.</p> : (
        <ul>
          {list.map((p) => (
            <li key={p.slug} className="border-b border-line">
              <Link href={`/insights/${p.slug}`} className="group grid gap-x-10 gap-y-2 py-9 md:grid-cols-12">
                <div className="md:col-span-3"><p className="t-label text-accent" style={{ letterSpacing: ".08em" }}>{p.category}</p><p className="t-label mt-3 text-mute">{p.publishedAt.replaceAll("-", ".")}</p></div>
                <div className="md:col-span-9"><h2 className="text-[1.45rem] font-semibold leading-snug tracking-tight md:text-[1.85rem]"><span className="u-link">{p.title}</span></h2><p className="t-body mt-3 max-w-2xl text-mute">{p.excerpt}</p></div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
