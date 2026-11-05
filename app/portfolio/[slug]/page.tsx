import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject, getProjects } from "@/lib/content";
import { defaultProjects } from "@/content/portfolio";
import { Button, Label, contactHref } from "@/components/ui";
import { FinalCta, ProjectVisual } from "@/components/sections";
import { meta } from "@/lib/seo";

export const generateStaticParams = () => defaultProjects.map((p) => ({ slug: p.slug }));
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getProject((await params).slug);
  if (!p) return {};
  return meta({ title: `${p.title} — ${p.type}${p.isConcept ? " (Concept Project)" : ""}`, description: p.summary, path: `/portfolio/${p.slug}` });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [p, all] = await Promise.all([getProject(slug), getProjects()]);
  if (!p) notFound();
  const i = all.findIndex((x) => x.slug === p.slug);
  const next = all[(i + 1) % all.length];
  const blocks = [
    ["01", "Problem", "문제 정의", p.problem],
    ["02", "Direction", "디자인 방향", p.direction],
    ["03", "Build", "구현 내용", p.implementation],
    ["04", "Outcome", "최종 결과", p.result],
  ];
  return (
    <>
      <header className="bg-off pb-14 pt-36 md:pb-20 md:pt-48">
        <div className="wrap">
          <nav aria-label="경로" className="t-label text-mute"><Link href="/portfolio" className="u-link">Portfolio</Link> / {p.category}</nav>
          <div className="mt-8 grid gap-10 md:grid-cols-12">
            <div className="md:col-span-8">
              {p.isConcept && <p className="t-label mb-5 inline-block border border-navy/25 px-3 py-2 text-navy">Concept Project</p>}
              <h1 className="t-hero" style={{ fontSize: "clamp(2.25rem,1.2rem+4.4vw,4.5rem)" }}>{p.title}</h1>
            </div>
            <p className="t-body text-mute md:col-span-4 md:self-end">{p.summary}</p>
          </div>
        </div>
      </header>
      <div className="wrap -mt-1 pt-0"><ProjectVisual p={p} ratio="16 / 10" priority /></div>

      <div className="wrap grid gap-14 py-20 md:py-28 lg:grid-cols-12">
        <dl className="grid gap-6 self-start border-t border-navy pt-6 text-[0.95rem] sm:grid-cols-3 lg:col-span-3 lg:grid-cols-1">
          <div><dt className="t-label text-mute">업종</dt><dd className="mt-2 font-medium">{p.industry}</dd></div>
          <div><dt className="t-label text-mute">제작 유형</dt><dd className="mt-2 font-medium">{p.type}</dd></div>
          <div><dt className="t-label text-mute">수행 범위</dt><dd className="mt-2 font-medium">{p.scope.join(" · ")}</dd></div>
        </dl>
        <div className="lg:col-span-8 lg:col-start-5">
          {blocks.map(([n, en, ko, text]) => (
            <section key={n} className="grid gap-4 border-t border-line py-10 first:border-t-navy md:grid-cols-[11rem_1fr]">
              <div><p className="t-label text-accent">{n} — {en}</p><h2 className="mt-3 text-[1.15rem] font-semibold">{ko}</h2></div>
              <p className="t-body text-mute">{text}</p>
            </section>
          ))}
          <div className="mt-6"><Button href={contactHref({ service: p.relatedService })}>비슷한 프로젝트 문의하기</Button></div>
        </div>
      </div>

      <section className="bg-off py-16"><div className="wrap">
        <Label className="text-mute">Next project</Label>
        <Link href={`/portfolio/${next.slug}`} className="group mt-6 block"><span className="t-sub u-link">{next.title}</span><span className="t-small ml-4 text-mute">{next.industry}</span></Link>
      </div></section>
      <FinalCta service={p.relatedService} title={"비슷한 프로젝트를\n계획하고 계신가요?"} button="비슷한 프로젝트 문의하기" />
    </>
  );
}
