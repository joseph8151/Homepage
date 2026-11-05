import { ImageResponse } from "next/og";
import { defaultSite } from "@/content/site";

export const alt = `${defaultSite.brandWordmark} — Digital experiences. Built for business.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 기본 폰트에는 한글 글리프가 없어 영문만 사용합니다.
export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#061427", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, letterSpacing: 6, fontWeight: 700 }}>
          <div style={{ width: 34, height: 34, border: "3px solid #fff", display: "flex" }} />
          {defaultSite.brandWordmark}
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 92, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3 }}>
          <span>DIGITAL EXPERIENCES.</span>
          <span style={{ color: "#8db2ff" }}>BUILT FOR BUSINESS.</span>
        </div>
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 5, color: "rgba(255,255,255,.55)" }}>WEB DESIGN / DEVELOPMENT / E-COMMERCE / SEO</div>
      </div>
    ),
    size,
  );
}
