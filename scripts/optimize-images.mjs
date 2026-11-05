// public/images 의 원본 사진을 웹용으로 줄입니다(긴 변 1800px, JPEG/WebP 품질 82, EXIF 제거·방향 보정).
// 사용: npm run images   — Cloudflare 빌드에서는 자동 실행되어(커밋된 원본은 그대로) 배포본만 가벼워집니다.
import { readdir, stat, rename, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const dir = new URL("../public/images/", import.meta.url).pathname;
let sharp;
try { sharp = (await import("sharp")).default; } catch { console.log("[images] sharp 없음 — 건너뜀"); process.exit(0); }

let files = [];
try { files = (await readdir(dir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)); } catch { process.exit(0); }
for (const f of files) {
  const p = path.join(dir, f);
  const before = (await stat(p)).size;
  const img = sharp(await readFile(p), { failOn: "none" }).rotate().resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true });
  const ext = path.extname(f).toLowerCase();
  const out = ext === ".png" ? await img.png({ compressionLevel: 9 }).toBuffer() : ext === ".webp" ? await img.webp({ quality: 82 }).toBuffer() : await img.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  if (out.length < before) { await writeFile(p, out); console.log(`[images] ${f}: ${(before / 1024).toFixed(0)}KB → ${(out.length / 1024).toFixed(0)}KB`); }
  else console.log(`[images] ${f}: 이미 최적 (${(before / 1024).toFixed(0)}KB)`);
}
