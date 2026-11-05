import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { getPosts, getProjects, getServices } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects, posts] = await Promise.all([getServices(), getProjects(), getPosts()]);
  const now = new Date();
  const fixed = ["", "/about", "/services", "/portfolio", "/process", "/estimate", "/insights", "/contact", "/privacy", "/terms"].map((p) => ({
    url: `${SITE_URL}${p}`, lastModified: now, changeFrequency: "monthly" as const, priority: p === "" ? 1 : p === "/privacy" || p === "/terms" ? 0.2 : 0.8,
  }));
  return [
    ...fixed,
    ...services.map((s) => ({ url: `${SITE_URL}/services/${s.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...projects.map((p) => ({ url: `${SITE_URL}/portfolio/${p.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...posts.map((p) => ({ url: `${SITE_URL}/insights/${p.slug}`, lastModified: new Date(p.updatedAt), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
