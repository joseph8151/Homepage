import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAdmin } from "@/lib/admin-auth";
import { adminClient } from "@/lib/supabase";
import { sameOrigin } from "@/lib/security";
import { defaultSite } from "@/content/site";
import { defaultServices } from "@/content/services";
import { defaultPackages } from "@/content/packages";
import { defaultProjects } from "@/content/portfolio";
import { defaultPosts } from "@/content/posts";

const KEYS = ["site", "services", "packages", "projects", "posts"] as const;
type Key = (typeof KEYS)[number];

/** 관리자 화면용: DB 값이 있으면 그것을, 없으면 기본값을 반환합니다. */
export async function GET(req: NextRequest) {
  if (!(await getAdmin(req))) return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  const { data, error } = await adminClient().from("site_content").select("key,value");
  if (error) return NextResponse.json({ message: "콘텐츠를 불러오지 못했습니다. schema.sql 적용 여부를 확인하세요." }, { status: 500 });
  const o = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  return NextResponse.json({
    site: { ...defaultSite, ...(o.site ?? {}) },
    services: defaultServices.map((s) => ({ ...s, ...(o.services?.[s.slug] ?? {}) })),
    packages: o.packages ?? defaultPackages,
    projects: o.projects ?? defaultProjects,
    posts: o.posts ?? defaultPosts,
  });
}

const isStr = (v: unknown) => typeof v === "string";
const validators: Record<Key, (v: any) => boolean> = {
  site: (v) => v && typeof v === "object" && Object.keys(defaultSite).every((k) => !(k in v) || isStr(v[k])),
  services: (v) => v && typeof v === "object" && Object.entries(v).every(([slug, p]: any) => defaultServices.some((s) => s.slug === slug) && p && typeof p === "object"),
  packages: (v) => Array.isArray(v) && v.length <= 8 && v.every((p) => isStr(p.id) && isStr(p.name) && isStr(p.priceLabel) && Array.isArray(p.features)),
  projects: (v) => Array.isArray(v) && v.length <= 100 && v.every((p) => /^[a-z0-9-]+$/.test(p.slug ?? "") && isStr(p.title) && isStr(p.category)),
  posts: (v) => Array.isArray(v) && v.length <= 300 && v.every((p) => /^[a-z0-9-]+$/.test(p.slug ?? "") && isStr(p.title) && isStr(p.body)),
};

export async function PUT(req: NextRequest) {
  if (!sameOrigin(req)) return NextResponse.json({ message: "허용되지 않은 요청입니다." }, { status: 403 });
  if (!(await getAdmin(req))) return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  const b = await req.json().catch(() => null);
  if (!b || !KEYS.includes(b.key) || !validators[b.key as Key](b.value))
    return NextResponse.json({ message: "저장할 데이터 형식이 올바르지 않습니다. (slug는 영문 소문자·숫자·하이픈)" }, { status: 400 });
  const { error } = await adminClient().from("site_content").upsert({ key: b.key, value: b.value, updated_at: new Date().toISOString() });
  if (error) return NextResponse.json({ message: "저장에 실패했습니다." }, { status: 500 });
  revalidateTag("content");
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
