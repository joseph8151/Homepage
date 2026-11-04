"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** 고정 크기(w×h)로 디자인한 화면을 컨테이너 폭에 맞춰 비율 유지 축소합니다. */
export function ScaleBox({ w, h, children, label, className = "" }: { w: number; h: number; children: ReactNode; label: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / w));
    ro.observe(el);
    setScale(el.getBoundingClientRect().width / w);
    return () => ro.disconnect();
  }, [w]);
  return (
    <div ref={ref} role="img" aria-label={label} className={`relative w-full overflow-hidden ${className}`} style={{ aspectRatio: `${w} / ${h}` }}>
      <div aria-hidden className="absolute left-0 top-0 origin-top-left select-none" style={{ width: w, height: h, transform: `scale(${scale ?? 0.5})`, opacity: scale ? 1 : 0, pointerEvents: "none" }}>
        {children}
      </div>
    </div>
  );
}
