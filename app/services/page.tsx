import Link from "next/link";
import { getPackages, getServices } from "@/lib/content";
import { packageNotice } from "@/content/packages";
import { featuredSlugs } from "@/content/services";
import { Arrow, PageHead } from "@/components/ui";
import { FinalCta, PricingTable } from "@/components/sections";
import { meta } from "@/lib/seo";

export const revalidate = 60;
export const metadata = meta({
  title: "홈페이지 제작 서비스 전체 | 기업 홈페이지·쇼핑몰·랜딩페이지·리뉴얼",
  description: "기업 홈페이지, 쇼핑몰, 랜딩페이지, 홈페이지 리뉴얼, SEO, 유지보수까지 20개 웹 서비스의 제작 범위와 일정, 가격 정책을 확인하세요.",
  path: "/services",
});

export default async function ServicesPage() {
  const [services, packages] = await Promise.all([getServices(), getPackages()]);
  return (
    <>
      <PageHead label="Services" title={<>서비스의 범위는 넓게,<br />완성도의 기준은 높게.</>} lead="목적에 맞는 서비스를 선택하세요. 여러 서비스를 함께 진행하는 프로젝트도 하나의 일정과 하나의 담당 체계로 관리합니다." />
      <section className="bg-white py-20 md:py-28" aria-label="전체 서비스 목록">
        <div className="wrap">
          <ol className="border-t border-navy">
            {services.map((s) => (
              <li key={s.slug} className="border-b border-line">
                <Link href={`/services/${s.slug}`} className="group grid gap-x-8 gap-y-3 py-7 md:grid-cols-12 md:py-9">
                  <span className="t-label pt-2 text-accent md:col-span-1">{s.no}</span>
                  <div className="md:col-span-4">
                    <h2 className="text-[1.5rem] font-semibold tracking-tight md:text-[1.75rem]"><span className="u-link">{s.name}</span></h2>
                    <p className="t-label mt-3 text-mute" style={{ letterSpacing: ".1em" }}>{s.en}</p>
                  </div>
                  <p className="t-body text-mute md:col-span-5">{s.summary}</p>
                  <div className="flex items-start justify-between gap-4 md:col-span-2 md:justify-end">
                    {featuredSlugs.includes(s.slug) && <span className="t-label bg-navy px-2.5 py-2 text-white" style={{ fontSize: ".62rem" }}>MAIN</span>}
                    <Arrow className="mt-2 text-navy transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="bg-off py-20 md:py-28" aria-labelledby="pk">
        <div className="wrap">
          <h2 id="pk" className="t-section">패키지 구성</h2>
          <div className="mt-12"><PricingTable packages={packages} notice={packageNotice} /></div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
