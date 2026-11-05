import Link from "next/link";
import { getPackages, getPosts, getProjects, getServices } from "@/lib/content";
import { featuredSlugs } from "@/content/services";
import { whyPoints } from "@/content/process";
import { packageNotice } from "@/content/packages";
import { HeroDemo } from "@/components/visuals/Screens";
import { Arrow, Button, Label, contactHref } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { FinalCta, PricingTable, ProcessList, ProjectMeta, ProjectVisual } from "@/components/sections";
import { meta } from "@/lib/seo";

export const revalidate = 60;
export const metadata = meta({
  title: "홈페이지 제작 전문 | 기업 홈페이지·쇼핑몰·랜딩페이지·SEO",
  description: "기업 홈페이지 제작, 쇼핑몰, 랜딩페이지, 홈페이지 리뉴얼, SEO까지. 디자인과 기술, 비즈니스 전략을 결합해 성과를 설계하는 홈페이지 제작 전문기업.",
  path: "/",
});

const keywords = ["WEB DESIGN", "DEVELOPMENT", "E-COMMERCE", "SEO", "DIGITAL STRATEGY"];
const intro = [
  "브랜드에 맞는 맞춤 디자인",
  "사용자 경험을 고려한 구조 설계",
  "모바일 중심 반응형 최적화",
  "검색엔진 최적화",
  "확장 가능한 개발 구조",
  "제작 이후 운영 및 유지관리",
];

export default async function Home() {
  const [services, packages, projects, posts] = await Promise.all([getServices(), getPackages(), getProjects(), getPosts()]);
  const featured = featuredSlugs.map((s) => services.find((x) => x.slug === s)!).filter(Boolean);
  const rest = services.filter((s) => !featuredSlugs.includes(s.slug));
  const showcase = projects.slice(0, 3);

  return (
    <>
      {/* 01 HERO */}
      <section className="on-dark relative overflow-hidden bg-deep text-white" aria-labelledby="hero-title">
        <div aria-hidden className="hero-lift absolute inset-0" />
        <div aria-hidden className="grid-lines absolute inset-0" />
        <div className="wrap relative grid gap-16 pb-36 pt-36 md:pt-44 lg:grid-cols-12 lg:gap-10 lg:pb-44">
          <div className="lg:col-span-7">
            <Label className="text-[#8db2ff]">Digital experiences. Built for business.</Label>
            <h1 id="hero-title" className="t-hero mt-8">
              <span className="block">웹사이트를 넘어,</span>
              <span className="block">비즈니스의 성과를</span>
              <span className="block">설계합니다.</span>
            </h1>
            <p className="t-body mt-9 max-w-xl text-white/70">
              기업 홈페이지부터 쇼핑몰, 랜딩페이지, SEO까지.<br className="hidden sm:block" />
              디자인과 기술, 비즈니스 전략을 결합하여 기업의 디지털 경쟁력을 구축합니다.
            </p>
            <div className="mt-11 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact" size="lg">프로젝트 상담하기</Button>
              <Button href="/portfolio" size="lg" variant="outline">제작 사례 살펴보기</Button>
            </div>
          </div>
          <div className="lg:col-span-5 lg:pt-8">
            <div className="mx-auto max-w-[640px] pl-4 pt-9 sm:pl-8 lg:-ml-10 lg:w-[calc(100%+2.5rem)] lg:max-w-none lg:pl-0">
              <HeroDemo />
            </div>
          </div>
        </div>
        <div className="rule-dark absolute inset-x-0 bottom-0 border-t">
          <div className="wrap flex h-16 items-center justify-between gap-6">
            <ul className="flex flex-wrap gap-x-6 gap-y-1 overflow-hidden text-[0.7rem] font-semibold tracking-[0.18em] text-white/55 sm:gap-x-10 [&>li:nth-child(n+4)]:hidden sm:[&>li:nth-child(n+4)]:block">
              {keywords.map((k, i) => <li key={k} className="whitespace-nowrap">{k}{i < keywords.length - 1 && <span aria-hidden className="ml-6 hidden text-white/25 sm:ml-10 sm:inline">/</span>}</li>)}
            </ul>
            <a href="#intro" aria-label="아래로 스크롤" className="hidden items-center gap-3 text-[0.7rem] tracking-[0.18em] text-white/55 lg:flex">
              SCROLL <span className="scroll-cue relative block h-8 w-px overflow-hidden bg-white/20 text-white" />
            </a>
          </div>
        </div>
      </section>

      {/* 02 INTRODUCTION */}
      <section id="intro" className="bg-white py-20 md:py-32" aria-labelledby="intro-title">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal><Label className="text-accent">What we do</Label></Reveal>
              <Reveal delay={80}>
                <h2 id="intro-title" className="t-section mt-6">디자인의 완성도와<br />비즈니스의 목적을<br />연결합니다.</h2>
              </Reveal>
            </div>
            <div className="space-y-6 lg:col-span-4 lg:col-start-9 lg:pt-24">
              <Reveal delay={120}><p className="t-body text-mute">홈페이지는 완성된 순간이 아니라, 방문자가 문의라는 행동을 하는 순간에 비로소 제 역할을 합니다. 우리는 화면을 꾸미기 전에 이 사이트가 어떤 일을 해야 하는지부터 정의합니다.</p></Reveal>
              <Reveal delay={180}><p className="t-body text-mute">같은 템플릿에 로고만 바꾸는 방식이 아니라, 사업의 구조와 고객의 판단 과정에 맞춰 정보 구조와 디자인, 개발을 하나의 기준으로 설계합니다.</p></Reveal>
              <Reveal delay={240}><p className="t-body text-mute">출시는 끝이 아니라 시작입니다. 검색 노출을 위한 기술 구조, 수정이 쉬운 관리 환경, 이후의 운영과 유지관리까지 함께 고려합니다.</p></Reveal>
            </div>
          </div>
          <ul className="mt-20 grid border-t border-line md:mt-28 md:grid-cols-2 lg:grid-cols-3">
            {intro.map((t, i) => (
              <li key={t} className="border-b border-line py-6 md:py-8 lg:[&:nth-child(3n+1)]:pl-0 lg:pl-8 lg:[&:not(:nth-child(3n+1))]:border-l md:[&:nth-child(even)]:border-l md:[&:nth-child(even)]:pl-8 md:[&:nth-child(odd)]:pl-0 lg:[&:nth-child(even)]:pl-8">
                <Reveal delay={i * 50} className="flex items-baseline gap-5">
                  <span className="t-label text-accent">0{i + 1}</span>
                  <span className="text-[1.15rem] font-semibold tracking-tight">{t}</span>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 03 SERVICES */}
      <section className="bg-off py-20 md:py-32" aria-labelledby="svc-title">
        <div className="wrap">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-8">
              <Label className="text-accent">Services</Label>
              <h2 id="svc-title" className="t-section mt-6">서비스의 범위는 넓게,<br />완성도의 기준은 높게.</h2>
            </div>
            <div className="md:col-span-4 md:self-end"><Button href="/services" variant="ghost" className="!px-0 text-navy">전체 서비스 보기</Button></div>
          </div>

          <ol className="mt-16 border-t border-navy md:mt-24">
            {featured.map((s, i) => (
              <li key={s.slug} className="border-b border-line">
                <Link href={`/services/${s.slug}`} className="row-hover group grid gap-x-10 gap-y-5 py-9 md:grid-cols-12 md:py-12">
                  <span className="t-label pt-3 text-accent md:col-span-1">0{i + 1}</span>
                  <div className="md:col-span-5">
                    <h3 className="t-sub transition-transform duration-500 group-hover:translate-x-2" style={{ fontSize: "clamp(1.85rem,1.1rem+2.4vw,3.25rem)" }}>{s.name}</h3>
                    <p className="t-label mt-4 text-mute">{s.en}</p>
                  </div>
                  <div className="md:col-span-5">
                    <p className="t-body text-mute">{s.summary}</p>
                    <p className="t-small mt-4 text-navy/70">{s.features.slice(0, 3).join(" · ")}</p>
                  </div>
                  <span className="hidden items-start justify-end pt-3 md:col-span-1 md:flex"><Arrow className="text-navy transition-transform duration-300 group-hover:translate-x-2" /></span>
                </Link>
              </li>
            ))}
          </ol>

          <div className="mt-20 grid gap-10 md:grid-cols-12">
            <p className="t-label text-mute md:col-span-3">More services — {rest.length}</p>
            <ul className="grid gap-x-12 md:col-span-9 md:grid-cols-2">
              {rest.map((s) => (
                <li key={s.slug} className="border-t border-line">
                  <Link href={`/services/${s.slug}`} className="group flex items-baseline justify-between gap-4 py-4">
                    <span className="flex items-baseline gap-4"><span className="t-label w-5 text-mute">{s.no}</span><span className="font-medium"><span className="u-link">{s.name}</span></span></span>
                    <span className="t-small hidden text-mute lg:block">{s.en}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 04 PORTFOLIO */}
      <section className="bg-white py-20 md:py-32" aria-labelledby="pf-title">
        <div className="wrap">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-8">
              <Label className="text-accent">Portfolio</Label>
              <h2 id="pf-title" className="t-section mt-6">결과로 보여주는<br />디지털 경험.</h2>
            </div>
            <p className="t-small text-mute md:col-span-4 md:self-end">아래 작업물은 모두 자체 제작한 Concept Project입니다. 실제 고객사 사례가 아니며, 고객 실적이나 성과 수치를 포함하지 않습니다.</p>
          </div>
          <div className="mt-16 grid gap-x-8 gap-y-16 md:mt-24 md:grid-cols-12">
            {showcase[0] && (
              <Reveal className="md:col-span-8">
                <Link href={`/portfolio/${showcase[0].slug}`} className="group block"><ProjectVisual p={showcase[0]} ratio="16 / 10" /><ProjectMeta p={showcase[0]} /></Link>
              </Reveal>
            )}
            {showcase[1] && (
              <Reveal delay={100} className="md:col-span-4 md:mt-40">
                <Link href={`/portfolio/${showcase[1].slug}`} className="group block"><ProjectVisual p={showcase[1]} ratio="4 / 5" /><ProjectMeta p={showcase[1]} /></Link>
              </Reveal>
            )}
            {showcase[2] && (
              <Reveal className="md:col-span-7 md:col-start-3">
                <Link href={`/portfolio/${showcase[2].slug}`} className="group block"><ProjectVisual p={showcase[2]} ratio="16 / 9" /><ProjectMeta p={showcase[2]} /></Link>
              </Reveal>
            )}
          </div>
          <div className="mt-16"><Button href="/portfolio" variant="outline" className="text-navy hover:bg-navy hover:!text-white">포트폴리오 전체 보기</Button></div>
        </div>
      </section>

      {/* 05 PROCESS */}
      <section className="on-dark bg-navy py-20 text-white md:py-32" aria-labelledby="pr-title">
        <div className="wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Label className="text-[#8db2ff]">Project process</Label>
              <h2 id="pr-title" className="t-section mt-6">여섯 단계로<br />투명하게<br />진행합니다.</h2>
              <p className="t-body mt-7 max-w-sm text-white/65">단계마다 고객이 준비할 자료와 회사가 전달하는 결과물을 문서로 명확히 합니다.</p>
              <Button href="/process" variant="outline" className="mt-9">진행 과정 자세히 보기</Button>
            </div>
          </div>
          <div className="lg:col-span-8"><ProcessList /></div>
        </div>
      </section>

      {/* 06 PRICING */}
      <section className="bg-white py-20 md:py-32" aria-labelledby="pk-title" id="pricing">
        <div className="wrap">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-8">
              <Label className="text-accent">Packages</Label>
              <h2 id="pk-title" className="t-section mt-6">필요한 범위에 맞춰<br />선택하십시오.</h2>
            </div>
            <p className="t-body text-mute md:col-span-4 md:self-end">패키지는 출발점입니다. 실제 제작 범위와 견적은 요구사항을 확인한 뒤 확정합니다.</p>
          </div>
          <div className="mt-14 md:mt-20"><PricingTable packages={packages} notice={packageNotice} /></div>
        </div>
      </section>

      {/* 07 WHY */}
      <section className="bg-off py-20 md:py-32" aria-labelledby="why-title">
        <div className="wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Label className="text-accent">Why choose us</Label>
            <h2 id="why-title" className="t-section mt-6">제작 그 이후까지<br />생각합니다.</h2>
          </div>
          <ul className="lg:col-span-7">
            {whyPoints.map((w, i) => (
              <li key={w.t} className="border-t border-navy/15 last:border-b">
                <Reveal className="grid gap-2 py-6 sm:grid-cols-[3rem_1fr] md:py-7">
                  <span className="t-label pt-2 text-accent">0{i + 1}</span>
                  <div><h3 className="text-[1.2rem] font-semibold tracking-tight">{w.t}</h3><p className="t-small mt-1.5 text-mute">{w.d}</p></div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 08 INSIGHTS */}
      {posts.length > 0 && (
        <section className="bg-white py-20 md:py-32" aria-labelledby="in-title">
          <div className="wrap">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div><Label className="text-accent">Insights</Label><h2 id="in-title" className="t-section mt-6">제작 전에 읽어두면<br />좋은 이야기.</h2></div>
              <Button href="/insights" variant="ghost" className="!px-0 text-navy">전체 글 보기</Button>
            </div>
            <ul className="mt-14 border-t border-navy md:mt-20">
              {posts.slice(0, 3).map((p) => (
                <li key={p.slug} className="border-b border-line">
                  <Link href={`/insights/${p.slug}`} className="group grid gap-x-10 gap-y-2 py-8 md:grid-cols-12">
                    <span className="t-label pt-2 text-mute md:col-span-2">{p.publishedAt.replaceAll("-", ".")}</span>
                    <span className="t-label pt-2 text-accent md:col-span-2" style={{ letterSpacing: ".08em" }}>{p.category}</span>
                    <div className="md:col-span-8"><h3 className="text-[1.35rem] font-semibold tracking-tight md:text-[1.6rem]"><span className="u-link">{p.title}</span></h3><p className="t-small mt-2 max-w-2xl text-mute">{p.excerpt}</p></div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <FinalCta />
    </>
  );
}
