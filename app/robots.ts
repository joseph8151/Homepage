import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

// 봇별 규칙 블록은 '*' 규칙을 상속하지 않으므로 같은 내용을 반복합니다.
const disallow = ["/admin", "/api/"];
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "Yeti", allow: "/", disallow }, // 네이버 검색 로봇
      { userAgent: "Daumoa", allow: "/", disallow }, // 카카오(다음) 검색 로봇
      { userAgent: "Googlebot", allow: "/", disallow },
      { userAgent: "*", allow: "/", disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
