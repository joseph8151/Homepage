// public/images 의 사진을 읽어 슬롯에 배치하고 content/photos.generated.json 으로 저장합니다(빌드 시 실행).
// Cloudflare Worker는 요청 시점에 파일 시스템이 없으므로, 사진 목록은 반드시 빌드 때 코드에 포함시켜야 합니다.
// - 가로 사진: desk → laptop 순, 세로 사진: portrait → coffee 순(파일명 알파벳순)
// - 파일명이 work-desk / portrait-light / laptop-beige / coffee-break 로 시작하면 해당 슬롯에 우선 배정
import fs from "node:fs";
import path from "node:path";

const root = new URL("../", import.meta.url).pathname;
const DIR = path.join(root, "public", "images");
const OUT = path.join(root, "content", "photos.generated.json");
const prefix = { desk: "work-desk", portrait: "portrait-light", laptop: "laptop-beige", coffee: "coffee-break", studio: "studio-black" };

let files = [];
try { files = fs.readdirSync(DIR).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort(); } catch {}
const out = {};
if (files.length) {
  const sharp = (await import("sharp")).default;
  const info = [];
  for (const f of files) {
    const m = await sharp(path.join(DIR, f)).metadata();
    const swap = (m.orientation ?? 1) >= 5; // EXIF 회전 보정
    const w = swap ? m.height ?? 0 : m.width ?? 0, h = swap ? m.width ?? 0 : m.height ?? 0;
    info.push({ f, w, h, land: w >= h });
  }
  const used = new Set();
  const put = (slot, x) => { out[slot] = { src: `/images/${x.f}`, w: x.w, h: x.h }; used.add(x.f); };
  for (const slot of Object.keys(prefix)) { const x = info.find((i) => i.f.toLowerCase().startsWith(prefix[slot])); if (x) put(slot, x); }
  const land = info.filter((i) => i.land && !used.has(i.f)), port = info.filter((i) => !i.land && !used.has(i.f));
  for (const slot of ["desk", "laptop", "studio"]) if (!out[slot] && land.length) put(slot, land.shift());
  for (const slot of ["portrait", "coffee"]) if (!out[slot] && port.length) put(slot, port.shift());
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`[photos] ${Object.keys(out).length}개 슬롯 배치:`, Object.entries(out).map(([k, v]) => `${k}=${v.src}`).join(", ") || "(사진 없음)");
