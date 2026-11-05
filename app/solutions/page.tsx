import Link from "next/link";
import { solutions } from "@/content/solutions";
import { Arrow, PageHead } from "@/components/ui";
import { FinalCta } from "@/components/sections";
import { meta } from "@/lib/seo";

export const metadata = meta({
  title: "업종별 홈페이지 제작 가이드 | 병원·법률·세무·학원·쇼핑몰",
  description: "병원, 법률사무소, 세무·회계법인, 학원, 쇼핑몰, 스타트업, B2B 기업, 해외 진출 기업별 홈페이지 구성과 필요한 기능을 정리했습니다.",
  path: "/solutions",
  keywords: ["업종별 홈페이지 제작", "병원 홈페이지 제작", "법률사무소 홈페이지 제작", "세무사 홈페이지 제작", "학원 홈페이지 제작", "쇼핑몰 제작"],
});

export default function SolutionsIndex() {
  return (
    <>
      <PageHead label="Solutions" title={<>업종마다 필요한 홈페이지는<br />다릅니다.</>} lead="업종별로 방문자가 확인하는 정보와 필요한 기능을 정리했습니다. 해당 업종의 구성 가이드를 먼저 읽어보세요." />
      <section className="bg-white py-16 md:py-24"><div className="wrap">
        <ol className="border-t border-navy">
          {solutions.map((s, i) => (
            <li key={s.slug} className="border-b border-line">
              <Link href={`/solutions/${s.slug}`} className="row-hover group grid gap-x-8 gap-y-3 py-7 md:grid-cols-12 md:py-9">
                <span className="t-label pt-2 text-accent md:col-span-1">0{i + 1}</span>
                <h2 className="text-[1.5rem] font-semibold tracking-tight md:col-span-4 md:text-[1.75rem]"><span className="u-link">{s.name}</span></h2>
                <p className="t-body text-mute md:col-span-6">{s.description}</p>
                <Arrow className="mt-2 text-navy transition-transform duration-300 group-hover:translate-x-2 md:col-span-1 md:justify-self-end" />
              </Link>
            </li>
          ))}
        </ol>
      </div></section>
      <FinalCta />
    </>
  );
}
