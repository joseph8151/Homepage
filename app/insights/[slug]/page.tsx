import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPost, getPosts, getServices, getSite } from "@/lib/content";
import { defaultPosts } from "@/content/posts";
import { postServices } from "@/content/keywords";
import { parseBody } from "@/lib/post-body";
import { Button, Label } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { meta } from "@/lib/seo";
import { SITE_URL } from "@/content/site";

export const revalidate = 60;
export const generateStaticParams = () => defaultPosts.map((p) => ({ slug: p.slug }));
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getPost((await params).slug);
  if (!p) return {};
  return meta({ title: p.title, description: p.excerpt, path: `/insights/${p.slug}`, type: "article", publishedTime: p.publishedAt, modifiedTime: p.updatedAt, keywords: [p.category, ...p.title.split(/[,，·]/).map((x) => x.trim()).filter((x) => x.length > 3 && x.length < 30)] });
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, posts, site, allServices] = await Promise.all([getPost(slug), getPosts(), getSite(), getServices()]);
  if (!post) notFound();
  const blocks = parseBody(post.body);
  const toc = blocks.filter((b) => b.type === "h2") as Extract<(typeof blocks)[number], { type: "h2" }>[];
  const related = [...posts.filter((p) => p.slug !== post.slug && p.category === post.category), ...posts.filter((p) => p.slug !== post.slug && p.category !== post.category)].slice(0, 3);
  const relSvc = (postServices[slug] ?? []).map((x) => allServices.find((s) => s.slug === x)).filter(Boolean) as typeof allServices;
  const fmt = (d: string) => d.replaceAll("-", ".");
  const chars = post.body.replace(/\s/g, "").length;
  const minutes = Math.max(1, Math.round(chars / 500));
  const pi = posts.findIndex((p) => p.slug === post.slug);
  const newer = pi > 0 ? posts[pi - 1] : null;
  const older = pi < posts.length - 1 ? posts[pi + 1] : null;

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.excerpt,
        datePublished: post.publishedAt, dateModified: post.updatedAt, articleSection: post.category,
        author: { "@type": "Organization", name: post.author }, publisher: { "@type": "Organization", name: site.companyName || site.brandName },
        mainEntityOfPage: `${SITE_URL}/insights/${post.slug}`,
      }} />
      <header className="bg-off pb-14 pt-36 md:pb-20 md:pt-48">
        <div className="wrap grid gap-8 md:grid-cols-12">
          <div className="md:col-span-9">
            <nav aria-label="경로" className="t-label text-mute"><Link href="/insights" className="u-link">Insights</Link> / {post.category}</nav>
            <h1 className="t-section mt-7" style={{ fontSize: "clamp(2rem,1.1rem+3.4vw,3.75rem)" }}>{post.title}</h1>
            <p className="t-body mt-6 max-w-2xl text-mute">{post.excerpt}</p>
            <p className="t-small mt-8 text-mute">
              {post.author} · 읽는 시간 약 {minutes}분 · 발행 <time dateTime={post.publishedAt}>{fmt(post.publishedAt)}</time>
              {post.updatedAt !== post.publishedAt && <> · 수정 <time dateTime={post.updatedAt}>{fmt(post.updatedAt)}</time></>}
            </p>
          </div>
        </div>
      </header>

      <div className="wrap grid gap-12 py-16 md:py-24 lg:grid-cols-12">
        {toc.length > 1 && (
          <nav aria-label="목차" className="lg:col-span-3 lg:order-1">
            <div className="lg:sticky lg:top-28">
              <p className="t-label text-mute">목차</p>
              <ol className="mt-4 space-y-2.5 border-l border-line pl-4 text-[0.92rem]">
                {toc.map((h) => <li key={h.id}><a href={`#${h.id}`} className="text-mute transition-colors hover:text-navy">{h.text}</a></li>)}
              </ol>
            </div>
          </nav>
        )}
        <article className="lg:order-2 lg:col-span-7 lg:col-start-5">
          {blocks.map((b, i) =>
            b.type === "h2" ? <h2 key={i} id={b.id} className="mb-5 mt-14 scroll-mt-28 text-[1.6rem] font-bold tracking-tight first:mt-0">{b.text}</h2>
            : b.type === "ul" ? <ul key={i} className="my-6 space-y-2.5">{b.items.map((it) => <li key={it} className="flex gap-3 text-[1.02rem] leading-[1.8]"><span aria-hidden className="text-accent">—</span><span>{it}</span></li>)}</ul>
            : <p key={i} className="my-5 text-[1.05rem] leading-[1.95] text-navy/85">{b.text}</p>,
          )}
          {(newer || older) && (
            <nav aria-label="이전·다음 글" className="mt-16 grid gap-px border-y border-line sm:grid-cols-2">
              {older ? <Link href={`/insights/${older.slug}`} className="group py-6 sm:pr-6"><p className="t-label text-mute">← 이전 글</p><p className="mt-2 font-semibold leading-snug"><span className="u-link">{older.title}</span></p></Link> : <span />}
              {newer ? <Link href={`/insights/${newer.slug}`} className="group border-line py-6 sm:border-l sm:pl-6 sm:text-right"><p className="t-label text-mute">다음 글 →</p><p className="mt-2 font-semibold leading-snug"><span className="u-link">{newer.title}</span></p></Link> : <span />}
            </nav>
          )}
          {relSvc.length > 0 && (
            <div className="mt-12"><p className="t-label text-mute">관련 서비스</p>
              <ul className="mt-4 border-t border-navy">{relSvc.map((s) => <li key={s.slug} className="border-b border-line"><Link href={`/services/${s.slug}`} className="group flex items-center justify-between py-3.5 font-medium"><span className="u-link">{s.name}</span><span aria-hidden className="transition-transform group-hover:translate-x-1">→</span></Link></li>)}</ul></div>
          )}
          <aside className="on-dark mt-16 bg-navy p-8 text-white">
            <p className="t-label text-[#8db2ff]">Consultation</p>
            <p className="t-sub mt-4" style={{ fontSize: "1.5rem" }}>프로젝트에 맞는 범위를 함께 정리해 드립니다.</p>
            <Button href="/contact" variant="light" className="mt-6">프로젝트 상담하기</Button>
          </aside>
        </article>
      </div>

      {related.length > 0 && (
        <section className="bg-off py-16 md:py-20" aria-labelledby="rel">
          <div className="wrap">
            <Label className="text-mute"><span id="rel">Related posts</span></Label>
            <ul className="mt-8 grid border-t border-navy md:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug} className="border-b border-line md:border-r md:last:border-r-0 md:px-6 md:first:pl-0">
                  <Link href={`/insights/${r.slug}`} className="group block py-6"><p className="t-label text-accent" style={{ letterSpacing: ".08em" }}>{r.category}</p><p className="mt-3 text-[1.1rem] font-semibold leading-snug"><span className="u-link">{r.title}</span></p></Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
