import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { bucket, db, hasDb } from "@/lib/cf";
import { clientIp, matchesSignature, rateLimit, sameOrigin } from "@/lib/security";
import { FILE_RULES, REQUIRED_KEYS, OPTIONAL_KEYS, normalizeUrl, validateField, type InquiryInput } from "@/lib/validation";
import { budgetOptions, contactMethods, PRIVACY_CONSENT_VERSION, timelineOptions } from "@/content/site";
import { defaultServices } from "@/content/services";
import { notifyNewInquiry } from "@/lib/notify";

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

  if (!hasDb())
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

  const d = await db().catch(() => null);
  if (!d) return fail(503, "NOT_CONFIGURED", "상담 접수 시스템(데이터베이스)에 연결하지 못했습니다. 접수되지 않았으니 다른 방법으로 문의해 주세요.");
  const files = bucket();
  let attachmentPath: string | null = null;
  if (fileBuf) {
    if (!files) return fail(503, "NOT_CONFIGURED", "파일 저장소(R2)가 연결되지 않아 첨부할 수 없습니다. 파일 없이 신청해 주세요.");
    // 원본 파일명은 사용하지 않고 랜덤 경로에 저장합니다.
    const contentTypes: Record<string, string> = { pdf: "application/pdf", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg" };
    attachmentPath = `${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${ext}`;
    try {
      await files.put(attachmentPath, fileBuf, { httpMetadata: { contentType: contentTypes[ext] ?? "application/octet-stream" } });
    } catch (e) {
      console.error("[inquiry] upload failed", String(e));
      return fail(500, "UPLOAD_FAILED", "파일 업로드에 실패했습니다. 파일 없이 다시 시도하시거나 잠시 후 시도해 주세요.");
    }
  }

  try {
    await d.prepare(`INSERT INTO inquiries (id, created_at, name, company, email, phone, selected_services, budget, timeline, project_description,
      current_website, reference_website, attachment_path, preferred_contact, privacy_consent, consent_version, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, 'NEW')`).bind(
      randomUUID(), new Date().toISOString(), input.name, input.company, input.email, input.phone, JSON.stringify(input.selected_services),
      input.budget, input.timeline, input.project_description, normalizeUrl(input.current_website) || null, normalizeUrl(input.reference_website) || null,
      attachmentPath, input.preferred_contact || null, PRIVACY_CONSENT_VERSION).run();
  } catch (e) {
    console.error("[inquiry] insert failed", String(e));
    if (attachmentPath) await files?.delete(attachmentPath).catch(() => {});
    return fail(500, "SAVE_FAILED", "상담 신청을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
  }
  // 알림은 저장 성공 이후에만, 실패해도 접수에는 영향 없음
  await notifyNewInquiry({ name: input.name, company: input.company, services: input.selected_services, budget: input.budget, timeline: input.timeline, hasFile: !!attachmentPath });
  return NextResponse.json({ ok: true });
}
