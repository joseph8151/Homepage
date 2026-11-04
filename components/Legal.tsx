import type { ReactNode } from "react";
import { PageHead } from "./ui";
export function Legal({ label, title, updated, children }: { label: string; title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <PageHead label={label} title={title} lead={`시행일: ${updated}`} />
      <section className="bg-white py-16 md:py-24">
        <div className="wrap"><div className="max-w-3xl space-y-12 [&_h2]:mb-4 [&_h2]:text-[1.35rem] [&_h2]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_li]:py-0.5 [&_p]:text-navy/80 [&_ul]:mt-3">
          <p className="border-l-2 border-accent bg-off px-4 py-3 text-[0.9rem] text-mute">이 문서는 서비스 운영을 위한 기본 양식입니다. 실제 운영 전에 사업자 정보를 입력하고 법률 전문가의 검토를 받아 확정하십시오.</p>
          {children}
        </div></div>
      </section>
    </>
  );
}
