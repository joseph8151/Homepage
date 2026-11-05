import type { Photo as P } from "@/content/photos";

/**
 * 사진 연출: 모든 사진을 네이비 톤(흑백 + 로열 네이비 컬러 블렌드)으로 통일해 브랜드 팔레트와 맞추고,
 * 마우스를 올리면 원본 색으로 풀립니다. 크롭 마크로 에디토리얼 느낌을 더합니다.
 */
export function PhotoFrame({ photo, ratio, className = "", priority = false, sizes }: { photo: P; ratio: string; className?: string; priority?: boolean; sizes?: string }) {
  return (
    <figure className={`crop group text-navy/60 ${className}`}>
      <div className="relative w-full overflow-hidden bg-navy" style={{ aspectRatio: ratio }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src} alt={photo.alt} width={photo.w} height={photo.h} sizes={sizes}
          loading={priority ? "eager" : "lazy"} decoding="async"
          className="absolute inset-0 h-full w-full object-cover grayscale contrast-[1.05] transition-[filter,transform] duration-[1100ms] ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
          style={{ objectPosition: photo.focus ?? "50% 50%" }}
        />
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-[#123763] opacity-60 mix-blend-color transition-opacity duration-[1100ms] group-hover:opacity-0" />
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-[#081b33] opacity-10 mix-blend-multiply" />
      </div>
    </figure>
  );
}
