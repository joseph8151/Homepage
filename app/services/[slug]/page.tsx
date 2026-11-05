import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getService, getServices } from "@/lib/content";
import { defaultServices } from "@/content/services";
import { Arrow, Button, Label, contactHref } from "@/components/ui";
import { FinalCta } from "@/components/sections";
import { JsonLd } from "@/components/JsonLd";
import { meta } from "@/lib/seo";
import { SITE_URL } from "@/content/site";
import { faqs } from "@/content/faq";
import { FaqSection } from "@/components/Faq";

export const revalidate = 60;
export const generateStaticParams = () => defaultServices.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = await getService((await params).slug);
  if (!s) return {};
  return meta({ title: `${s.name} | ${s.en}`, description: `${s.summary} ${s.problem}`.slice(0, 150), path: `/services/${s.slug}` });
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [s, all] = await Promise.all([getService(slug), getServices()]);
  if (!s) notFound();
  const idx = all.findIndex((x) => x.slug === s.slug);
  const related = [all[(idx + 1) % all.length], all[(idx + 2) % all.length], all[(idx + 3) % all.length]];

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Service", name: s.name, alternateName: s.en, description: s.summary,
        serviceType: s.en, areaServed: "KR", url: `${SITE_URL}/services/${s.slug}`,
      }} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "서비스", item: `${SITE_URL}/services` },
          { "@type": "ListItem", position: 3, name: s.name, item: `${SITE_URL}/services/${s.slug}` },
        ],
      }} />

      <header className="bg-off pb-16 pt-36 md:pb-24 md:pt-48">
        <div className="wrap">
          <nav aria-label="경로" className="t-label text-mute"><Link href="/services" className="u-link">Services</Link> <span aria-hidden>/</span> {s.no}</nav>
          <div className="mt-8 grid gap-10 md:grid-cols-12">
            <div className="md:col-span-8">
              <p className="t-label text-accent">{s.en}</p>
              <h1 className="t-hero mt-5" style={{ fontSize: "clamp(2.25rem,1.2rem+4.4vw,4.5rem)" }}>{s.name}</h1>
            </div>
            <p className="t-body text-mute md:col-span-4 md:self-end">{s.summary}</p>
          </div>
        </div>
      </header>

      <div className="wrap grid gap-16 py-20 md:py-28 lg:grid-cols-12">
        <div className="space-y-24 lg:col-span-8">
          <section aria-labelledby="problem">
            <Label className="text-accent">Problem</Label>
            <h2 id="problem" className="t-sub mt-6" style={{ fontSize: "clamp(1.6rem,1rem+2vw,2.5rem)" }}>“{s.problem}”</h2>
            <p className="t-body mt-8 max-w-2xl text-mute">{s.description}</p>
          </section>

          <section aria-labelledby="features">
            <Label className="text-accent">Key features</Label>
            <h2 id="features" className="sr-only">주요 기능</h2>
            <ul className="mt-6 grid border-t border-navy sm:grid-cols-2">
              {s.features.map((f, i) => (
                <li key={f} className="flex gap-4 border-b border-line py-5 sm:pr-6">
                  <span className="t-label pt-1.5 text-accent">0{i + 1}</span><span className="font-medium">{f}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="scope" className="grid gap-12 md:grid-cols-2">
            <div>
              <Label className="text-accent">Scope</Label>
              <h2 id="scope" className="mt-4 text-[1.4rem] font-semibold tracking-tight">제작 범위</h2>
              <ol className="mt-6 space-y-3">
                {s.scope.map((x, i) => <li key={x} className="flex gap-4 border-t border-line pt-3 text-[0.95rem]"><span className="t-label pt-1 text-mute">{i + 1}</span>{x}</li>)}
              </ol>
            </div>
            <div>
              <Label className="text-accent">Audience</Label>
              <h2 className="mt-4 text-[1.4rem] font-semibold tracking-tight">적합한 고객</h2>
              <ul className="mt-6 space-y-3">
                {s.audience.map((x) => <li key={x} className="flex gap-4 border-t border-line pt-3 text-[0.95rem]"><span aria-hidden className="text-accent">—</span>{x}</li>)}
              </ul>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4" aria-label="일정 및 가격 안내">
          <div className="on-dark bg-navy p-8 text-white lg:sticky lg:top-28">
            <p className="t-label text-[#8db2ff]">Schedule</p>
            <p className="mt-3 text-[1rem] text-white/85">{s.timeline}</p>
            <p className="t-label mt-8 text-[#8db2ff]">Pricing</p>
            <p className="mt-3 text-[2rem] font-bold tracking-tight">{s.priceLabel}</p>
            <p className="t-small mt-3 text-white/60">{s.priceNote}</p>
            <Button href={contactHref({ service: s.slug })} variant="light" className="mt-8 w-full justify-between">제작 상담 신청</Button>
          </div>
        </aside>
      </div>

      <FaqSection items={faqs.filter((f) => f.tags.includes("service") || (s.slug === "seo" && f.tags.includes("seo")) || (s.slug === "ecommerce" && f.tags.includes("commerce"))).slice(0, 6)} title="이 서비스에 대한 질문" />
      <section className="bg-off py-20 md:py-24" aria-labelledby="rel">
        <div className="wrap">
          <h2 id="rel" className="t-label text-mute">Related services</h2>
          <ul className="mt-8 grid border-t border-navy md:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug} className="border-b border-line md:border-r md:last:border-r-0 md:px-6 md:first:pl-0">
                <Link href={`/services/${r.slug}`} className="group flex items-start justify-between gap-4 py-6">
                  <div><p className="t-label text-mute">{r.no}</p><p className="mt-2 text-[1.15rem] font-semibold"><span className="u-link">{r.name}</span></p><p className="t-small mt-1 text-mute">{r.en}</p></div>
                  <Arrow className="mt-1 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <FinalCta service={s.slug} title={"이 프로젝트에 대해\n이야기해 보시겠어요?"} button="제작 상담 신청" />
    </>
  );
}
