import Link from "next/link";
import type { SiteInfo } from "@/content/site";
import type { Service } from "@/content/services";
import { Logo } from "./Logo";

export function Footer({ site, services }: { site: SiteInfo; services: Service[] }) {
  const biz = [
    site.companyName && `상호 ${site.companyName}`,
    site.representative && `대표 ${site.representative}`,
    site.businessNumber && `사업자등록번호 ${site.businessNumber}`,
    site.address && `주소 ${site.address}`,
  ].filter(Boolean) as string[];
  return (
    <footer className="on-dark bg-deep pb-28 pt-20 text-white md:pb-12 md:pt-28">
      <div className="wrap">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo wordmark={site.brandWordmark} />
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-white/60">{site.description}</p>
            <ul className="mt-8 space-y-1 text-[0.95rem] text-white/80">
              {site.email && <li><a className="u-link" href={`mailto:${site.email}`}>{site.email}</a></li>}
              {site.phone && <li><a className="u-link" href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}>{site.phone}</a></li>}
              {site.hours && <li className="text-white/50">{site.hours}</li>}
              {!site.email && !site.phone && <li className="text-white/40">연락처는 상담 신청 페이지를 이용해 주세요.</li>}
            </ul>
          </div>

          <nav aria-label="푸터 서비스" className="lg:col-span-5">
            <p className="t-label text-white/45">Services</p>
            <ul className="mt-6 grid gap-x-8 gap-y-2.5 text-[0.92rem] text-white/75 sm:grid-cols-2">
              {services.map((s) => (
                <li key={s.slug}><Link className="u-link" href={`/services/${s.slug}`}>{s.name}</Link></li>
              ))}
            </ul>
          </nav>

          <nav aria-label="푸터 메뉴" className="lg:col-span-3">
            <p className="t-label text-white/45">Company</p>
            <ul className="mt-6 space-y-2.5 text-[0.95rem] text-white/80">
              <li><Link className="u-link" href="/about">회사소개</Link></li>
              <li><Link className="u-link" href="/portfolio">포트폴리오</Link></li>
              <li><Link className="u-link" href="/solutions">업종별 제작 가이드</Link></li>
              <li><Link className="u-link" href="/process">프로젝트 진행 과정</Link></li>
              <li><Link className="u-link" href="/estimate">프로젝트 범위 진단</Link></li>
              <li><Link className="u-link" href="/insights">인사이트</Link></li>
              <li><Link className="u-link" href="/glossary">용어 사전</Link></li>
              <li><Link className="u-link" href="/contact">상담 문의</Link></li>
            </ul>
          </nav>
        </div>

        <p aria-hidden className="mt-20 select-none overflow-hidden whitespace-nowrap font-bold leading-[0.8] tracking-[-0.04em] text-white/[0.06]" style={{ fontSize: "min(12.5vw, 196px)", overflowWrap: "normal", wordBreak: "normal" }}>{site.brandWordmark}</p>
        <div className="rule-dark mt-10 border-t pt-8 text-[0.82rem] leading-relaxed text-white/45">
          {biz.length > 0 && <p className="mb-3">{biz.join(" · ")}</p>}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} {site.companyName || site.brandWordmark}. All rights reserved.</p>
            <p className="flex gap-6">
              <Link className="u-link text-white/70" href="/privacy">개인정보처리방침</Link>
              <Link className="u-link text-white/70" href="/terms">이용약관</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
