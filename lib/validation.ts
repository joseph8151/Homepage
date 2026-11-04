/** 클라이언트·서버 공용 검증 규칙. 서버 검증이 최종 기준입니다. */
export type InquiryInput = {
  name: string;
  company: string;
  email: string;
  phone: string;
  selected_services: string[];
  budget: string;
  timeline: string;
  project_description: string;
  current_website: string;
  reference_website: string;
  preferred_contact: string;
  privacy_consent: boolean;
};

export type FieldErrors = Partial<Record<keyof InquiryInput | "file", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// 010-1234-5678, 01012345678, 02-123-4567, 031-123-4567, 1588-1234, +82 10 1234 5678
const PHONE_RE = /^(?:\+?82[-\s]?)?(?:0?1[016789]|0?2|0?[3-6][1-5]|0?70|1[5-9]\d\d)[-\s]?\d{3,4}[-\s]?\d{0,4}$/;

export const isEmail = (v: string) => v.length <= 254 && EMAIL_RE.test(v);
export const isPhone = (v: string) => {
  const digits = v.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 12 && PHONE_RE.test(v.trim());
};
export function normalizeUrl(v: string): string | null {
  const t = v.trim();
  if (!t) return "";
  const withProto = /^https?:\/\//i.test(t) ? t : `https://${t}`;
  try {
    const u = new URL(withProto);
    if (!["http:", "https:"].includes(u.protocol) || !u.hostname.includes(".")) return null;
    return u.toString();
  } catch {
    return null;
  }
}

export function validateField(
  key: keyof InquiryInput,
  v: InquiryInput,
  opts: { budgets: readonly string[]; timelines: readonly string[]; services: readonly string[]; contacts: readonly string[] },
): string | undefined {
  switch (key) {
    case "name":
      if (!v.name.trim()) return "담당자 성함을 입력해 주세요.";
      if (v.name.trim().length > 50) return "성함은 50자 이내로 입력해 주세요.";
      return;
    case "company":
      if (!v.company.trim()) return "회사명 또는 브랜드명을 입력해 주세요. 개인이라면 이름을 적어 주셔도 됩니다.";
      if (v.company.trim().length > 100) return "100자 이내로 입력해 주세요.";
      return;
    case "email":
      if (!v.email.trim()) return "이메일을 입력해 주세요.";
      if (!isEmail(v.email.trim())) return "이메일 형식이 올바르지 않습니다. 예: name@company.com";
      return;
    case "phone":
      if (!v.phone.trim()) return "연락처를 입력해 주세요.";
      if (!isPhone(v.phone)) return "연락처 형식이 올바르지 않습니다. 예: 010-1234-5678";
      return;
    case "selected_services":
      if (!v.selected_services.length) return "관심 서비스를 1개 이상 선택해 주세요.";
      if (v.selected_services.length > 20 || v.selected_services.some((s) => !opts.services.includes(s))) return "선택한 서비스 값이 올바르지 않습니다.";
      return;
    case "budget":
      if (!v.budget) return "예상 예산을 선택해 주세요. 정해지지 않았다면 '예산 협의 필요'를 선택하세요.";
      if (!opts.budgets.includes(v.budget)) return "예산 값이 올바르지 않습니다.";
      return;
    case "timeline":
      if (!v.timeline) return "희망 제작 일정을 선택해 주세요.";
      if (!opts.timelines.includes(v.timeline)) return "일정 값이 올바르지 않습니다.";
      return;
    case "project_description": {
      const n = v.project_description.trim().length;
      if (n < 10) return "프로젝트 내용을 10자 이상 적어 주세요. 목적과 필요한 기능을 간단히만 알려주셔도 됩니다.";
      if (n > 5000) return "프로젝트 내용은 5,000자 이내로 입력해 주세요.";
      return;
    }
    case "current_website":
    case "reference_website":
      if (v[key].trim() && normalizeUrl(v[key]) === null) return "주소 형식이 올바르지 않습니다. 예: https://example.com";
      return;
    case "preferred_contact":
      if (v.preferred_contact && !opts.contacts.includes(v.preferred_contact)) return "연락 방식 값이 올바르지 않습니다.";
      return;
    case "privacy_consent":
      if (!v.privacy_consent) return "개인정보 수집·이용에 동의하셔야 상담 신청이 가능합니다.";
      return;
  }
}

export const REQUIRED_KEYS: (keyof InquiryInput)[] = [
  "name", "company", "email", "phone", "selected_services", "budget", "timeline", "project_description", "privacy_consent",
];
export const OPTIONAL_KEYS: (keyof InquiryInput)[] = ["current_website", "reference_website", "preferred_contact"];

export const FILE_RULES = {
  maxBytes: 10 * 1024 * 1024,
  extensions: ["pdf", "png", "jpg", "jpeg", "zip", "docx", "pptx", "xlsx", "hwp", "hwpx"],
};
