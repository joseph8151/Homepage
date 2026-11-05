"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { contentStates, evaluate, featureOptions, pageSizes, projectTypes } from "@/lib/estimate";
import { Arrow } from "./ui";

type Svc = { slug: string; name: string };
const Opt = ({ on, children, onClick, kind }: { on: boolean; children: React.ReactNode; onClick: () => void; kind: "radio" | "checkbox" }) => (
  <button type="button" role={kind} aria-checked={on} onClick={onClick}
    className={`flex min-h-14 w-full items-center gap-4 border px-5 py-3 text-left transition-colors ${on ? "border-accent bg-[#f1f5fd]" : "border-line bg-white hover:border-[#9fb0c5]"}`}>
    <span aria-hidden className={`flex h-5 w-5 shrink-0 items-center justify-center border ${kind === "radio" ? "rounded-full" : ""} ${on ? "border-accent bg-accent" : "border-[#9fb0c5]"}`}>{on && <i className="h-1.5 w-1.5 bg-white" style={{ borderRadius: kind === "radio" ? 9 : 0 }} />}</span>
    <span className="text-[0.98rem]">{children}</span>
  </button>
);

export function Estimator({ services, packageNames }: { services: Svc[]; packageNames: Record<string, string> }) {
  const [type, setType] = useState(""); const [pages, setPages] = useState(""); const [feats, setFeats] = useState<string[]>([]); const [content, setContent] = useState("");
  const done = type && pages && content;
  const r = useMemo(() => (done ? evaluate({ type, pages, features: feats, content }) : null), [done, type, pages, feats, content]);
  const toggle = (id: string) => setFeats((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  const Q = ({ n, t, children }: { n: string; t: string; children: React.ReactNode }) => (
    <fieldset className="border-t border-navy pt-6"><legend className="sr-only">{t}</legend>
      <p className="t-label text-accent">{n}</p><h2 className="mt-2 text-[1.35rem] font-semibold tracking-tight">{t}</h2><div className="mt-5 grid gap-2 sm:grid-cols-2">{children}</div></fieldset>
  );
  const href = r ? `/contact?${new URLSearchParams({ package: r.pkg, service: r.services.join(","), note: r.summary })}` : "#";
  return (
    <div className="grid gap-14 lg:grid-cols-12">
      <div className="space-y-12 lg:col-span-7">
        <Q n="01" t="어떤 사이트를 만드시나요?">{projectTypes.map((o) => <Opt key={o.id} kind="radio" on={type === o.id} onClick={() => setType(o.id)}>{o.label}</Opt>)}</Q>
        <Q n="02" t="예상 페이지 규모는?">{pageSizes.map((o) => <Opt key={o.id} kind="radio" on={pages === o.id} onClick={() => setPages(o.id)}>{o.label}</Opt>)}</Q>
        <Q n="03" t="필요한 기능을 모두 선택하세요 (복수 선택)">{featureOptions.map((o) => <Opt key={o.id} kind="checkbox" on={feats.includes(o.id)} onClick={() => toggle(o.id)}>{o.label}</Opt>)}</Q>
        <Q n="04" t="콘텐츠(문구·이미지) 준비 상태는?">{contentStates.map((o) => <Opt key={o.id} kind="radio" on={content === o.id} onClick={() => setContent(o.id)}>{o.label}</Opt>)}</Q>
      </div>
      <aside className="lg:col-span-5" aria-live="polite" aria-label="진단 결과">
        <div className="on-dark bg-navy p-8 text-white lg:sticky lg:top-28 md:p-10">
          {!r ? (
            <><p className="t-label text-[#8db2ff]">Result</p><p className="t-sub mt-4" style={{ fontSize: "1.5rem" }}>01·02·04번 질문에 답하면 결과가 나타납니다.</p><p className="t-small mt-4 text-white/60">진단은 규모 수준과 권장 패키지를 보여주는 참고 자료이며, 가격이나 기간을 산정하지 않습니다.</p></>
          ) : (
            <>
              <p className="t-label text-[#8db2ff]">진단 수준</p>
              <p className="mt-3 text-[2.6rem] font-semibold leading-none tracking-[-0.03em]">{r.level.name}</p>
              <p className="t-small mt-4 text-white/70">{r.level.desc}</p>
              <p className="t-label mt-8 text-[#8db2ff]">권장 패키지</p>
              <p className="mt-2 text-xl font-semibold tracking-[0.06em]">{packageNames[r.pkg] ?? r.pkg.toUpperCase()}</p>
              <p className="t-label mt-8 text-[#8db2ff]">관련 서비스</p>
              <ul className="mt-3 space-y-1.5 text-[0.95rem]">{r.services.map((s) => { const sv = services.find((x) => x.slug === s); return sv ? <li key={s}><Link href={`/services/${s}`} className="u-link">{sv.name}</Link></li> : null; })}</ul>
              {r.notes.length > 0 && (<><p className="t-label mt-8 text-[#8db2ff]">확인할 점</p><ul className="mt-3 space-y-2 text-[0.88rem] text-white/70">{r.notes.map((n) => <li key={n} className="flex gap-2"><span aria-hidden className="text-white/35">—</span>{n}</li>)}</ul></>)}
              <Link href={href} className="group mt-10 flex min-h-14 items-center justify-between bg-white px-6 font-semibold text-navy transition-colors hover:bg-off">이 내용으로 상담하기 <Arrow className="transition-transform duration-300 group-hover:translate-x-1" /></Link>
              <p className="t-small mt-4 text-white/45">참고용 진단입니다. 실제 범위·비용·기간은 요구사항 확인 후 확정됩니다.</p>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
