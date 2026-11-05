import { getPosts, getSite } from "@/lib/content";
import { SITE_URL } from "@/content/site";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export const revalidate = 3600;

/** RSS 2.0 — 네이버 서치어드바이저 RSS 제출용 */
export async function GET() {
  const [posts, site] = await Promise.all([getPosts(), getSite()]);
  const items = posts.map((p) => `<item><title>${esc(p.title)}</title><link>${SITE_URL}/insights/${p.slug}</link><guid>${SITE_URL}/insights/${p.slug}</guid><pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate><category>${esc(p.category)}</category><description>${esc(p.excerpt)}</description></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(site.brandName)} ${esc(site.brandEn)} 인사이트</title><link>${SITE_URL}/insights</link><description>${esc(site.description)}</description><language>ko-KR</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
