import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/** 상담 저장/관리자 기능에 필요한 서버 설정이 모두 있는지 */
export const isDbConfigured = () => Boolean(supabaseUrl && serviceKey);
export const isAuthConfigured = () => Boolean(supabaseUrl && supabaseAnonKey && serviceKey);

/** 서버 전용: RLS를 우회하는 관리자 클라이언트. 이 모듈을 클라이언트 컴포넌트에서 import 하지 마십시오. */
export function adminClient(): SupabaseClient {
  if (!isDbConfigured()) throw new Error("DB_NOT_CONFIGURED");
  return createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function anonClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

export const INQUIRY_BUCKET = "inquiry-attachments";
