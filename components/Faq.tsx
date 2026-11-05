import { JsonLd } from "./JsonLd";
import { Label } from "./ui";
import type { Faq } from "@/content/faq";

export function FaqSection({ items, title = "자주 묻는 질문", bg = "bg-white", id = "faq" }: { items: Faq[]; title?: string; bg?: string; id?: string }) {
  if (!items.length) return null;
  return (
    <section className={`${bg} py-20 md:py-28`} aria-labelledby={id}>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4"><Label className="text-accent">FAQ</Label><h2 id={id} className="t-section mt-6" style={{ fontSize: "clamp(1.9rem,1.1rem+2.4vw,3rem)" }}>{title}</h2></div>
        <div className="border-t border-navy lg:col-span-8">
          {items.map((f) => (
            <details key={f.q} className="group border-b border-line">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.1rem] font-semibold tracking-tight [&::-webkit-details-marker]:hidden">
                <span>{f.q}</span>
                <span aria-hidden className="relative h-4 w-4 shrink-0"><i className="absolute left-0 top-[7px] h-px w-4 bg-navy" /><i className="absolute left-[7px] top-0 h-4 w-px bg-navy transition-transform duration-300 group-open:scale-y-0" /></span>
              </summary>
              <p className="t-body max-w-2xl pb-7 text-mute">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
