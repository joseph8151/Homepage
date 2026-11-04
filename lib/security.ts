import { NextRequest } from "next/server";

/** 인메모리 요청 제한. 서버리스 환경에서는 인스턴스별로 동작하므로 보조 수단입니다(운영 시 Upstash 등 권장). */
const buckets = new Map<string, number[]>();
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const arr = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) {
    buckets.set(key, arr);
    return false;
  }
  arr.push(now);
  buckets.set(key, arr);
  if (buckets.size > 5000) for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  return true;
}

export function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

/** 변경 요청에 대한 Origin 검사(CSRF 보조). */
export function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

/** 파일 시그니처(매직 바이트) 검사 */
export function matchesSignature(ext: string, b: Uint8Array): boolean {
  const starts = (...sig: number[]) => sig.every((v, i) => b[i] === v);
  switch (ext) {
    case "pdf": return starts(0x25, 0x50, 0x44, 0x46);
    case "png": return starts(0x89, 0x50, 0x4e, 0x47);
    case "jpg":
    case "jpeg": return starts(0xff, 0xd8, 0xff);
    case "zip":
    case "docx":
    case "pptx":
    case "xlsx":
    case "hwpx": return starts(0x50, 0x4b);
    case "hwp": return starts(0xd0, 0xcf, 0x11, 0xe0);
    default: return false;
  }
}

export function csvCell(v: unknown): string {
  let s = v == null ? "" : Array.isArray(v) ? v.join(" / ") : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // CSV/스프레드시트 수식 주입 방지
  return `"${s.replace(/"/g, '""')}"`;
}
