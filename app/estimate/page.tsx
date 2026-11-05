import { getPackages, getServices } from "@/lib/content";
import { Estimator } from "@/components/Estimator";
import { PageHead } from "@/components/ui";
import { meta } from "@/lib/seo";

export const revalidate = 60;
export const metadata = meta({
  title: "홈페이지 제작 범위 진단 | 필요 기능·규모 점검",
  description: "만들고 싶은 사이트의 유형·규모·필요 기능을 선택하면 프로젝트 규모 수준과 권장 패키지를 안내합니다. 가격이 아닌 범위 진단입니다.",
  path: "/estimate",
  keywords: ["홈페이지 제작 범위","홈페이지 제작 견적","홈페이지 제작 준비","홈페이지 필요 기능"],
});

export default async function EstimatePage() {
  const [services, packages] = await Promise.all([getServices(), getPackages()]);
  return (
    <>
      <PageHead label="Scope check" title={<>프로젝트 범위를<br />먼저 가늠해 보세요.</>} lead="네 가지 질문으로 프로젝트의 규모 수준과 권장 패키지를 확인하고, 결과를 상담 신청서에 그대로 전달할 수 있습니다. 가격이나 기간을 산정하는 도구는 아닙니다." />
      <section className="bg-white py-16 md:py-24"><div className="wrap"><Estimator services={services.map((s) => ({ slug: s.slug, name: s.name }))} packageNames={Object.fromEntries(packages.map((p) => [p.id, p.name]))} /></div></section>
    </>
  );
}
