import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin-auth";
import { hasAuth } from "@/lib/cf";

export async function GET(req: NextRequest) {
  if (!hasAuth()) return NextResponse.json({ configured: false }, { status: 200 });
  const admin = await getAdmin(req);
  if (!admin) return NextResponse.json({ configured: true, authenticated: false }, { status: 401 });
  return NextResponse.json({ configured: true, authenticated: true, email: admin.email });
}
