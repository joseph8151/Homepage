/** 프로젝트 범위 진단 — 가격이 아니라 '규모 수준'과 권장 패키지·서비스를 계산합니다(참고용). */
export const projectTypes = [
  { id: "corporate", label: "기업·브랜드 홈페이지", base: 2, services: ["corporate-website"], pkg: "business" },
  { id: "commerce", label: "쇼핑몰", base: 4, services: ["ecommerce", "payment-integration"], pkg: "commerce" },
  { id: "landing", label: "랜딩페이지 (단일 페이지)", base: 1, services: ["landing-page"], pkg: "starter" },
  { id: "pro", label: "병원·법률·교육 등 전문 분야", base: 2, services: ["professional-website"], pkg: "business" },
  { id: "redesign", label: "기존 사이트 리뉴얼", base: 2, services: ["website-redesign"], pkg: "business" },
  { id: "custom", label: "회원·데이터 등 맞춤 시스템", base: 5, services: ["custom-development"], pkg: "enterprise" },
] as const;

export const pageSizes = [
  { id: "1", label: "1페이지", w: 0 },
  { id: "5", label: "5페이지 내외", w: 1 },
  { id: "10", label: "10페이지 내외", w: 2 },
  { id: "20", label: "20페이지 이상", w: 3 },
] as const;

export const featureOptions = [
  { id: "form", label: "상담·문의 폼", w: 0, services: [] as string[] },
  { id: "cms", label: "공지·블로그·상품을 직접 수정(관리 화면)", w: 1, services: ["cms"] },
  { id: "member", label: "회원가입·로그인", w: 2, services: ["custom-development"] },
  { id: "payment", label: "온라인 결제", w: 2, services: ["payment-integration"] },
  { id: "booking", label: "예약·일정 관리", w: 2, services: ["booking-website"] },
  { id: "multi", label: "다국어(국문·영문 등)", w: 2, services: ["multilingual-website"] },
  { id: "api", label: "외부 서비스·CRM 연동", w: 2, services: ["crm-automation"] },
  { id: "dash", label: "관리자 대시보드·데이터 관리", w: 2, services: ["custom-development"] },
  { id: "seo", label: "검색 노출 설정(SEO)", w: 0, services: ["seo"] },
  { id: "care", label: "출시 후 유지관리", w: 0, services: ["maintenance"] },
] as const;

export const contentStates = [
  { id: "ready", label: "문구·이미지가 대부분 준비됨", w: 0 },
  { id: "partial", label: "일부만 준비됨", w: 1 },
  { id: "none", label: "거의 없음 (함께 정리 필요)", w: 2 },
] as const;

const levels = [
  { max: 3, name: "Light", desc: "페이지 수와 기능이 많지 않은 규모입니다. 핵심 메시지와 문의 동선 설계에 집중하는 프로젝트입니다." },
  { max: 6, name: "Standard", desc: "여러 페이지와 일부 기능이 결합된 일반적인 기업 사이트 규모입니다. 정보 구조 설계와 콘텐츠 준비가 일정의 핵심입니다." },
  { max: 9, name: "Extended", desc: "기능과 연동이 포함된 규모입니다. 요구사항 정의와 단계별 검수가 중요하며, 외부 서비스 일정(PG 심사 등)을 함께 고려해야 합니다." },
  { max: 99, name: "Complex", desc: "맞춤 개발 성격이 강한 규모입니다. 요구사항 정의서와 단계별 개발·검수 계획을 먼저 합의하는 것이 안전합니다." },
] as const;

export type EstimateInput = { type: string; pages: string; features: string[]; content: string };

export function evaluate(i: EstimateInput) {
  const t = projectTypes.find((x) => x.id === i.type);
  const p = pageSizes.find((x) => x.id === i.pages);
  const c = contentStates.find((x) => x.id === i.content);
  if (!t || !p || !c) return null;
  const feats = featureOptions.filter((f) => i.features.includes(f.id));
  const score = t.base + p.w + c.w + feats.reduce((a, f) => a + f.w, 0);
  const level = levels.find((l) => score <= l.max)!;
  const heavy = feats.some((f) => ["member", "api", "dash"].includes(f.id)) || t.id === "custom";
  const pkg = heavy ? "enterprise" : t.id === "commerce" || feats.some((f) => f.id === "payment") ? "commerce" : level.name === "Light" && t.id !== "pro" ? "starter" : "business";
  const services = Array.from(new Set([...t.services, ...feats.flatMap((f) => f.services)]));
  const notes: string[] = [];
  if (feats.some((f) => f.id === "payment") || t.id === "commerce") notes.push("PG사 가입·심사는 사업자 명의로 진행되며 시간이 걸릴 수 있습니다. 제작과 병행해 먼저 시작하세요.");
  if (c.id === "none") notes.push("콘텐츠가 없는 경우 문구·이미지 준비가 전체 일정에 가장 큰 영향을 줍니다. 기획 단계에서 함께 정리합니다.");
  if (feats.some((f) => f.id === "multi")) notes.push("번역 콘텐츠는 고객사 제공 또는 별도 협의가 필요합니다.");
  if (t.id === "redesign") notes.push("기존 URL·검색 유입 현황과 관리자 계정 정보를 미리 준비해 주세요.");
  const summary = `[범위 진단 결과 · 참고용]\n유형: ${t.label}\n규모: ${p.label}\n필요 기능: ${feats.map((f) => f.label).join(", ") || "선택 없음"}\n콘텐츠 준비: ${c.label}\n진단 수준: ${level.name}`;
  return { score, level, pkg, services, notes, summary };
}
