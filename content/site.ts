/**
 * 사이트 기본 정보 — 브랜드명과 사업자 정보는 이 파일(또는 /admin > 사이트 정보)에서 교체합니다.
 * 확인되지 않은 정보는 비워 두고, 비어 있는 항목은 화면에 표시되지 않습니다.
 */
export type SiteInfo = {
  brandName: string; // 한글 브랜드명
  brandWordmark: string; // 로고 워드마크(영문 대문자 권장)
  tagline: string;
  description: string;
  companyName: string;
  representative: string;
  businessNumber: string;
  address: string;
  email: string;
  phone: string;
  hours: string;
};

export const defaultSite: SiteInfo = {
  brandName: "브랜드명",
  brandWordmark: "BRANDNAME",
  tagline: "홈페이지 제작 · 디지털 웹 솔루션",
  description:
    "브랜드 전략부터 디자인, 개발, 검색 최적화, 운영까지. 비즈니스에 필요한 웹 솔루션을 하나의 파트너와 완성하는 홈페이지 제작 전문기업.",
  companyName: "",
  representative: "",
  businessNumber: "",
  address: "",
  email: "",
  phone: "",
  hours: "",
};

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const nav = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "SERVICES", href: "/services" },
  { label: "PORTFOLIO", href: "/portfolio" },
  { label: "PROCESS", href: "/process" },
  { label: "INSIGHTS", href: "/insights" },
  { label: "CONTACT", href: "/contact" },
] as const;

export const PRIVACY_CONSENT_VERSION = "2026-11-01";

export const budgetOptions = [
  "100만원 미만",
  "100만~300만원",
  "300만~500만원",
  "500만~1,000만원",
  "1,000만~3,000만원",
  "3,000만원 이상",
  "예산 협의 필요",
] as const;

export const timelineOptions = ["가능한 빠르게", "2주 이내", "1개월 이내", "2~3개월 이내", "일정 협의 가능"] as const;

export const contactMethods = ["이메일", "전화", "문자·메신저", "상관없음"] as const;

export const inquiryStatuses = ["NEW", "CONTACTED", "QUOTED", "IN PROGRESS", "CLOSED"] as const;
export type InquiryStatus = (typeof inquiryStatuses)[number];
