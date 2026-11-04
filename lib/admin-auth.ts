import { NextRequest } from "next/server";
import { anonClient, adminClient, isAuthConfigured } from "./supabase";

export const ADMIN_COOKIE = "adm_at";

const adminEmails = () =>
  (process.env.ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

export const isAdminEmail = (email?: string | null) => !!email && adminEmails().includes(email.toLowerCase());

/** 쿠키의 액세스 토큰을 Supabase Auth 서버에서 검증하고, 허용된 관리자 이메일인지 확인합니다. */
export async function getAdmin(req: NextRequest): Promise<{ email: string } | null> {
  if (!isAuthConfigured()) return null;
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const { data, error } = await adminClient().auth.getUser(token);
  if (error || !data.user?.email || !isAdminEmail(data.user.email)) return null;
  return { email: data.user.email };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await anonClient().auth.signInWithPassword({ email, password });
  if (error || !data.session || !isAdminEmail(data.user?.email)) return null;
  return { token: data.session.access_token, maxAge: data.session.expires_in };
}
