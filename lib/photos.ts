import { photos as base, type Photo } from "@/content/photos";
import generated from "@/content/photos.generated.json";

type Slot = keyof typeof base;

/**
 * 사진 슬롯 배치 — scripts/gen-photos.mjs 가 빌드 때 public/images 를 읽어 만든 JSON을 사용합니다.
 * (Cloudflare Worker는 요청 시점에 파일 시스템이 없어서, 런타임에 폴더를 읽으면 사진이 사라집니다.)
 * 사진이 없는 슬롯은 반환되지 않으며 해당 구간은 표시되지 않습니다.
 */
export async function getPhotos(): Promise<Partial<Record<Slot, Photo>>> {
  const g = generated as Partial<Record<Slot, { src: string; w: number; h: number }>>;
  const out: Partial<Record<Slot, Photo>> = {};
  for (const slot of Object.keys(base) as Slot[]) if (g[slot]) out[slot] = { ...base[slot], ...g[slot]! };
  return out;
}
