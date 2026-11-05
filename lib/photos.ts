import "server-only";
import fs from "node:fs";
import path from "node:path";
import { photos as base, type Photo } from "@/content/photos";

type Slot = keyof typeof base;
const DIR = path.join(process.cwd(), "public", "images");
let cache: Promise<Partial<Record<Slot, Photo>>> | null = null;

/**
 * 빌드(사전 렌더링) 시점에 public/images 의 사진을 읽어 슬롯에 배치합니다.
 * - 파일명은 자유입니다. 가로 사진은 desk → laptop, 세로 사진은 portrait → coffee 순서로(파일명 알파벳순) 들어갑니다.
 * - 슬롯 이름(work-desk, portrait-light, laptop-beige, coffee-break)으로 시작하는 파일은 해당 슬롯에 우선 배정됩니다.
 * - 파일이 없으면 해당 구간은 표시되지 않습니다.
 */
export function getPhotos(): Promise<Partial<Record<Slot, Photo>>> {
  cache ??= load().catch(() => ({}));
  return cache;
}

async function load(): Promise<Partial<Record<Slot, Photo>>> {
  if (!fs.existsSync(DIR)) return {};
  const files = fs.readdirSync(DIR).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
  if (!files.length) return {};
  const sharp = (await import("sharp")).default;

  const info = await Promise.all(files.map(async (f) => {
    const m = await sharp(path.join(DIR, f)).metadata();
    const swap = (m.orientation ?? 1) >= 5; // EXIF 회전 보정
    const w = swap ? m.height ?? 0 : m.width ?? 0, h = swap ? m.width ?? 0 : m.height ?? 0;
    return { f, w, h, land: w >= h };
  }));

  const out: Partial<Record<Slot, Photo>> = {};
  const used = new Set<string>();
  const put = (slot: Slot, x: (typeof info)[number]) => { out[slot] = { ...base[slot], src: `/images/${x.f}`, w: x.w, h: x.h }; used.add(x.f); };

  // 1) 이름이 슬롯과 일치하는 파일 우선
  const prefix: Record<Slot, string> = { desk: "work-desk", portrait: "portrait-light", laptop: "laptop-beige", coffee: "coffee-break" };
  for (const slot of Object.keys(prefix) as Slot[]) { const x = info.find((i) => i.f.toLowerCase().startsWith(prefix[slot])); if (x) put(slot, x); }
  // 2) 나머지는 방향별로 순서대로
  const land = info.filter((i) => i.land && !used.has(i.f)), port = info.filter((i) => !i.land && !used.has(i.f));
  for (const slot of ["desk", "laptop"] as Slot[]) if (!out[slot] && land.length) put(slot, land.shift()!);
  for (const slot of ["portrait", "coffee"] as Slot[]) if (!out[slot] && port.length) put(slot, port.shift()!);
  return out;
}
