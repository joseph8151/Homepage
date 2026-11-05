import { getProjects } from "@/lib/content";
import { PageHead } from "@/components/ui";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { FinalCta } from "@/components/sections";
import { meta } from "@/lib/seo";

export const revalidate = 60;
export const metadata = meta({
  title: "홈페이지 제작 사례 | 기업·쇼핑몰·브랜드 포트폴리오",
  description: "기업 홈페이지, 쇼핑몰, 브랜드, 랜딩페이지, 맞춤 개발의 설계 방향과 화면 구성을 확인하세요. 모든 작업물은 콘셉트 프로젝트로 명확히 표시합니다.",
  path: "/portfolio",
  keywords: ["홈페이지 제작 사례","홈페이지 포트폴리오","쇼핑몰 제작 사례","기업 홈페이지 디자인"],
});

export default async function PortfolioPage() {
  const projects = await getProjects();
  const hasConcept = projects.some((p) => p.isConcept);
  return (
    <>
      <PageHead label="Portfolio" title={<>결과로 보여주는<br />디지털 경험.</>} lead={hasConcept ? "Concept Project로 표시된 작업물은 설계 역량을 보여주기 위해 자체 제작한 가상의 프로젝트이며, 실제 고객사 사례가 아닙니다." : undefined} />
      <section className="bg-white py-16 md:py-24"><div className="wrap"><PortfolioGrid projects={projects} /></div></section>
      <FinalCta title={"비슷한 프로젝트를\n계획하고 계신가요?"} button="비슷한 프로젝트 문의하기" />
    </>
  );
}
