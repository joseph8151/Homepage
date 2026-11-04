/**
 * 포트폴리오 — 현재는 모두 자체 제작한 "Concept Project"입니다.
 * 실제 프로젝트가 생기면 /admin > 포트폴리오 에서 isConcept 를 해제하고 imageUrl·설명을 교체하십시오.
 * 가상의 고객사 실적·성과 수치는 넣지 않습니다.
 */
export type PortfolioCategory = "CORPORATE" | "COMMERCE" | "BRAND" | "LANDING" | "CUSTOM";
export const portfolioCategories: PortfolioCategory[] = ["CORPORATE", "COMMERCE", "BRAND", "LANDING", "CUSTOM"];

export type Project = {
  slug: string;
  title: string;
  industry: string;
  category: PortfolioCategory;
  type: string;
  scope: string[];
  summary: string;
  problem: string;
  direction: string;
  implementation: string;
  result: string;
  /** 비어 있으면 visual 에 해당하는 콘셉트 화면을 표시합니다. */
  imageUrl?: string;
  visual: "law" | "clinic" | "shop" | "brand" | "landing" | "dashboard";
  isConcept: boolean;
  relatedService: string;
};

export const defaultProjects: Project[] = [
  {
    slug: "concept-law-firm",
    title: "Halden & Partners",
    industry: "법률사무소",
    category: "CORPORATE",
    type: "기업 홈페이지",
    scope: ["정보 구조 설계", "UI/UX 디자인", "반응형 설계"],
    summary: "차분한 에디토리얼 톤으로 전문성과 상담 절차를 설명하는 법률사무소 콘셉트.",
    problem: "전문 분야는 많지만 처음 방문한 사람이 어떤 사건을 어떻게 의뢰하는지 알기 어려운 구조를 가정했습니다.",
    direction: "과장된 문구를 배제하고 업무 분야·담당 전문가·상담 절차를 큰 타이포그래피와 넓은 여백으로 정리했습니다.",
    implementation: "업무 분야별 상세 구조, 전문가 프로필, 상담 폼을 하나의 흐름으로 설계하고 모바일에서는 전화·상담 신청을 하단에 고정했습니다.",
    result: "콘셉트 작업물입니다. 실제 고객 성과 데이터는 없으며, 설계 방향과 화면 구성을 보여주기 위한 자체 제작물입니다.",
    visual: "law",
    isConcept: true,
    relatedService: "professional-website",
  },
  {
    slug: "concept-clinic",
    title: "Linea Clinic",
    industry: "피부·진료 클리닉",
    category: "CORPORATE",
    type: "병원 홈페이지",
    scope: ["정보 구조 설계", "UI/UX 디자인", "예약 동선 설계"],
    summary: "진료 안내와 예약을 모바일에서 가장 빠르게 확인하는 클리닉 콘셉트.",
    problem: "진료시간·위치·진료과목을 찾기 위해 여러 화면을 이동해야 하는 상황을 가정했습니다.",
    direction: "첫 화면에 진료시간과 예약 버튼을 배치하고, 부드러운 블루 톤과 넉넉한 행간으로 안정감을 강조했습니다.",
    implementation: "진료과목·의료진·오시는 길을 분리하고 전화 연결·지도·예약 문의를 한 손으로 조작할 수 있게 설계했습니다.",
    result: "콘셉트 작업물입니다. 실제 의료기관 사례가 아니며 의료광고 문구는 포함하지 않았습니다.",
    visual: "clinic",
    isConcept: true,
    relatedService: "medical-website",
  },
  {
    slug: "concept-commerce",
    title: "Maison Oru",
    industry: "라이프스타일 쇼핑몰",
    category: "COMMERCE",
    type: "쇼핑몰",
    scope: ["쇼핑몰 UI/UX", "상품 구조 설계", "구매 동선 설계"],
    summary: "큰 이미지와 절제된 정보 위계로 상품에 집중하게 하는 쇼핑몰 콘셉트.",
    problem: "상품 이미지가 작고 필터가 복잡해 구매 결정까지 시간이 걸리는 쇼핑몰을 가정했습니다.",
    direction: "상품 사진을 주인공으로 하고 가격·옵션·배송 정보를 일관된 위치에 둬 비교를 쉽게 했습니다.",
    implementation: "카테고리·상품 상세·장바구니·주문 단계를 모바일 우선으로 설계했습니다. 결제는 PG사 연동 전제로 화면만 구성했습니다.",
    result: "콘셉트 작업물입니다. 실제 판매 중인 쇼핑몰이 아니며 상품과 브랜드는 가상입니다.",
    visual: "shop",
    isConcept: true,
    relatedService: "ecommerce",
  },
  {
    slug: "concept-brand",
    title: "Studio Sora",
    industry: "개인 브랜드 · 디자인 스튜디오",
    category: "BRAND",
    type: "브랜드 홈페이지",
    scope: ["비주얼 시스템", "에디토리얼 레이아웃", "인터랙션 설계"],
    summary: "큰 타이포그래피와 이미지 크롭으로 브랜드의 태도를 보여주는 콘셉트.",
    problem: "작업의 결은 뚜렷한데 웹에서는 일반 포트폴리오 템플릿과 구분되지 않는 상황을 가정했습니다.",
    direction: "대형 타이포그래피와 비대칭 그리드, 절제된 모션으로 브랜드의 리듬을 만들었습니다.",
    implementation: "프로젝트 중심 스크롤 구조와 이미지 비율 규칙, 스토리 섹션을 설계했습니다.",
    result: "콘셉트 작업물입니다. 실제 스튜디오가 아닌 가상의 브랜드입니다.",
    visual: "brand",
    isConcept: true,
    relatedService: "brand-website",
  },
  {
    slug: "concept-landing",
    title: "Ledger Advisory",
    industry: "재무 자문 서비스",
    category: "LANDING",
    type: "랜딩페이지",
    scope: ["카피 구조 설계", "폼 설계", "UI 디자인"],
    summary: "하나의 행동, 상담 신청에 집중한 단일 페이지 랜딩 콘셉트.",
    problem: "광고로 유입된 방문자가 긴 설명에 지쳐 문의 전에 이탈하는 상황을 가정했습니다.",
    direction: "첫 화면의 약속, 근거, 절차, 신청 폼만 남기고 모든 요소를 하나의 목표에 맞췄습니다.",
    implementation: "입력 항목을 최소화한 폼과 모바일 고정 CTA, 분석 도구 연동 지점을 설계했습니다.",
    result: "콘셉트 작업물입니다. 전환율 등 성과 수치는 존재하지 않습니다.",
    visual: "landing",
    isConcept: true,
    relatedService: "landing-page",
  },
  {
    slug: "concept-dashboard",
    title: "Fieldnote Ops",
    industry: "B2B 업무 플랫폼",
    category: "CUSTOM",
    type: "맞춤형 웹 개발",
    scope: ["업무 흐름 설계", "대시보드 UI", "권한 구조 설계"],
    summary: "문의·진행 상태·담당자를 한 화면에서 관리하는 내부 도구 콘셉트.",
    problem: "엑셀과 메신저로 관리하던 업무 상태가 흩어져 누락이 생기는 상황을 가정했습니다.",
    direction: "밀도 높은 테이블과 명확한 상태 표기로 정보를 빠르게 훑을 수 있게 했습니다.",
    implementation: "상태 필터, 검색, 상세 패널, 권한별 접근 구조를 설계했습니다.",
    result: "콘셉트 작업물입니다. 실제 서비스가 아닌 설계 예시입니다.",
    visual: "dashboard",
    isConcept: true,
    relatedService: "custom-development",
  },
];
