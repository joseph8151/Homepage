import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { adminClient, isDbConfigured, INQUIRY_BUCKET } from "@/lib/supabase";
import { clientIp, matchesSignature, rateLimit, sameOrigin } from "@/lib/security";
import { FILE_RULES, REQUIRED_KEYS, OPTIONAL_KEYS, normalizeUrl, validateField, type InquiryInput } from "@/lib/validation";
import { budgetOptions, contactMethods, PRIVACY_CONSENT_VERSION, timelineOptions } from "@/content/site";
import { defaultServices } from "@/content/services";

export const runtime = "nodejs";

const opts = {
  budgets: budgetOptions,
  timelines: timelineOptions,
  contacts: contactMethods,
  services: defaultServices.map((s) => s.slug),
};

const fail = (status: number, code: string, message: string, fields?: Record<string, string>) =>
  NextResponse.json({ ok: false, code, message, fields }, { status });

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail(403, "FORBIDDEN", "허용되지 않은 요청입니다.");

  const ip = clientIp(req);
  if (!rateLimit(`inq:${ip}`, 5, 10 * 60_000)) return fail(429, "RATE_LIMITED", "짧은 시간에 너무 많은 요청이 있었습니다. 잠시 후 다시 시도해 주세요.");

  if (!isDbConfigured())
    return fail(503, "NOT_CONFIGURED", "상담 접수 시스템(데이터베이스)이 아직 연결되지 않아 신청을 저장할 수 없습니다. 접수되지 않았으니 다른 방법으로 문의해 주세요.");

  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return fail(400, "BAD_REQUEST", "요청 형식이 올바르지 않습니다.");
  }

  // 스팸 방어: 허니팟 + 최소 입력 시간. 봇에게는 성공처럼 보이게 응답하되 저장하지 않습니다.
  const honeypot = String(fd.get("contact_url") || "");
  const startedAt = Number(fd.get("_t") || 0);
  if (honeypot || (startedAt && Date.now() - startedAt < 2500)) return NextResponse.json({ ok: true });

  const str = (k: string, max = 6000) => String(fd.get(k) ?? "").trim().slice(0, max);
  let services: string[] = [];
  try {
    const parsed = JSON.parse(String(fd.get("selected_services") || "[]"));
    if (Array.isArray(parsed)) services = parsed.filter((s) => typeof s === "string").slice(0, 25);
  } catch {}

  const input: InquiryInput = {
    name: str("name", 200),
    company: str("company", 300),
    email: str("email", 300).toLowerCase(),
    phone: str("phone", 50),
    selected_services: services,
    budget: str("budget", 100),
    timeline: str("timeline", 100),
    project_description: str("project_description", 6000),
    current_website: str("current_website", 500),
    reference_website: str("reference_website", 500),
    preferred_contact: str("preferred_contact", 50),
    privacy_consent: fd.get("privacy_consent") === "true",
  };

  const errors: Record<string, string> = {};
  for (const k of [...REQUIRED_KEYS, ...OPTIONAL_KEYS]) {
    const m = validateField(k, input, opts);
    if (m) errors[k] = m;
  }

  // 파일 검증
  const file = fd.get("attachment");
  let fileBuf: Buffer | null = null;
  let ext = "";
  if (file instanceof File && file.size > 0) {
    ext = (file.name.split(".").pop() || "").toLowerCase();
    if (!FILE_RULES.extensions.includes(ext)) errors.file = `허용되지 않는 파일 형식입니다. (${FILE_RULES.extensions.join(", ")})`;
    else if (file.size > FILE_RULES.maxBytes) errors.file = "파일 크기는 10MB 이하여야 합니다.";
    else {
      fileBuf = Buffer.from(await file.arrayBuffer());
      if (!matchesSignature(ext, fileBuf.subarray(0, 8))) {
        errors.file = "파일 내용이 확장자와 일치하지 않습니다.";
        fileBuf = null;
      }
    }
  }

  if (Object.keys(errors).length) return fail(422, "VALIDATION", "입력 내용을 확인해 주세요.", errors);

  const db = adminClient();
  let attachmentPath: string | null = null;
  if (fileBuf) {
    // 원본 파일명은 사용하지 않고 랜덤 경로에 저장합니다.
    const contentTypes: Record<string, string> = { pdf: "application/pdf", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg" };
    attachmentPath = `${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${ext}`;
    const up = await db.storage.from(INQUIRY_BUCKET).upload(attachmentPath, fileBuf, {
      contentType: contentTypes[ext] ?? "application/octet-stream",
      upsert: false,
    });
    if (up.error) {
      console.error("[inquiry] upload failed", up.error.message);
      return fail(500, "UPLOAD_FAILED", "파일 업로드에 실패했습니다. 파일 없이 다시 시도하시거나 잠시 후 시도해 주세요.");
    }
  }

  const { error } = await db.from("inquiries").insert({
    name: input.name,
    company: input.company,
    email: input.email,
    phone: input.phone,
    selected_services: input.selected_services,
    budget: input.budget,
    timeline: input.timeline,
    project_description: input.project_description,
    current_website: normalizeUrl(input.current_website) || null,
    reference_website: normalizeUrl(input.reference_website) || null,
    attachment_path: attachmentPath,
    preferred_contact: input.preferred_contact || null,
    privacy_consent: true,
    consent_version: PRIVACY_CONSENT_VERSION,
    status: "NEW",
  });

  if (error) {
    console.error("[inquiry] insert failed", error.message);
    if (attachmentPath) await db.storage.from(INQUIRY_BUCKET).remove([attachmentPath]);
    return fail(500, "SAVE_FAILED", "상담 신청을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
  }
  return NextResponse.json({ ok: true });
}
