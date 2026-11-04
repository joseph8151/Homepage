import { Suspense } from "react";
import { getPackages, getServices, getSite } from "@/lib/content";
import { ContactForm } from "@/components/ContactForm";
import { Label } from "@/components/ui";
import { meta } from "@/lib/seo";

export const revalidate = 60;
export const metadata = meta({
  title: "프로젝트 상담 신청 | 홈페이지 제작 견적 문의",
  description: "프로젝트의 목적과 필요한 기능을 알려주시면 요구사항을 검토해 적합한 제작 방향과 견적을 안내해 드립니다.",
  path: "/contact",
});

export default async function Contact() {
  const [services, packages, site] = await Promise.all([getServices(), getPackages(), getSite()]);
  return (
    <>
      <header className="bg-off pb-14 pt-36 md:pb-20 md:pt-48">
        <div className="wrap grid gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <Label className="text-accent">Contact</Label>
            <h1 className="t-hero mt-6" style={{ fontSize: "clamp(2.25rem,1.2rem+4.4vw,4.5rem)" }}>다음 프로젝트를<br />함께 시작하겠습니다.</h1>
          </div>
          <p className="t-body text-mute md:col-span-4 md:self-end">프로젝트의 목적과 필요한 기능을 알려주십시오. 요구사항을 검토하여 적합한 제작 방향과 견적을 안내해 드립니다.</p>
        </div>
      </header>
      <section className="bg-white py-14 md:py-24">
        <div className="wrap grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Suspense fallback={<p className="py-20 text-mute" role="status">상담 신청서를 불러오는 중입니다…</p>}>
              <ContactForm
                services={services.map((s) => ({ slug: s.slug, name: s.name, en: s.en }))}
                packages={packages.map((p) => ({ id: p.id, name: p.name, defaultServices: p.defaultServices }))}
                fallback={{ email: site.email, phone: site.phone }}
              />
            </Suspense>
          </div>
          <aside className="lg:col-span-3 lg:col-start-10" aria-label="상담 안내">
            <div className="lg:sticky lg:top-28">
              <p className="t-label text-mute">상담 진행 순서</p>
              <ol className="mt-5 space-y-5 border-l border-line pl-5 text-[0.95rem]">
                <li><b>접수</b><br /><span className="text-mute">신청 내용을 확인합니다.</span></li>
                <li><b>요구사항 검토</b><br /><span className="text-mute">필요 시 추가 질문을 드립니다.</span></li>
                <li><b>제작 방향·견적 안내</b><br /><span className="text-mute">범위와 일정, 비용을 문서로 안내합니다.</span></li>
              </ol>
              {(site.email || site.phone) && (
                <div className="mt-10 border-t border-line pt-6 text-[0.95rem]">
                  <p className="t-label text-mute">Direct</p>
                  {site.email && <p className="mt-3"><a className="u-link" href={`mailto:${site.email}`}>{site.email}</a></p>}
                  {site.phone && <p className="mt-1"><a className="u-link" href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}>{site.phone}</a></p>}
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
