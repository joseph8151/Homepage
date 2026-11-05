/**
 * 검색 키워드 체계 — 클러스터별 대표 키워드와 세부(롱테일) 키워드, 담당 페이지.
 * 이 데이터는 ① 페이지 meta keywords ② docs/KEYWORDS.md(키워드 맵) ③ 내부 링크 구성에 사용됩니다.
 * 키워드를 본문에 억지로 반복하지 마십시오(검색엔진 저품질 판단 위험). 질문형 FAQ·가이드 글로 자연스럽게 다룹니다.
 */
export type KeywordCluster = { id: string; name: string; head: string[]; long: string[]; page: string };

export const keywordClusters: KeywordCluster[] = [
  { id: "core", name: "핵심(제작사 탐색)", page: "/",
    head: ["홈페이지 제작", "홈페이지 제작 업체", "홈페이지 제작 회사", "웹사이트 제작"],
    long: ["홈페이지 제작 전문", "홈페이지 만들기", "홈페이지 제작 대행", "맞춤형 홈페이지 제작", "홈페이지 제작 업체 추천", "홈페이지 제작 업체 선정 기준"] },
  { id: "cost", name: "비용·견적", page: "/insights/corporate-website-before-cost",
    head: ["홈페이지 제작 비용", "홈페이지 제작 견적"],
    long: ["기업 홈페이지 제작 비용", "홈페이지 제작 비용 산정", "홈페이지 제작 견적 비교", "쇼핑몰 제작 비용", "랜딩페이지 제작 비용", "홈페이지 리뉴얼 비용", "홈페이지 유지보수 비용", "홈페이지 제작 비용 차이"] },
  { id: "period", name: "기간·과정", page: "/process",
    head: ["홈페이지 제작 과정", "홈페이지 제작 기간"],
    long: ["홈페이지 제작 순서", "홈페이지 제작 절차", "홈페이지 제작 준비", "홈페이지 제작 체크리스트", "홈페이지 제작 의뢰 방법", "홈페이지 제작 일정"] },
  { id: "corporate", name: "기업·B2B", page: "/services/corporate-website",
    head: ["기업 홈페이지 제작", "회사 홈페이지 제작"],
    long: ["중소기업 홈페이지 제작", "법인 홈페이지 제작", "B2B 홈페이지 제작", "제조업 홈페이지 제작", "건설회사 홈페이지 제작", "기업 홈페이지 필수 페이지", "기업 홈페이지 구성", "회사소개 홈페이지"] },
  { id: "responsive", name: "반응형·모바일", page: "/insights/responsive-vs-mobile-site",
    head: ["반응형 홈페이지 제작", "반응형 웹 제작"],
    long: ["모바일 홈페이지 제작", "반응형 웹 vs 모바일 웹", "모바일 최적화 홈페이지", "반응형 홈페이지 비용"] },
  { id: "commerce", name: "쇼핑몰", page: "/services/ecommerce",
    head: ["쇼핑몰 제작", "쇼핑몰 제작 업체"],
    long: ["자사몰 제작", "쇼핑몰 구축", "쇼핑몰 결제 연동", "PG 연동 쇼핑몰", "쇼핑몰 제작 과정", "쇼핑몰 제작 전 준비", "구축형 쇼핑몰", "쇼핑몰 운영 기능"] },
  { id: "landing", name: "랜딩페이지", page: "/services/landing-page",
    head: ["랜딩페이지 제작", "랜딩페이지 제작 업체"],
    long: ["광고 랜딩페이지 제작", "상담 랜딩페이지", "랜딩페이지 구성", "랜딩페이지 전환율", "원페이지 홈페이지 제작", "이벤트 랜딩페이지"] },
  { id: "redesign", name: "리뉴얼", page: "/services/website-redesign",
    head: ["홈페이지 리뉴얼", "웹사이트 리뉴얼"],
    long: ["홈페이지 리뉴얼 SEO", "홈페이지 리뉴얼 검색 노출", "홈페이지 개편", "301 리디렉션 리뉴얼", "오래된 홈페이지 리뉴얼", "홈페이지 리뉴얼 비용"] },
  { id: "seo", name: "SEO·네이버", page: "/services/seo",
    head: ["홈페이지 SEO", "검색엔진 최적화", "네이버 SEO"],
    long: ["네이버 검색 노출", "네이버 서치어드바이저 등록", "네이버 서치어드바이저 사이트맵", "구글 서치콘솔 등록", "홈페이지 검색 노출", "기술 SEO", "SEO 친화적 홈페이지", "네이버 웹페이지 수집 요청"] },
  { id: "care", name: "유지보수·운영", page: "/services/maintenance",
    head: ["홈페이지 유지보수", "홈페이지 관리 대행"],
    long: ["웹사이트 운영 대행", "홈페이지 유지보수 계약", "홈페이지 유지보수 범위", "홈페이지 보안 업데이트", "도메인 호스팅 관리", "홈페이지 백업"] },
  { id: "industry", name: "업종별", page: "/solutions",
    head: ["병원 홈페이지 제작", "법률사무소 홈페이지 제작", "세무사 홈페이지 제작", "학원 홈페이지 제작"],
    long: ["치과 홈페이지 제작", "한의원 홈페이지 제작", "변호사 홈페이지 제작", "회계법인 홈페이지 제작", "교육기관 홈페이지 제작", "스타트업 홈페이지 제작", "영문 홈페이지 제작", "다국어 홈페이지 제작", "인테리어 홈페이지 제작"] },
  { id: "feature", name: "기능", page: "/services",
    head: ["예약 홈페이지 제작", "관리자 페이지 제작"],
    long: ["회원가입 홈페이지 제작", "CMS 구축", "홈페이지 속도 개선", "웹 접근성 개선", "CRM 연동 홈페이지", "상담 신청 폼 제작", "게시판 홈페이지"] },
];

/** 블로그 글 → 관련 서비스 (글 하단 '관련 서비스' 내부 링크) */
export const postServices: Record<string, string[]> = {
  "corporate-website-before-cost": ["corporate-website"],
  "responsive-vs-mobile-site": ["corporate-website", "performance"],
  "redesign-keep-search-traffic": ["website-redesign", "seo"],
  "corporate-website-page-structure": ["corporate-website"],
  "ecommerce-payment-operations-first": ["ecommerce", "payment-integration"],
  "website-prep-checklist": ["corporate-website"],
  "landing-page-structure": ["landing-page"],
  "maintenance-contract-checklist": ["maintenance"],
  "web-accessibility-basics": ["accessibility-ux"],
  "domain-hosting-ownership": ["infrastructure"],
  "evaluate-agency-portfolio": ["corporate-website"],
  "inquiry-form-design": ["crm-automation", "landing-page"],
  "agency-selection-criteria": ["corporate-website"],
  "website-timeline-factors": ["corporate-website"],
  "ecommerce-cost-factors": ["ecommerce", "payment-integration"],
  "site-build-methods-compared": ["custom-development", "cms"],
  "naver-search-advisor-guide": ["seo"],
};

/** 서비스 → 대표 가이드 글 (서비스 상세 하단 내부 링크) */
export const serviceGuides: Record<string, string[]> = {
  "corporate-website": ["corporate-website-before-cost", "corporate-website-page-structure", "agency-selection-criteria"],
  ecommerce: ["ecommerce-payment-operations-first", "ecommerce-cost-factors"],
  "landing-page": ["landing-page-structure", "inquiry-form-design"],
  "website-redesign": ["redesign-keep-search-traffic"],
  seo: ["naver-search-advisor-guide", "redesign-keep-search-traffic"],
  maintenance: ["maintenance-contract-checklist", "domain-hosting-ownership"],
  "custom-development": ["site-build-methods-compared"],
  cms: ["site-build-methods-compared"],
  "accessibility-ux": ["web-accessibility-basics"],
  infrastructure: ["domain-hosting-ownership"],
  "crm-automation": ["inquiry-form-design"],
  "payment-integration": ["ecommerce-payment-operations-first"],
  performance: ["responsive-vs-mobile-site"],
};

export const allKeywords = keywordClusters.flatMap((c) => [...c.head, ...c.long]);
export const siteKeywords = ["웹몬트로", "WebMontro", ...keywordClusters.flatMap((c) => c.head)];
