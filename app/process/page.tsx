import { PageHead } from "@/components/ui";
import { FinalCta, ProcessList } from "@/components/sections";
import { meta } from "@/lib/seo";

export const metadata = meta({
  title: "홈페이지 제작 과정 | 상담부터 출시·유지관리까지",
  description: "Discovery부터 Launch & Care까지 6단계. 각 단계에서 고객이 준비할 자료와 회사가 제공하는 결과물을 안내합니다.",
  path: "/process",
});

export default function ProcessPage() {
  return (
    <>
      <PageHead label="Project process" title={<>여섯 단계로<br />투명하게 진행합니다.</>} lead="단계마다 고객이 준비할 자료와 회사가 전달하는 결과물을 명확히 합니다. 제작 비용과 기간은 Discovery 단계에서 요구사항을 확인한 뒤 확정됩니다." />
      <section className="on-dark bg-navy py-20 text-white md:py-28"><div className="wrap"><ProcessList detailed /></div></section>
      <FinalCta />
    </>
  );
}
