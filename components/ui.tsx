import Link from "next/link";
import type { ReactNode } from "react";

export const Arrow = ({ className = "" }: { className?: string }) => (
  <svg aria-hidden width="18" height="12" viewBox="0 0 18 12" fill="none" className={className}>
    <path d="M0 6h16M11 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

type BtnProps = { href: string; children: ReactNode; variant?: "solid" | "outline" | "light" | "ghost"; className?: string; size?: "md" | "lg" };
const base = "btn group inline-flex items-center justify-center gap-3 font-semibold tracking-tight min-h-12 whitespace-nowrap";
const variants = {
  solid: "btn-solid bg-accent text-white",
  outline: "border border-current",
  light: "btn-light bg-white text-navy",
  ghost: "btn-ghost text-current hover:opacity-70",
};
export function Button({ href, children, variant = "solid", className = "", size = "md" }: BtnProps) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${size === "lg" ? "px-8 py-4 text-[1.05rem]" : "px-6 py-3 text-[0.95rem]"} ${className}`}>
      {children}
      <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

const ko: Record<string, string> = {
  Services: "서비스", Portfolio: "포트폴리오", "What we do": "하는 일", "Project process": "진행 과정", Packages: "패키지", "Why choose us": "일하는 방식",
  Insights: "인사이트", FAQ: "자주 묻는 질문", Contact: "상담 신청", About: "회사소개", Glossary: "용어 사전", Solutions: "업종별 가이드", "Scope check": "범위 진단",
  Concerns: "고민", Structure: "구성", Features: "기능", Consultation: "상담", Commitments: "약속", "Our approach": "접근 방식", Problem: "문제",
  "Key features": "주요 기능", Scope: "범위", Audience: "대상", "Start a project": "프로젝트 시작", Privacy: "개인정보", Terms: "약관",
};
/** 영문 대문자 아이브로우 대신 평문 한글 라벨을 씁니다(템플릿 느낌 제거). */
export const Label = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <p className={`text-[0.84rem] font-medium ${className}`}>{typeof children === "string" ? ko[children] ?? children : children}</p>
);

export function PageHead({ label, title, lead, children }: { label: string; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <header className="relative overflow-hidden bg-off pt-36 pb-16 md:pt-48 md:pb-24">
      <div className="wrap relative grid gap-10 md:grid-cols-12">
        <div className="md:col-span-8">
          <Label className="text-accent">{label}</Label>
          <h1 className="t-hero mt-6" style={{ fontSize: "clamp(2.25rem, 1.2rem + 4.4vw, 4.5rem)" }}>{title}</h1>
        </div>
        {(lead || children) && (
          <div className="md:col-span-4 md:self-end">
            {lead && <p className="t-body text-mute">{lead}</p>}
            {children}
          </div>
        )}
      </div>
    </header>
  );
}

export const contactHref = (params: Record<string, string> = {}) => {
  const q = new URLSearchParams(params).toString();
  return `/contact${q ? `?${q}` : ""}`;
};
