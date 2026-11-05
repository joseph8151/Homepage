import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSolution, solutions } from "@/content/solutions";
import { getPosts, getServices } from "@/lib/content";
import { Arrow, Label, contactHref } from "@/components/ui";
import { FinalCta } from "@/components/sections";
import { FaqSection } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { meta } from "@/lib/seo";
import { SITE_URL } from "@/content/site";

export const generateStaticParams = () => solutions.map((s) => ({ slug: s.slug }));
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = getSolution((await params).slug);
  return s ? meta({ title: s.title, description: s.description, path: `/solutions/${s.slug}`, keywords: s.keywords }) : {};
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const sol = getSolution((await params).slug);
  if (!sol) notFound();
  const [services, posts] = await Promise.all([getServices(), getPosts()]);
  const svc = sol.services.map((x) => services.find((s) => s.slug === x)).filter(Boolean) as typeof services;
  const guide = sol.posts.map((x) => posts.find((p) => p.slug === x)).filter(Boolean) as typeof posts;
  const others = solutions.filter((s) => s.slug !== sol.slug).slice(0, 4);
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "업종별 가이드", item: `${SITE_URL}/solutions` },
        { "@type": "ListItem", position: 3, name: sol.name, item: `${SITE_URL}/solutions/${sol.slug}` }] }} />
      <header className="bg-off pb-16 pt-36 md:pb-24 md:pt-48">
        <div className="wrap">
          <nav aria-label="경로" className="t-label text-mute"><Link href="/solutions" className="u-link">Solutions</Link> / {sol.name}</nav>
          <h1 className="t-hero mt-8 whitespace-pre-line" style={{ fontSize: "clamp(2.1rem,1.1rem+4vw,4.25rem)" }}>{sol.h1}</h1>
          <p className="t-body mt-8 max-w-2xl text-mute">{sol.intro}</p>
        </div>
      </header>

      <div className="wrap grid gap-16 py-20 md:py-28 lg:grid-cols-12">
        <div className="space-y-20 lg:col-span-8">
          <section aria-labelledby="w"><Label className="text-accent">Concerns</Label><h2 id="w" className="mt-4 text-[1.5rem] font-semibold tracking-tight">이런 고민이 있으신가요?</h2>
            <ul className="mt-6 border-t border-navy">{sol.worries.map((x) => <li key={x} className="flex gap-4 border-b border-line py-4"><span aria-hidden className="text-accent">—</span>{x}</li>)}</ul></section>
          <section aria-labelledby="p"><Label className="text-accent">Structure</Label><h2 id="p" className="mt-4 text-[1.5rem] font-semibold tracking-tight">{sol.name} 홈페이지에 필요한 페이지 구성</h2>
            <ol className="mt-6 border-t border-navy">{sol.pages.map((x, i) => <li key={x} className="grid grid-cols-[2.5rem_1fr] border-b border-line py-4"><span className="t-label pt-1.5 text-mute">{i + 1}</span>{x}</li>)}</ol></section>
          <section aria-labelledby="f"><Label className="text-accent">Features</Label><h2 id="f" className="mt-4 text-[1.5rem] font-semibold tracking-tight">권장 기능</h2>
            <ul className="mt-6 grid border-t border-navy sm:grid-cols-2">{sol.features.map((x) => <li key={x} className="flex gap-3 border-b border-line py-4 sm:pr-6"><span aria-hidden className="text-accent">—</span>{x}</li>)}</ul></section>
          <section aria-labelledby="c" className="border-l-2 border-accent bg-off p-7"><h2 id="c" className="text-[1.15rem] font-semibold">제작 전 확인할 점</h2>
            <ul className="mt-4 space-y-3 text-[0.97rem] text-navy/80">{sol.cautions.map((x) => <li key={x}>· {x}</li>)}</ul></section>
        </div>
        <aside className="lg:col-span-4" aria-label="관련 정보">
          <div className="space-y-10 lg:sticky lg:top-28">
            <div className="on-dark bg-navy p-8 text-white"><p className="t-label text-[#8db2ff]">Consultation</p><p className="t-sub mt-3" style={{ fontSize: "1.4rem" }}>{sol.name} 프로젝트 상담</p><p className="t-small mt-3 text-white/65">제작 비용과 기간은 요구사항 확인 후 확정됩니다.</p>
              <Link href={contactHref({ service: sol.services.join(",") })} className="group mt-7 flex min-h-12 items-center justify-between bg-white px-5 font-semibold text-navy hover:bg-off">제작 상담 신청 <Arrow className="transition-transform group-hover:translate-x-1" /></Link></div>
            <div><p className="t-label text-mute">관련 서비스</p><ul className="mt-4 border-t border-navy">{svc.map((s) => <li key={s.slug} className="border-b border-line"><Link href={`/services/${s.slug}`} className="group flex items-center justify-between py-3.5"><span className="font-medium"><span className="u-link">{s.name}</span></span><Arrow className="transition-transform group-hover:translate-x-1" /></Link></li>)}</ul></div>
            {guide.length > 0 && <div><p className="t-label text-mute">함께 읽을 글</p><ul className="mt-4 border-t border-navy">{guide.map((p) => <li key={p.slug} className="border-b border-line"><Link href={`/insights/${p.slug}`} className="group block py-3.5 font-medium leading-snug"><span className="u-link">{p.title}</span></Link></li>)}</ul></div>}
          </div>
        </aside>
      </div>

      <FaqSection items={sol.faq.map((f) => ({ ...f, tags: [] }))} title={`${sol.name} 홈페이지 제작 질문`} bg="bg-off" />
      <section className="bg-white py-16"><div className="wrap"><p className="t-label text-mute">다른 업종 가이드</p>
        <ul className="mt-6 grid border-t border-navy sm:grid-cols-2 lg:grid-cols-4">{others.map((s) => <li key={s.slug} className="border-b border-line lg:border-r lg:last:border-r-0 lg:px-5 lg:first:pl-0"><Link href={`/solutions/${s.slug}`} className="group flex items-center justify-between py-5 font-semibold"><span className="u-link">{s.name}</span><Arrow className="transition-transform group-hover:translate-x-1" /></Link></li>)}</ul></div></section>
      <FinalCta service={sol.services[0]} />
    </>
  );
}
