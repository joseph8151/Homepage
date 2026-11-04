import "server-only";
import { defaultSite, type SiteInfo } from "@/content/site";
import { defaultServices, sortServices, type Service } from "@/content/services";
import { defaultPackages, type Pkg } from "@/content/packages";
import { defaultProjects, type Project } from "@/content/portfolio";
import { defaultPosts, type Post } from "@/content/posts";
import { supabaseUrl, supabaseAnonKey } from "./supabase";

/**
 * 콘텐츠 로더: Supabase `site_content` 테이블의 값이 있으면 기본 데이터(/content/*.ts)를 덮어씁니다.
 * DB가 없거나 조회에 실패하면 기본 데이터를 그대로 사용합니다.
 */
type Overrides = Partial<{
  site: Partial<SiteInfo>;
  services: Record<string, Partial<Service>>;
  packages: Pkg[];
  projects: Project[];
  posts: Post[];
}>;

async function loadOverrides(): Promise<Overrides> {
  if (!supabaseUrl || !supabaseAnonKey) return {};
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/site_content?select=key,value`, {
      headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` },
      next: { revalidate: 60, tags: ["content"] },
    });
    if (!res.ok) return {};
    const rows: { key: string; value: unknown }[] = await res.json();
    return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Overrides;
  } catch {
    return {};
  }
}

export async function getSite(): Promise<SiteInfo> {
  const o = await loadOverrides();
  return { ...defaultSite, ...(o.site ?? {}) };
}

export async function getServices(): Promise<Service[]> {
  const o = await loadOverrides();
  const patch = o.services ?? {};
  return sortServices(defaultServices.map((s) => ({ ...s, ...(patch[s.slug] ?? {}), slug: s.slug })));
}

export async function getService(slug: string) {
  return (await getServices()).find((s) => s.slug === slug) ?? null;
}

export async function getPackages(): Promise<Pkg[]> {
  const o = await loadOverrides();
  return Array.isArray(o.packages) && o.packages.length ? o.packages : defaultPackages;
}

export async function getProjects(): Promise<Project[]> {
  const o = await loadOverrides();
  return Array.isArray(o.projects) ? o.projects : defaultProjects;
}

export async function getProject(slug: string) {
  return (await getProjects()).find((p) => p.slug === slug) ?? null;
}

export async function getPosts(): Promise<Post[]> {
  const o = await loadOverrides();
  const list = Array.isArray(o.posts) ? o.posts : defaultPosts;
  return list.filter((p) => p.published).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getPost(slug: string) {
  return (await getPosts()).find((p) => p.slug === slug) ?? null;
}
