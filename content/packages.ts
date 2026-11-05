/** 패키지 데이터 — 포함 범위와 가격 표시는 /admin 에서 수정할 수 있습니다. */
export type Pkg = {
  id: string;
  name: string;
  target: string;
  priceLabel: string;
  features: string[];
  /** "이 패키지로 상담하기" 클릭 시 상담 폼에서 자동 선택되는 서비스 slug */
  defaultServices: string[];
  highlight?: boolean;
};

export const defaultPackages: Pkg[] = [
  {
    id: "starter",
    name: "STARTER",
    target: "소규모 사업자와 초기 브랜드",
    priceLabel: "별도 견적",
    features: ["기본 디자인", "반응형 웹", "주요 서비스 소개", "기본 문의 폼", "기본 SEO 설정", "관리자 수정 범위 안내"],
    defaultServices: ["corporate-website"],
  },
  {
    id: "business",
    name: "BUSINESS",
    target: "일반 기업과 전문 서비스",
    priceLabel: "별도 견적",
    features: ["맞춤형 웹 디자인", "다중 페이지 구성", "기업 브랜딩 반영", "상담 전환 구조", "CMS 연계 옵션", "기술 SEO 기본 설정", "분석 도구 연동 옵션"],
    defaultServices: ["corporate-website", "seo"],
    highlight: true,
  },
  {
    id: "commerce",
    name: "COMMERCE",
    target: "온라인 판매 사업자",
    priceLabel: "별도 견적",
    features: ["쇼핑몰 UI/UX", "상품 및 카테고리", "장바구니", "주문 시스템", "결제 시스템 연동", "모바일 구매 환경", "운영 기능 설계"],
    defaultServices: ["ecommerce", "payment-integration"],
  },
  {
    id: "enterprise",
    name: "ENTERPRISE",
    target: "복합 기능을 필요로 하는 기업",
    priceLabel: "별도 견적",
    features: ["고급 커스텀 디자인", "맞춤 기능 개발", "API 및 CRM 연동", "다국어 구축 옵션", "회원 시스템", "데이터 관리 기능", "고급 운영 및 유지관리 계약"],
    defaultServices: ["custom-development", "crm-automation", "maintenance"],
  },
];

export const packageNotice =
  "가격은 확정 전까지 별도 견적으로 안내합니다. 정확한 제작 비용과 기간은 요구사항을 확인한 뒤 확정됩니다.";

/** 패키지 비교표: 각 행의 값은 [STARTER, BUSINESS, COMMERCE, ENTERPRISE] 순서 */
export type Cell = "포함" | "옵션" | "협의" | "—";
export const comparison: { label: string; v: [Cell, Cell, Cell, Cell] }[] = [
  { label: "반응형 웹 (모바일·태블릿·PC)", v: ["포함", "포함", "포함", "포함"] },
  { label: "맞춤형 웹 디자인", v: ["—", "포함", "포함", "포함"] },
  { label: "다중 페이지 구성", v: ["—", "포함", "포함", "포함"] },
  { label: "기본 문의 폼", v: ["포함", "포함", "포함", "포함"] },
  { label: "상담 전환 구조 설계", v: ["—", "포함", "옵션", "포함"] },
  { label: "기본 SEO 설정", v: ["포함", "포함", "포함", "포함"] },
  { label: "기술 SEO (구조화 데이터 등)", v: ["—", "포함", "포함", "포함"] },
  { label: "CMS(콘텐츠 관리) 연계", v: ["—", "옵션", "옵션", "포함"] },
  { label: "분석 도구 연동", v: ["—", "옵션", "옵션", "옵션"] },
  { label: "쇼핑몰 UI/UX · 상품·주문", v: ["—", "—", "포함", "협의"] },
  { label: "결제(PG) 연동", v: ["—", "—", "포함", "협의"] },
  { label: "맞춤 기능 개발", v: ["—", "—", "협의", "포함"] },
  { label: "회원 시스템", v: ["—", "—", "협의", "포함"] },
  { label: "API · CRM 연동", v: ["—", "—", "협의", "포함"] },
  { label: "다국어 구축", v: ["—", "옵션", "옵션", "옵션"] },
  { label: "유지관리 계약", v: ["옵션", "옵션", "옵션", "포함"] },
];
