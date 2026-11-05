import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/** Cloudflare 바인딩 최소 타입(@cloudflare/workers-types 없이 사용) */
export interface D1Result<T = unknown> { results: T[]; success: boolean }
export interface D1Stmt { bind(...v: unknown[]): D1Stmt; all<T = Record<string, unknown>>(): Promise<D1Result<T>>; first<T = Record<string, unknown>>(): Promise<T | null>; run(): Promise<D1Result> }
export interface D1 { prepare(q: string): D1Stmt; batch(s: D1Stmt[]): Promise<D1Result[]> }
export interface R2Obj { body: ReadableStream; httpMetadata?: { contentType?: string } }
export interface R2 { put(key: string, v: ArrayBuffer | Uint8Array, o?: { httpMetadata?: { contentType?: string } }): Promise<unknown>; get(key: string): Promise<R2Obj | null>; delete(key: string | string[]): Promise<void> }

type Env = { DB?: D1; UPLOADS?: R2; [k: string]: unknown };

function env(): Env | null {
  try { return getCloudflareContext().env as unknown as Env; } catch { return null; }
}

/** 시크릿/변수: Workers 바인딩 우선, 없으면 process.env(로컬 개발) */
export function secret(name: string): string {
  const v = env()?.[name];
  return (typeof v === "string" ? v : process.env[name]) || "";
}

export const hasDb = () => Boolean(env()?.DB);
export const hasAuth = () => Boolean(env()?.DB && secret("ADMIN_PASSWORD") && secret("ADMIN_EMAILS"));
export const bucket = () => env()?.UPLOADS ?? null;

let ready: Promise<void> | null = null;
/** 테이블이 없으면 자동 생성(별도 마이그레이션 없이 첫 요청에서 준비). */
export async function db(): Promise<D1> {
  const d = env()?.DB;
  if (!d) throw new Error("DB_NOT_CONFIGURED");
  ready ??= (async () => {
    await d.batch([
      d.prepare(`CREATE TABLE IF NOT EXISTS inquiries (
        id TEXT PRIMARY KEY, created_at TEXT NOT NULL, name TEXT NOT NULL, company TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
        selected_services TEXT NOT NULL, budget TEXT NOT NULL, timeline TEXT NOT NULL, project_description TEXT NOT NULL,
        current_website TEXT, reference_website TEXT, attachment_path TEXT, preferred_contact TEXT,
        privacy_consent INTEGER NOT NULL, consent_version TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'NEW', admin_note TEXT)`),
      d.prepare("CREATE INDEX IF NOT EXISTS inquiries_created_idx ON inquiries (created_at DESC)"),
      d.prepare("CREATE INDEX IF NOT EXISTS inquiries_status_idx ON inquiries (status)"),
    ]);
  })().catch((e) => { ready = null; throw e; });
  await ready;
  return d;
}
