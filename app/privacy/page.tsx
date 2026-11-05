import { getSite } from "@/lib/content";
import { Legal } from "@/components/Legal";
import { PRIVACY_CONSENT_VERSION } from "@/content/site";
import { meta } from "@/lib/seo";

export const metadata = meta({ title: "개인정보처리방침", description: "상담 신청 시 수집하는 개인정보의 항목, 이용 목적, 보유 기간 및 이용자의 권리를 안내합니다.", path: "/privacy" });

export default async function Privacy() {
  const s = await getSite();
  const name = s.companyName || s.brandName;
  return (
    <Legal label="Privacy" title="개인정보처리방침" updated={PRIVACY_CONSENT_VERSION.replaceAll("-", ".")}>
      <section><h2>1. 수집하는 개인정보 항목</h2><p>{name}(이하 “회사”)은 상담 신청을 위해 아래 정보를 수집합니다.</p>
        <ul><li>필수: 담당자 성함, 회사명 또는 브랜드명, 이메일, 연락처, 관심 서비스, 예상 예산, 희망 일정, 프로젝트 상세 내용</li><li>선택: 기존 홈페이지 URL, 참고 사이트 URL, 첨부 파일, 연락 선호 방식</li><li>자동 수집: 접속 IP(요청 제한 및 부정 이용 방지 목적, 장기 저장하지 않음)</li></ul></section>
      <section><h2>2. 수집·이용 목적</h2><ul><li>상담 신청 접수 및 제작 방향·견적 안내</li><li>상담 진행 상태 관리 및 후속 연락</li><li>스팸·부정 이용 방지</li></ul></section>
      <section><h2>3. 보유 및 이용 기간</h2><p>상담 종결 후 3년간 보관한 뒤 지체 없이 파기합니다. 이용자가 삭제를 요청하는 경우 관련 법령에 따라 보관이 필요한 경우를 제외하고 즉시 파기합니다.</p></section>
      <section><h2>4. 제3자 제공 및 처리 위탁</h2><p>회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 데이터 저장 및 호스팅을 위해 클라우드 서비스(예: Cloudflare)를 이용할 수 있으며, 실제 이용하는 수탁자와 위탁 업무는 운영 전 이 항목에 기재하십시오.</p></section>
      <section><h2>5. 이용자의 권리</h2><p>이용자는 언제든지 개인정보의 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다. 아래 연락처로 요청해 주십시오.</p></section>
      <section><h2>6. 안전성 확보 조치</h2><ul><li>데이터베이스 접근 권한 제한 및 관리자 인증</li><li>첨부파일의 비공개 저장 및 접근 통제</li><li>전송 구간 암호화(HTTPS)</li></ul></section>
      <section><h2>7. 개인정보 보호책임자 및 문의</h2><p>{s.representative ? `책임자: ${s.representative}` : "책임자: (운영 전 기재)"}<br />이메일: {s.email || "(운영 전 기재)"}<br />연락처: {s.phone || "(운영 전 기재)"}</p></section>
    </Legal>
  );
}
