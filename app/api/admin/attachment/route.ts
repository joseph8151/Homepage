import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin-auth";
import { bucket, db } from "@/lib/cf";

/** 관리자 인증 후에만 R2의 첨부파일을 내려줍니다. 버킷은 공개되어 있지 않습니다. */
export async function GET(req: NextRequest) {
  if (!(await getAdmin(req))) return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ message: "잘못된 요청입니다." }, { status: 400 });
  const row = await (await db()).prepare("SELECT attachment_path FROM inquiries WHERE id = ?").bind(id).first<{ attachment_path: string | null }>();
  if (!row?.attachment_path) return NextResponse.json({ message: "첨부파일이 없습니다." }, { status: 404 });
  const obj = await bucket()?.get(row.attachment_path);
  if (!obj) return NextResponse.json({ message: "파일을 불러오지 못했습니다." }, { status: 404 });
  const ext = row.attachment_path.split(".").pop();
  return new NextResponse(obj.body, { headers: {
    "Content-Type": obj.httpMetadata?.contentType || "application/octet-stream",
    "Content-Disposition": `attachment; filename="attachment-${id.slice(0, 8)}.${ext}"`,
    "X-Content-Type-Options": "nosniff",
  } });
}
