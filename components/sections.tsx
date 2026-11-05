import Link from "next/link";
import type { Pkg } from "@/content/packages";
import type { Project } from "@/content/portfolio";
import { processSteps } from "@/content/process";
import { ConceptScreen } from "./visuals/Screens";
import { Arrow, Button, Label, contactHref } from "./ui";
import { Reveal } from "./Reveal";

/** 프로젝트 이미지: imageUrl 이 있으면 실제 이미지, 없으면 콘셉트 화면. ratio 로 편집형 크롭을 조절합니다. */
export function ProjectVisual({ p, ratio = "16 / 10", priority = false }: { p: Project; ratio?: string; priority?: boolean }) {
  const alt = `${p.isConcept ? "Concept Project — " : ""}${p.title}, ${p.industry} ${p.type} 화면`;
  const [rw, rh] = ratio.split("/").map((x) => parseFloat(x));
  const tall = rw / rh < 1.5;
  return (
    <div>
    <div className="zoom-wrap relative w-full bg-line" style={{ aspectRatio: ratio }}>
      <div className="absolute inset-0">
        {p.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.imageUrl} alt={alt} className="h-full w-full object-cover" loading={priority ? "eager" : "lazy"} />
        ) : (
          // 세로로 긴 프레임: 높이에 맞춰 키우고 좌우를 크롭(에디토리얼 크롭), 가로형: 폭에 맞춤
          tall ? (
            <div className="absolute left-0 top-0 h-full" style={{ aspectRatio: "16 / 10" }}><ConceptScreen kind={p.visual} alt={alt} /></div>
          ) : (
            <ConceptScreen kind={p.visual} alt={alt} />
          )
        )}
      </div>
    </div>
    </div>
  );
}

export function ProjectMeta({ p }: { p: Project }) {
  return (
    <div className="mt-5 flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
      <div>
        <h3 className="text-[1.35rem] font-semibold tracking-tight md:text-[1.6rem]"><span className="u-link">{p.title}</span></h3>
        <p className="t-small mt-1 text-mute">{p.industry} · {p.type}</p>
      </div>
      <div className="flex items-center gap-3">
        {p.isConcept && <span className="t-label border border-line px-2.5 py-2 text-mute" style={{ fontSize: "0.65rem" }}>Concept Project</span>}
        <Arrow className="text-accent transition-transform duration-300 group-hover:translate-x-1.5" />
      </div>
    </div>
  );
}

export function ProcessList({ detailed = false }: { detailed?: boolean }) {
  return (
    <ol className="divide-y divide-white/15 border-y border-white/15">
      {processSteps.map((s) => (
        <li key={s.no}>
          <Reveal className="grid gap-x-10 gap-y-4 py-8 md:grid-cols-12 md:py-10">
            <div className="group flex items-start gap-4 md:col-span-5">
              <span className="w-9 shrink-0 self-start pt-2 text-[0.85rem] tabular-nums text-white/40">{s.no}</span>
              <div>
                <h3 className="t-sub font-medium" style={{ fontSize: "clamp(1.5rem,1rem+1.3vw,2rem)", letterSpacing: "-0.02em" }}>{s.en}</h3>
                <p className="mt-1 text-[0.95rem] text-white/55">{s.ko}</p>
              </div>
            </div>
            <div className="md:col-span-7">
              <p className="t-body text-white/75">{s.summary}</p>
              {detailed && (
                <div className="mt-7 grid gap-8 sm:grid-cols-2">
                  <div>
                    <p className="t-label text-white/45">고객이 준비할 자료</p>
                    <ul className="mt-3 space-y-1.5 text-[0.95rem] text-white/80">{s.client.map((c) => <li key={c} className="flex gap-2"><span aria-hidden className="text-white/35">—</span>{c}</li>)}</ul>
                  </div>
                  <div>
                    <p className="t-label text-[#8db2ff]">회사가 제공하는 결과물</p>
                    <ul className="mt-3 space-y-1.5 text-[0.95rem] text-white/80">{s.deliver.map((c) => <li key={c} className="flex gap-2"><span aria-hidden className="text-[#8db2ff]">—</span>{c}</li>)}</ul>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

export function PricingTable({ packages, notice }: { packages: Pkg[]; notice: string }) {
  return (
    <div>
      <div className="grid border-line md:grid-cols-2 xl:grid-cols-4" style={{ borderTopWidth: 1, borderLeftWidth: 1 }}>
        {packages.map((p) => (
          <article key={p.id} className={`flex flex-col border-b border-r border-line p-7 md:p-9 ${p.highlight ? "on-dark bg-navy text-white shadow-[inset_0_3px_0_0_#2864d8]" : "bg-white"}`}>
            <p className={`t-label ${p.highlight ? "text-[#8db2ff]" : "text-accent"}`}>{p.name}</p>
            <p className={`mt-4 min-h-[3.2rem] text-[0.95rem] ${p.highlight ? "text-white/70" : "text-mute"}`}>{p.target}</p>
            <p className="mt-6 text-[1.9rem] font-semibold tracking-[-0.03em]">{p.priceLabel}</p>
            <ul className={`mt-8 flex-1 space-y-3 border-t pt-7 text-[0.95rem] ${p.highlight ? "border-white/15" : "border-line"}`}>
              {p.features.map((f) => (
                <li key={f} className="flex gap-3"><span aria-hidden className={p.highlight ? "text-[#8db2ff]" : "text-accent"}>—</span><span>{f}</span></li>
              ))}
            </ul>
            <Link
              href={contactHref({ package: p.id })}
              className={`group mt-10 inline-flex min-h-12 items-center justify-between gap-3 border px-5 font-semibold transition-colors duration-300 ${
                p.highlight ? "border-white bg-white text-navy hover:bg-off" : "border-navy hover:bg-navy hover:text-white"
              }`}
            >
              이 패키지로 상담하기 <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </article>
        ))}
      </div>
      <p className="t-small mt-6 max-w-3xl text-mute">{notice}</p>
    </div>
  );
}

export function FinalCta({ service, title = "좋은 프로젝트는\n좋은 대화에서 시작됩니다.", button = "프로젝트 문의하기", extra }: { service?: string; title?: string; button?: string; extra?: string }) {
  return (
    <section className="on-dark relative overflow-hidden bg-deep py-24 text-white md:py-36" aria-labelledby="cta-title">
      <div aria-hidden className="grid-lines absolute inset-0 opacity-60" />
      <div className="wrap relative grid gap-12 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <Label className="text-[#8db2ff]">Start a project</Label>
          <h2 id="cta-title" className="t-hero mt-6 whitespace-pre-line" style={{ fontSize: "clamp(2.25rem,1.2rem+4.4vw,4.75rem)" }}>{title}</h2>
        </div>
        <div className="md:col-span-4">
          <p className="t-body text-white/70">{extra ?? "새로운 홈페이지 제작부터 기존 웹사이트의 개선까지, 프로젝트의 목적과 고민을 공유해 주십시오."}</p>
          <Button href={contactHref(service ? { service } : {})} size="lg" variant="light" className="mt-8">{button}</Button>
        </div>
      </div>
    </section>
  );
}
