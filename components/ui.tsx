import Link from "next/link";
import type { ReactNode } from "react";

export const Arrow = ({ className = "" }: { className?: string }) => (
  <svg aria-hidden width="18" height="12" viewBox="0 0 18 12" fill="none" className={className}>
    <path d="M0 6h16M11 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

type BtnProps = { href: string; children: ReactNode; variant?: "solid" | "outline" | "light" | "ghost"; className?: string; size?: "md" | "lg" };
const base = "group inline-flex items-center justify-center gap-3 font-semibold tracking-tight transition-colors duration-300 min-h-12 whitespace-nowrap";
const variants = {
  solid: "bg-accent text-white hover:bg-[#1f55c0]",
  outline: "border border-current hover:bg-white/10",
  light: "bg-white text-navy hover:bg-off",
  ghost: "text-current hover:opacity-70",
};
export function Button({ href, children, variant = "solid", className = "", size = "md" }: BtnProps) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${size === "lg" ? "px-8 py-4 text-[1.05rem]" : "px-6 py-3 text-[0.95rem]"} ${className}`}>
      {children}
      <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

export const Label = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <p className={`t-label flex items-center gap-3 ${className}`}>
    <span aria-hidden className="inline-block h-px w-8 bg-current opacity-60" />
    {children}
  </p>
);

export function PageHead({ label, title, lead, children }: { label: string; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <header className="bg-off pt-36 pb-16 md:pt-48 md:pb-24">
      <div className="wrap grid gap-10 md:grid-cols-12">
        <div className="md:col-span-8">
          <Label className="text-accent">{label}</Label>
          <h1 className="t-hero mt-6" style={{ fontSize: "clamp(2.25rem, 1.2rem + 4.4vw, 4.5rem)" }}>{title}</h1>
        </div>
        {(lead || children) && (
          <div className="md:col-span-4 md:self-end">
            {lead && <p className="t-body text-mute">{lead}</p>}
            {children}
          </div>
        )}
      </div>
    </header>
  );
}

export const contactHref = (params: Record<string, string> = {}) => {
  const q = new URLSearchParams(params).toString();
  return `/contact${q ? `?${q}` : ""}`;
};
