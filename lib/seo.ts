import type { Metadata } from "next";
import { SITE_URL, defaultSite } from "@/content/site";

export function meta(opts: { title: string; description: string; path: string; type?: "website" | "article"; noindex?: boolean; publishedTime?: string; modifiedTime?: string; keywords?: string[] }): Metadata {
  const url = `${SITE_URL}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords ? Array.from(new Set(opts.keywords)) : undefined,
    alternates: { canonical: url },
    robots: opts.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      type: opts.type ?? "website",
      locale: "ko_KR",
      siteName: `${defaultSite.brandName} ${defaultSite.brandEn}`,
      ...(opts.type === "article" ? { publishedTime: opts.publishedTime, modifiedTime: opts.modifiedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: opts.title, description: opts.description },
  };
}
