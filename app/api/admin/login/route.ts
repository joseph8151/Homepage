import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, signIn } from "@/lib/admin-auth";
import { isAuthConfigured } from "@/lib/supabase";
import { clientIp, rateLimit, sameOrigin } from "@/lib/security";

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return NextResponse.json({ ok: false, message: "허용되지 않은 요청입니다." }, { status: 403 });
  if (!isAuthConfigured()) return NextResponse.json({ ok: false, message: "관리자 인증(Supabase)이 설정되지 않았습니다." }, { status: 503 });
  if (!rateLimit(`login:${clientIp(req)}`, 8, 10 * 60_000))
    return NextResponse.json({ ok: false, message: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요." }, { status: 429 });

  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!email || !password) return NextResponse.json({ ok: false, message: "이메일과 비밀번호를 입력해 주세요." }, { status: 400 });

  const session = await signIn(email, password);
  // 계정 존재 여부를 노출하지 않도록 동일한 메시지를 사용합니다.
  if (!session) return NextResponse.json({ ok: false, message: "로그인 정보가 올바르지 않거나 관리자 권한이 없습니다." }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: session.maxAge,
  });
  return res;
}
