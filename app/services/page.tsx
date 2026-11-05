import Link from "next/link";
import { getPackages, getServices } from "@/lib/content";
import { packageNotice } from "@/content/packages";
import { featuredSlugs, serviceGroups } from "@/content/services";
import { PageHead } from "@/components/ui";
import { ServiceExplorer } from "@/components/ServiceExplorer";
import { Comparison } from "@/components/Comparison";
import { FinalCta, PricingTable } from "@/components/sections";
import { meta } from "@/lib/seo";
import { faqs } from "@/content/faq";
import { FaqSection } from "@/components/Faq";

export const revalidate = 60;
export const metadata = meta({
  title: "홈페이지 제작 서비스 20종 | 비용·기간·제작 범위",
  description: "기업 홈페이지·쇼핑몰·랜딩페이지·리뉴얼·SEO·유지보수 등 20개 웹 서비스의 제작 범위, 일정, 가격 정책(별도 견적)과 패키지 비교를 확인하세요.",
  path: "/services",
  keywords: ["홈페이지 제작 서비스","홈페이지 제작 비용","홈페이지 제작 견적","웹사이트 제작","홈페이지 제작 범위"],
});

export default async function ServicesPage() {
  const [services, packages] = await Promise.all([getServices(), getPackages()]);
  return (
    <>
      <PageHead label="Services" title={<>서비스의 범위는 넓게,<br />완성도의 기준은 높게.</>} lead="목적에 맞는 서비스를 선택하세요. 여러 서비스를 함께 진행하는 프로젝트도 하나의 일정과 하나의 담당 체계로 관리합니다.">
        <Link href="/estimate" className="u-link mt-6 inline-block font-semibold text-accent">어떤 서비스가 필요한지 모르겠다면 → 프로젝트 범위 진단</Link>
        <Link href="/solutions" className="u-link mt-3 block font-semibold text-accent">병원·법률·학원 등 업종별 제작 가이드 →</Link>
      </PageHead>
      <section className="bg-white py-16 md:py-24" aria-label="전체 서비스 목록">
        <div className="wrap"><ServiceExplorer groups={serviceGroups} services={services.map((s) => ({ slug: s.slug, no: s.no, name: s.name, en: s.en, summary: s.summary, featured: featuredSlugs.includes(s.slug) }))} /></div>
      </section>
      <section className="bg-off py-20 md:py-28" aria-labelledby="pk">
        <div className="wrap">
          <h2 id="pk" className="t-section">패키지 구성</h2>
          <div className="mt-12"><PricingTable packages={packages} notice={packageNotice} /></div>
          <h3 className="t-sub mt-24" style={{ fontSize: "1.6rem" }}>패키지 비교</h3>
          <div className="mt-8"><Comparison packages={packages} /></div>
        </div>
      </section>
      <FaqSection items={faqs.filter((f) => f.tags.includes("cost") || f.tags.includes("service")).slice(0, 8)} />
      <FinalCta />
    </>
  );
}
