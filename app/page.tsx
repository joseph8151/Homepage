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
import { getSite } from "@/lib/content";
import { getPhotos } from "@/lib/photos";
import { PhotoFrame } from "@/components/Photo";
import { faqs } from "@/content/faq";
import { FaqSection } from "@/components/Faq";

export const metadata = meta({
  title: "홈페이지 제작 업체 웹몬트로 | 기업 홈페이지·쇼핑몰·랜딩페이지",
  description: "홈페이지 제작 전문. 기업 홈페이지, 쇼핑몰, 랜딩페이지, 홈페이지 리뉴얼, SEO와 유지보수까지 비즈니스 성과를 설계합니다. 비용·기간 상담 가능.",
  path: "/",
  keywords: ["웹몬트로","WebMontro","홈페이지 제작","홈페이지 제작 업체","기업 홈페이지 제작","쇼핑몰 제작","랜딩페이지 제작","홈페이지 리뉴얼","반응형 홈페이지 제작","홈페이지 유지보수","웹사이트 제작"],
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
  const [services, packages, projects, posts, site] = await Promise.all([getServices(), getPackages(), getProjects(), getPosts(), getSite()]);
  const featured = featuredSlugs.map((s) => services.find((x) => x.slug === s)!).filter(Boolean);
  const rest = services.filter((s) => !featuredSlugs.includes(s.slug));
  const showcase = projects.slice(0, 3);
  const ph = await getPhotos();
  const pDesk = ph.desk, pPortrait = ph.portrait;

  return (
    <>
      {/* 01 HERO */}
      <section className="on-dark relative overflow-hidden bg-deep text-white" aria-labelledby="hero-title">
        <div aria-hidden className="hero-lift absolute inset-0" />
        <div aria-hidden className="grid-lines absolute inset-0" />
        <div className="wrap relative grid gap-16 pb-36 pt-36 md:pt-44 lg:grid-cols-12 lg:gap-10 lg:pb-44">
          <div className="lg:col-span-7">
            <p className="t-label text-[#8db2ff]" style={{ letterSpacing: "0.16em" }}>Digital experiences. Built for business.</p>
            <h1 id="hero-title" className="t-hero mt-8">
              <span className="block text-white/60" style={{ fontWeight: 300 }}>웹사이트를 넘어,</span>
              <span className="block">비즈니스의 <span className="text-[#6ea0ff]">성과</span>를</span>
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
      <section id="intro" className="bg-white pt-24 pb-20 md:pt-40 md:pb-28" aria-labelledby="intro-title">
        <div className="wrap">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal><Label className="text-accent">What we do</Label></Reveal>
              <Reveal delay={80}>
                <h2 id="intro-title" className="t-section mt-6">디자인의 완성도와<br />비즈니스의 목적을<br />연결합니다.</h2>
              </Reveal>
            </div>
            <div className="space-y-5 lg:col-span-4 lg:col-start-9 lg:pt-28">
              <Reveal delay={120}><p className="t-body text-navy/75">화면을 꾸미기 전에, 이 사이트가 무슨 일을 해야 하는지부터 정합니다. 문의를 받을지, 물건을 팔지, 회사를 믿게 만들지. 답이 정해지면 나머지는 훨씬 단순해집니다.</p></Reveal>
              <Reveal delay={180}><p className="t-body text-mute">템플릿에 로고만 얹지 않습니다. 사업이 어떻게 돌아가는지, 손님이 무엇을 보고 결정하는지에서 출발해 구조와 디자인, 개발을 한 팀이 끝까지 맡습니다. 출시 뒤에 고치고 운영하는 일까지 감안해서 만듭니다.</p></Reveal>
            </div>
          </div>
          {(pDesk || pPortrait) && (
            <div className="mt-20 grid gap-6 md:mt-28 md:grid-cols-12 md:items-start">
              {pDesk && <Reveal className="md:col-span-8"><PhotoFrame photo={pDesk} ratio="3 / 2" sizes="(min-width: 768px) 66vw, 100vw" /></Reveal>}
              {pPortrait && <Reveal delay={140} className="md:col-span-4 md:mt-24"><PhotoFrame photo={pPortrait} ratio="4 / 5" sizes="(min-width: 768px) 33vw, 100vw" /></Reveal>}
            </div>
          )}
          <ul className="mt-20 grid gap-x-12 md:mt-28 md:grid-cols-2 lg:grid-cols-3">
            {intro.map((t) => (
              <li key={t} className="border-t border-navy/15 py-5 text-[1.12rem] font-semibold tracking-tight">{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 03 SERVICES */}
      <section className="bg-off py-16 md:py-28" aria-labelledby="svc-title">
        <div className="wrap">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-8">
              <Label className="text-accent">Services</Label>
              <h2 id="svc-title" className="t-section mt-6">서비스의 범위는 넓게,<br />완성도의 기준은 높게.</h2>
            </div>
            <div className="md:col-span-4 md:self-end"><Button href="/services" variant="ghost" className="!px-0 text-navy">전체 서비스 보기</Button></div>
          </div>

          <ol className="mt-16 border-t border-navy md:mt-24">
            {featured.map((s) => (
              <li key={s.slug} className="border-b border-line">
                <Link href={`/services/${s.slug}`} className="row-hover group grid gap-x-10 gap-y-4 py-9 md:grid-cols-12 md:items-baseline md:py-12">
                  <div className="md:col-span-6">
                    <h3 className="t-sub transition-transform duration-500 group-hover:translate-x-2" style={{ fontSize: "clamp(1.9rem,1.1rem+2.6vw,3.4rem)" }}>{s.name}</h3>
                    <p className="t-small mt-3 text-mute">{s.en}</p>
                  </div>
                  <div className="md:col-span-5">
                    <p className="t-body text-navy/75">{s.summary}</p>
                    <p className="t-small mt-3 text-mute">{s.features.slice(0, 3).join(", ")}</p>
                  </div>
                  <span className="hidden justify-end md:col-span-1 md:flex"><Arrow className="text-navy transition-transform duration-300 group-hover:translate-x-2" /></span>
                </Link>
              </li>
            ))}
          </ol>

          <div className="mt-20 grid gap-10 md:grid-cols-12">
            <p className="text-[0.9rem] font-medium text-mute md:col-span-3">나머지 서비스 {rest.length}개</p>
            <ul className="grid gap-x-12 md:col-span-9 md:grid-cols-2">
              {rest.map((s) => (
                <li key={s.slug} className="border-t border-line">
                  <Link href={`/services/${s.slug}`} className="group flex items-baseline justify-between gap-4 py-4">
                    <span className="flex items-baseline gap-4"><span className="font-medium"><span className="u-link">{s.name}</span></span></span>
                    <span className="t-small hidden text-mute lg:block">{s.en}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 04 PORTFOLIO */}
      <section className="bg-white pt-20 pb-24 md:pt-36 md:pb-40" aria-labelledby="pf-title">
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
          <div className="mt-16"><Button href="/portfolio" variant="outline" className="text-navy">포트폴리오 전체 보기</Button></div>
        </div>
      </section>

      <section className="bg-white pb-20 md:pb-32" aria-label="브랜드 관점">
        <div className="wrap">
          <Reveal className="max-w-4xl md:ml-[16.66%]">
            <p className="serif text-[clamp(1.6rem,1rem+2.4vw,3rem)] leading-[1.35] text-navy">좋은 홈페이지는 보기 좋은 디자인에서 끝나지 않습니다.<br /><span className="text-navy/55">비즈니스의 성과를 설계합니다.</span></p>
          </Reveal>
        </div>
      </section>

      {/* 05 PROCESS */}
      <section className="on-dark bg-navy py-20 text-white md:py-32" aria-labelledby="pr-title">
        <div className="wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Label className="text-[#8db2ff]">Project process</Label>
              <h2 id="pr-title" className="t-section mt-6">여섯 단계로<br />투명하게<br />진행합니다.</h2>
              <p className="t-body mt-7 max-w-sm text-white/65">단계마다 고객이 준비할 자료와 우리가 내놓는 결과물을 문서로 남깁니다.</p>
              <Button href="/process" variant="outline" className="mt-9">진행 과정 자세히 보기</Button>
            </div>
          </div>
          <div className="lg:col-span-8"><ProcessList /></div>
        </div>
      </section>

      {/* 06 PRICING */}
      <section className="bg-white py-20 md:py-28" aria-labelledby="pk-title" id="pricing">
        <div className="wrap">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-8">
              <Label className="text-accent">Packages</Label>
              <h2 id="pk-title" className="t-section mt-6">필요한 범위에 맞춰<br />선택하십시오.</h2>
            </div>
            <p className="t-body text-mute md:col-span-4 md:self-end">패키지는 출발점일 뿐입니다. 실제 범위와 견적은 요구사항을 들어본 뒤에 정합니다.</p>
          </div>
          <div className="mt-14 md:mt-20"><PricingTable packages={packages} notice={packageNotice} /></div>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-y border-line py-6">
            <p className="max-w-xl text-[1.05rem] font-medium">어떤 패키지가 맞는지 모르겠다면, 네 가지 질문으로 프로젝트 범위를 먼저 가늠해 보세요.</p>
            <Button href="/estimate" variant="outline" className="text-navy">프로젝트 범위 진단</Button>
          </div>
        </div>
      </section>

      {/* 07 WHY */}
      <section className="bg-off py-16 md:py-24" aria-labelledby="why-title">
        <div className="wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Label className="text-accent">Why choose us</Label>
            <h2 id="why-title" className="t-section mt-6">제작 그 이후까지<br />생각합니다.</h2>
          </div>
          <ul className="lg:col-span-7">
            {whyPoints.map((w) => (
              <li key={w.t} className="border-t border-navy/15 last:border-b">
                <Reveal className="grid gap-x-8 gap-y-1.5 py-6 md:grid-cols-[1fr_1.1fr] md:py-7">
                  <h3 className="text-[1.2rem] font-semibold tracking-tight">{w.t}</h3>
                  <p className="t-small text-mute">{w.d}</p>
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

      <FaqSection items={faqs.filter((f) => f.tags.includes("home"))} bg="bg-off" />
      <FinalCta />
    </>
  );
}
