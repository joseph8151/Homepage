import { getSite } from "@/lib/content";
import { Legal } from "@/components/Legal";
import { PRIVACY_CONSENT_VERSION } from "@/content/site";
import { meta } from "@/lib/seo";

export const revalidate = 60;
export const metadata = meta({ title: "이용약관", description: "웹사이트 이용 및 상담 신청, 제작 서비스 안내에 관한 기본 약관입니다.", path: "/terms" });

export default async function Terms() {
  const s = await getSite();
  const name = s.companyName || s.brandName;
  return (
    <Legal label="Terms" title="이용약관" updated={PRIVACY_CONSENT_VERSION.replaceAll("-", ".")}>
      <section><h2>제1조 (목적)</h2><p>이 약관은 {name}(이하 “회사”)이 운영하는 웹사이트의 이용 조건과 절차, 회사와 이용자의 권리·의무를 정함을 목적으로 합니다.</p></section>
      <section><h2>제2조 (서비스의 내용)</h2><p>회사는 홈페이지 제작 및 관련 웹 서비스에 대한 정보 제공과 상담 신청 접수를 제공합니다. 상담 신청은 계약의 체결을 의미하지 않으며, 제작 계약은 별도의 견적과 계약서에 따릅니다.</p></section>
      <section><h2>제3조 (견적 및 가격)</h2><p>이 사이트에 표시된 가격 정보는 안내용이며, 실제 제작 비용과 기간은 요구사항 확인 후 서면 견적으로 확정됩니다.</p></section>
      <section><h2>제4조 (이용자의 의무)</h2><ul><li>허위 정보 입력, 타인의 정보 도용, 스팸·자동화된 대량 요청을 해서는 안 됩니다.</li><li>사이트의 정상 운영을 방해하는 행위를 해서는 안 됩니다.</li></ul></section>
      <section><h2>제5조 (지식재산권)</h2><p>사이트의 콘텐츠에 대한 권리는 회사에 있습니다. 사이트에 게시된 포트폴리오 중 Concept Project로 표시된 작업물은 회사가 자체 제작한 가상의 프로젝트입니다.</p></section>
      <section><h2>제6조 (책임의 제한)</h2><p>회사는 천재지변, 통신 장애 등 불가항력으로 인한 서비스 중단에 책임을 지지 않으며, 사이트의 정보는 검색 노출이나 사업 성과를 보증하지 않습니다.</p></section>
      <section><h2>제7조 (문의)</h2><p>이메일: {s.email || "(운영 전 기재)"} / 연락처: {s.phone || "(운영 전 기재)"}</p></section>
    </Legal>
  );
}
