import "server-only";
import { defaultSite, type SiteInfo } from "@/content/site";
import { defaultServices, sortServices, type Service } from "@/content/services";
import { defaultPackages, type Pkg } from "@/content/packages";
import { defaultProjects, type Project } from "@/content/portfolio";
import { defaultPosts, type Post } from "@/content/posts";

/**
 * 콘텐츠 로더. 모든 콘텐츠는 /content/*.ts 에서 관리합니다.
 * 수정 후 GitHub에 푸시하면 Cloudflare가 자동으로 다시 빌드·배포합니다(정적 페이지라 빠르고 안정적입니다).
 */
export async function getSite(): Promise<SiteInfo> { return defaultSite; }
export async function getServices(): Promise<Service[]> { return sortServices(defaultServices); }
export async function getService(slug: string) { return defaultServices.find((s) => s.slug === slug) ?? null; }
export async function getPackages(): Promise<Pkg[]> { return defaultPackages; }
export async function getProjects(): Promise<Project[]> { return defaultProjects; }
export async function getProject(slug: string) { return defaultProjects.find((p) => p.slug === slug) ?? null; }
export async function getPosts(): Promise<Post[]> { return defaultPosts.filter((p) => p.published).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)); }
export async function getPost(slug: string) { return (await getPosts()).find((p) => p.slug === slug) ?? null; }
