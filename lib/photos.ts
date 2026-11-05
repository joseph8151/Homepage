import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { Photo } from "@/content/photos";

/** 빌드(사전 렌더링) 시점에 public/images 의 파일 존재 여부를 확인합니다. 없으면 null → 해당 구간 비표시. */
export function photo(p: Photo): Photo | null {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", p.src)) ? p : null;
  } catch {
    return null;
  }
}
