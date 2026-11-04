import { getSite } from "@/lib/content";
import { whyPoints } from "@/content/process";
import { Label, PageHead } from "@/components/ui";
import { FinalCta } from "@/components/sections";
import { meta } from "@/lib/seo";

export const revalidate = 60;
export const metadata = meta({
  title: "회사소개 | 비즈니스의 성과를 설계하는 홈페이지 제작사",
  description: "브랜드 전략부터 디자인, 개발, 검색 최적화, 운영까지. 제작 이후까지 책임지는 홈페이지 제작 전문기업을 소개합니다.",
  path: "/about",
});

export default async function About() {
  const site = await getSite();
  const info = [["상호", site.companyName], ["대표", site.representative], ["사업자등록번호", site.businessNumber], ["주소", site.address], ["이메일", site.email], ["연락처", site.phone], ["운영시간", site.hours]].filter(([, v]) => v);
  return (
    <>
      <PageHead label="About" title={<>보기 좋은 디자인에서<br />끝나지 않습니다.</>} lead="좋은 홈페이지는 보기 좋은 디자인에서 끝나지 않습니다. 비즈니스의 성과를 설계합니다." />
      <section className="bg-white py-20 md:py-32">
        <div className="wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5"><Label className="text-accent">Our approach</Label><h2 className="t-section mt-6">템플릿 업체가 아닌,<br />온라인 비즈니스의<br />파트너.</h2></div>
          <div className="space-y-6 lg:col-span-6 lg:col-start-7">
            <p className="t-body text-mute">브랜드 전략부터 디자인, 개발, 검색 최적화, 운영까지. 비즈니스에 필요한 모든 웹 솔루션을 하나의 파트너와 완성하십시오. 우리는 기업의 온라인 비즈니스를 실질적으로 책임지는 전문 에이전시를 지향합니다.</p>
            <p className="t-body text-mute">제작 전에 사이트가 해결해야 할 일을 정의하고, 제작 중에는 디자인과 개발이 같은 기준으로 움직이며, 출시 후에는 운영과 개선까지 이어지도록 합니다.</p>
            <p className="t-body text-mute">검증되지 않은 숫자나 과장된 약속은 말하지 않습니다. 확인된 범위와 일정, 비용을 문서로 안내하는 것이 신뢰의 시작이라고 생각합니다.</p>
          </div>
        </div>
      </section>
      <section className="bg-off py-20 md:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <h2 className="t-section lg:col-span-5">일하는 기준</h2>
          <ul className="lg:col-span-7">{whyPoints.map((w, i) => (
            <li key={w.t} className="grid gap-2 border-t border-navy/15 py-6 last:border-b sm:grid-cols-[3rem_1fr]"><span className="t-label pt-2 text-accent">0{i + 1}</span><div><h3 className="text-[1.15rem] font-semibold">{w.t}</h3><p className="t-small mt-1 text-mute">{w.d}</p></div></li>
          ))}</ul>
        </div>
      </section>
      {info.length > 0 && (
        <section className="bg-white py-20 md:py-28"><div className="wrap grid gap-10 lg:grid-cols-12">
          <h2 className="t-sub lg:col-span-5">회사 정보</h2>
          <dl className="lg:col-span-7">{info.map(([k, v]) => <div key={k} className="grid grid-cols-[8rem_1fr] border-t border-line py-4"><dt className="t-small text-mute">{k}</dt><dd>{v}</dd></div>)}</dl>
        </div></section>
      )}
      <FinalCta />
    </>
  );
}
