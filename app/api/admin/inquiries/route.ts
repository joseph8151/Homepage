import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin-auth";
import { bucket, db } from "@/lib/cf";
import { csvCell, sameOrigin } from "@/lib/security";
import { inquiryStatuses } from "@/content/site";
import { defaultServices } from "@/content/services";

const unauthorized = () => NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
const svcName = (slug: string) => defaultServices.find((s) => s.slug === slug)?.name ?? slug;
type Row = Record<string, any>;
const parse = (r: Row): Row => ({ ...r, selected_services: safeJson(r.selected_services), privacy_consent: !!r.privacy_consent });
const safeJson = (s: string): string[] => { try { const v = JSON.parse(s); return Array.isArray(v) ? v : []; } catch { return []; } };

export async function GET(req: NextRequest) {
  if (!(await getAdmin(req))) return unauthorized();
  const sp = req.nextUrl.searchParams;
  const status = sp.get("status") || "";
  const service = sp.get("service") || "";
  const q = (sp.get("q") || "").trim().replace(/[%_\\]/g, " ").slice(0, 60);

  const where: string[] = []; const args: unknown[] = [];
  if (status && (inquiryStatuses as readonly string[]).includes(status)) { where.push("status = ?"); args.push(status); }
  if (service && defaultServices.some((s) => s.slug === service)) { where.push("selected_services LIKE ?"); args.push(`%"${service}"%`); }
  if (q) { where.push("(name LIKE ? OR company LIKE ? OR email LIKE ? OR phone LIKE ?)"); args.push(...Array(4).fill(`%${q}%`)); }
  let rows: Row[];
  try {
    const d = await db();
    rows = (await d.prepare(`SELECT * FROM inquiries ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY created_at DESC LIMIT 2000`).bind(...args).all<Row>()).results;
  } catch { return NextResponse.json({ message: "조회에 실패했습니다." }, { status: 500 }); }
  const items = rows.map(parse);

  if (sp.get("format") === "csv") {
    const head = ["접수일시", "상태", "성함", "회사/브랜드", "이메일", "연락처", "관심 서비스", "예산", "일정", "프로젝트 내용", "기존 URL", "참고 URL", "첨부", "연락 선호", "동의버전", "관리자 메모"];
    const lines = items.map((r) => [r.created_at, r.status, r.name, r.company, r.email, r.phone, r.selected_services.map(svcName), r.budget, r.timeline, r.project_description, r.current_website, r.reference_website, r.attachment_path ? "있음" : "", r.preferred_contact, r.consent_version, r.admin_note].map(csvCell).join(","));
    return new NextResponse("﻿" + [head.map(csvCell).join(","), ...lines].join("\r\n"), {
      headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="inquiries-${new Date().toISOString().slice(0, 10)}.csv"` },
    });
  }
  return NextResponse.json({ items });
}

export async function PATCH(req: NextRequest) {
  if (!sameOrigin(req)) return NextResponse.json({ message: "허용되지 않은 요청입니다." }, { status: 403 });
  if (!(await getAdmin(req))) return unauthorized();
  const b = await req.json().catch(() => null);
  const sets: string[] = []; const args: unknown[] = [];
  if (b?.status !== undefined) { if (!(inquiryStatuses as readonly string[]).includes(b.status)) return NextResponse.json({ message: "잘못된 상태 값입니다." }, { status: 400 }); sets.push("status = ?"); args.push(b.status); }
  if (b?.admin_note !== undefined) { if (typeof b.admin_note !== "string" || b.admin_note.length > 4000) return NextResponse.json({ message: "메모는 4,000자 이내로 입력해 주세요." }, { status: 400 }); sets.push("admin_note = ?"); args.push(b.admin_note); }
  if (typeof b?.id !== "string" || !sets.length) return NextResponse.json({ message: "잘못된 요청입니다." }, { status: 400 });
  try { await (await db()).prepare(`UPDATE inquiries SET ${sets.join(", ")} WHERE id = ?`).bind(...args, b.id).run(); } catch { return NextResponse.json({ message: "저장하지 못했습니다." }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}

/** 보존 기간이 지난 상담 데이터의 삭제(첨부파일 포함). */
export async function DELETE(req: NextRequest) {
  if (!sameOrigin(req)) return NextResponse.json({ message: "허용되지 않은 요청입니다." }, { status: 403 });
  if (!(await getAdmin(req))) return unauthorized();
  const b = await req.json().catch(() => null);
  if (typeof b?.id !== "string") return NextResponse.json({ message: "잘못된 요청입니다." }, { status: 400 });
  try {
    const d = await db();
    const row = await d.prepare("SELECT attachment_path FROM inquiries WHERE id = ?").bind(b.id).first<Row>();
    if (row?.attachment_path) await bucket()?.delete(row.attachment_path);
    await d.prepare("DELETE FROM inquiries WHERE id = ?").bind(b.id).run();
  } catch { return NextResponse.json({ message: "삭제하지 못했습니다." }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
