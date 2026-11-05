import Link from "next/link";
import { glossary } from "@/content/glossary";
import { PageHead } from "@/components/ui";
import { FinalCta } from "@/components/sections";
import { JsonLd } from "@/components/JsonLd";
import { meta } from "@/lib/seo";
import { SITE_URL } from "@/content/site";

export const metadata = meta({
  title: "홈페이지 제작 용어 사전 | 반응형·SEO·CMS·PG·도메인 용어 정리",
  description: "반응형 웹, SEO, CMS, canonical, 사이트맵, 301 리디렉션, PG, 도메인·DNS, 웹 접근성 등 홈페이지 제작과 운영에 자주 나오는 용어를 쉽게 설명합니다.",
  path: "/glossary",
  keywords: ["홈페이지 제작 용어", "SEO란", "반응형 웹이란", "CMS란", "PG란", "도메인 DNS 차이", "301 리디렉션 뜻", "웹 접근성이란"],
});

const id = (n: string) => encodeURIComponent(n.replace(/\s*\(.*\)/, "").replace(/\s+/g, "-").toLowerCase());

export default function Glossary() {
  const sorted = [...glossary].sort((a, b) => a.name.localeCompare(b.name, "ko"));
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "DefinedTermSet", name: "홈페이지 제작 용어 사전", url: `${SITE_URL}/glossary`,
        hasDefinedTerm: sorted.map((t) => ({ "@type": "DefinedTerm", name: t.name, alternateName: t.en, description: t.def, url: `${SITE_URL}/glossary#${id(t.name)}` })) }} />
      <PageHead label="Glossary" title={<>제작 전에 알아두면<br />편한 용어들.</>} lead="견적서와 상담에서 자주 마주치는 용어를 쉬운 말로 정리했습니다. 정의는 일반적인 설명이며 서비스와 제도는 변경될 수 있습니다." />
      <section className="bg-white py-16 md:py-24"><div className="wrap">
        <nav aria-label="용어 바로가기" className="mb-14 flex flex-wrap gap-2">
          {sorted.map((t) => <a key={t.name} href={`#${id(t.name)}`} className="border border-line px-3 py-1.5 text-[0.85rem] text-mute transition-colors hover:border-navy hover:text-navy">{t.name.replace(/\s*\(.*\)/, "")}</a>)}
        </nav>
        <dl className="border-t border-navy">
          {sorted.map((t) => (
            <div key={t.name} id={id(t.name)} className="scroll-mt-28 grid gap-x-10 gap-y-3 border-b border-line py-8 md:grid-cols-12">
              <dt className="md:col-span-4"><span className="text-[1.35rem] font-semibold tracking-tight">{t.name}</span><span className="t-label mt-2 block text-mute" style={{ letterSpacing: ".08em" }}>{t.en}</span></dt>
              <dd className="md:col-span-8"><p className="t-body text-mute">{t.def}</p>
                {(t.service || t.post) && <p className="t-small mt-4 flex flex-wrap gap-x-5 gap-y-1">
                  {t.service && <Link className="u-link font-semibold text-accent" href={`/services/${t.service}`}>관련 서비스 →</Link>}
                  {t.post && <Link className="u-link font-semibold text-accent" href={`/insights/${t.post}`}>관련 글 →</Link>}</p>}</dd>
            </div>
          ))}
        </dl>
      </div></section>
      <FinalCta />
    </>
  );
}
