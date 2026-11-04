import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin-auth";
import { adminClient, INQUIRY_BUCKET } from "@/lib/supabase";

/** 관리자 인증 후 60초짜리 서명 URL로 이동시킵니다. 비공개 버킷이므로 미인증 접근은 불가능합니다. */
export async function GET(req: NextRequest) {
  if (!(await getAdmin(req))) return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ message: "잘못된 요청입니다." }, { status: 400 });
  const db = adminClient();
  const { data } = await db.from("inquiries").select("attachment_path").eq("id", id).maybeSingle();
  if (!data?.attachment_path) return NextResponse.json({ message: "첨부파일이 없습니다." }, { status: 404 });
  const signed = await db.storage.from(INQUIRY_BUCKET).createSignedUrl(data.attachment_path, 60, { download: true });
  if (signed.error || !signed.data) return NextResponse.json({ message: "파일을 불러오지 못했습니다." }, { status: 500 });
  return NextResponse.redirect(signed.data.signedUrl);
}
