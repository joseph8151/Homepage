import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin-auth";
import { adminClient, INQUIRY_BUCKET } from "@/lib/supabase";
import { csvCell, sameOrigin } from "@/lib/security";
import { inquiryStatuses } from "@/content/site";
import { defaultServices } from "@/content/services";

const unauthorized = () => NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
const svcName = (slug: string) => defaultServices.find((s) => s.slug === slug)?.name ?? slug;

export async function GET(req: NextRequest) {
  if (!(await getAdmin(req))) return unauthorized();
  const sp = req.nextUrl.searchParams;
  const status = sp.get("status") || "";
  const service = sp.get("service") || "";
  const q = (sp.get("q") || "").trim().replace(/[%,()]/g, " ").slice(0, 60);

  let query = adminClient().from("inquiries").select("*").order("created_at", { ascending: false }).limit(2000);
  if (status && (inquiryStatuses as readonly string[]).includes(status)) query = query.eq("status", status);
  if (service) query = query.contains("selected_services", [service]);
  if (q) query = query.or(`name.ilike.%${q}%,company.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`);
  const { data, error } = await query;
  if (error) return NextResponse.json({ message: "조회에 실패했습니다." }, { status: 500 });

  if (sp.get("format") === "csv") {
    const head = ["접수일시", "상태", "성함", "회사/브랜드", "이메일", "연락처", "관심 서비스", "예산", "일정", "프로젝트 내용", "기존 URL", "참고 URL", "첨부", "연락 선호", "동의버전"];
    const rows = (data ?? []).map((r) =>
      [
        r.created_at, r.status, r.name, r.company, r.email, r.phone,
        (r.selected_services as string[]).map(svcName), r.budget, r.timeline, r.project_description,
        r.current_website, r.reference_website, r.attachment_path ? "있음" : "", r.preferred_contact, r.consent_version,
      ].map(csvCell).join(","),
    );
    const csv = "﻿" + [head.map(csvCell).join(","), ...rows].join("\r\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="inquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }
  return NextResponse.json({ items: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  if (!sameOrigin(req)) return NextResponse.json({ message: "허용되지 않은 요청입니다." }, { status: 403 });
  if (!(await getAdmin(req))) return unauthorized();
  const b = await req.json().catch(() => null);
  if (!b?.id || !(inquiryStatuses as readonly string[]).includes(b.status))
    return NextResponse.json({ message: "잘못된 요청입니다." }, { status: 400 });
  const { error } = await adminClient().from("inquiries").update({ status: b.status }).eq("id", b.id);
  if (error) return NextResponse.json({ message: "상태를 변경하지 못했습니다." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

/** 보존 기간이 지난 상담 데이터의 삭제(첨부파일 포함). */
export async function DELETE(req: NextRequest) {
  if (!sameOrigin(req)) return NextResponse.json({ message: "허용되지 않은 요청입니다." }, { status: 403 });
  if (!(await getAdmin(req))) return unauthorized();
  const b = await req.json().catch(() => null);
  if (!b?.id) return NextResponse.json({ message: "잘못된 요청입니다." }, { status: 400 });
  const db = adminClient();
  const { data } = await db.from("inquiries").select("attachment_path").eq("id", b.id).maybeSingle();
  if (data?.attachment_path) await db.storage.from(INQUIRY_BUCKET).remove([data.attachment_path]);
  const { error } = await db.from("inquiries").delete().eq("id", b.id);
  if (error) return NextResponse.json({ message: "삭제하지 못했습니다." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
