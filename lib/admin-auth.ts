import { NextRequest } from "next/server";
import { hasAuth, secret } from "./cf";

export const ADMIN_COOKIE = "adm_s";
const TTL = 60 * 60 * 8; // 8시간

const enc = new TextEncoder();
const b64 = (b: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64 = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

async function hmac(data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret("SESSION_SECRET") || secret("ADMIN_PASSWORD")), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}
const safeEq = (a: Uint8Array, b: Uint8Array) => { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a[i] ^ b[i]; return d === 0; };

const admins = () => secret("ADMIN_EMAILS").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

/** 이메일·비밀번호 검증(타이밍 안전 비교). 성공 시 서명된 세션 토큰 반환. */
export async function signIn(email: string, password: string): Promise<{ token: string; maxAge: number } | null> {
  if (!hasAuth()) return null;
  const okEmail = admins().includes(email.trim().toLowerCase());
  const [a, b] = await Promise.all([hmac("pw:" + password), hmac("pw:" + secret("ADMIN_PASSWORD"))]);
  if (!okEmail || !safeEq(a, b)) return null;
  const payload = b64(enc.encode(JSON.stringify({ e: email.trim().toLowerCase(), x: Math.floor(Date.now() / 1000) + TTL })));
  return { token: `${payload}.${b64(await hmac("s:" + payload))}`, maxAge: TTL };
}

export async function getAdmin(req: NextRequest): Promise<{ email: string } | null> {
  if (!hasAuth()) return null;
  const t = req.cookies.get(ADMIN_COOKIE)?.value;
  const [payload, sig] = (t ?? "").split(".");
  if (!payload || !sig) return null;
  try {
    if (!safeEq(await hmac("s:" + payload), unb64(sig))) return null;
    const { e, x } = JSON.parse(new TextDecoder().decode(unb64(payload)));
    if (typeof e !== "string" || typeof x !== "number" || x < Date.now() / 1000 || !admins().includes(e)) return null;
    return { email: e };
  } catch { return null; }
}
