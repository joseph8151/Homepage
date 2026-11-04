"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/content/site";
import { Logo } from "./Logo";

export function Header({ wordmark }: { wordmark: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";
  const dark = isHome && !scrolled && !open;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => { window.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [open]);

  if (pathname.startsWith("/admin")) return null;
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-navy">본문 바로가기</a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,color] duration-500 ${
          dark ? "border-b border-transparent text-white" : "border-b border-line bg-white/92 text-navy backdrop-blur-md"
        } ${open ? "bg-white" : ""}`}
        style={{ backgroundColor: dark ? "transparent" : open ? "#fff" : "rgba(255,255,255,.93)" }}
      >
        <div className="wrap flex h-[72px] items-center justify-between gap-6">
          <Link href="/" aria-label="홈으로" className="shrink-0"><Logo wordmark={wordmark} /></Link>

          <nav aria-label="주 메뉴" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} aria-current={active(n.href) ? "page" : undefined}
                    className={`t-label u-link py-2 ${active(n.href) ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
                    style={{ letterSpacing: "0.14em" }}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/contact" className={`hidden min-h-11 items-center px-5 text-[0.9rem] font-semibold transition-colors duration-300 sm:inline-flex ${dark ? "bg-white text-navy hover:bg-off" : "bg-navy text-white hover:bg-royal"}`}>
              프로젝트 상담하기
            </Link>
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center lg:hidden" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "메뉴 닫기" : "메뉴 열기"} onClick={() => setOpen((v) => !v)}>
              <span className="relative block h-3.5 w-6" aria-hidden>
                <span className={`absolute left-0 h-[1.5px] w-full bg-current transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 top-1.5 h-[1.5px] w-full bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
                <span className={`absolute left-0 h-[1.5px] w-full bg-current transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" hidden={!open} className="fixed inset-0 z-40 overflow-y-auto bg-white pt-[72px] text-navy lg:hidden">
        <nav aria-label="모바일 메뉴" className="wrap py-8">
          <ul>
            {nav.map((n, i) => (
              <li key={n.href} className="border-b border-line">
                <Link href={n.href} className="flex items-baseline justify-between py-5 text-[1.75rem] font-semibold tracking-tight">
                  <span>{n.label}</span><span className="t-label text-mute">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact" className="mt-8 flex min-h-14 items-center justify-center bg-accent font-semibold text-white">프로젝트 상담하기</Link>
        </nav>
      </div>
    </>
  );
}

export function MobileCta() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/contact")) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
      <Link href="/contact" className="flex min-h-12 items-center justify-center bg-navy font-semibold text-white">프로젝트 상담하기</Link>
    </div>
  );
}
