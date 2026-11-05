import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { getPosts, getProjects, getServices } from "@/lib/content";
import { solutions } from "@/content/solutions";

// 정적 페이지의 lastmod는 실제 콘텐츠를 갱신했을 때 이 날짜를 수정하세요(매 빌드 갱신은 검색엔진 신뢰를 떨어뜨립니다).
const CONTENT_UPDATED = new Date("2026-11-05");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects, posts] = await Promise.all([getServices(), getProjects(), getPosts()]);
  const now = CONTENT_UPDATED;
  const fixed = ["", "/about", "/services", "/portfolio", "/process", "/estimate", "/solutions", "/insights", "/contact", "/privacy", "/terms"].map((p) => ({
    url: `${SITE_URL}${p}`, lastModified: now, changeFrequency: "monthly" as const, priority: p === "" ? 1 : p === "/privacy" || p === "/terms" ? 0.2 : 0.8,
  }));
  return [
    ...fixed,
    ...services.map((s) => ({ url: `${SITE_URL}/services/${s.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...solutions.map((s) => ({ url: `${SITE_URL}/solutions/${s.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...projects.map((p) => ({ url: `${SITE_URL}/portfolio/${p.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...posts.map((p) => ({ url: `${SITE_URL}/insights/${p.slug}`, lastModified: new Date(p.updatedAt), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
