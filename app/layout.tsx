import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header, MobileCta } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { getServices, getSite } from "@/lib/content";
import { SITE_URL, defaultSite } from "@/content/site";
import { siteKeywords } from "@/content/keywords";

export const viewport: Viewport = { themeColor: "#061427", width: "device-width", initialScale: 1 };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `홈페이지 제작 전문 웹몬트로 ${defaultSite.brandEn}`,
    template: `%s | ${defaultSite.brandName} ${defaultSite.brandEn}`,
  },
  description: "기업 홈페이지, 쇼핑몰, 랜딩페이지, 홈페이지 리뉴얼, SEO까지. 비즈니스의 성과를 설계하는 홈페이지 제작 전문기업.",
  applicationName: `${defaultSite.brandName} ${defaultSite.brandEn}`,
  keywords: siteKeywords,
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NAVER_SITE_VERIFICATION ? { "naver-site-verification": process.env.NAVER_SITE_VERIFICATION } : undefined,
  },
  formatDetection: { telephone: false },
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [site, services] = await Promise.all([getSite(), getServices()]);
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600&display=swap" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
        <noscript><style>{`.reveal{opacity:1!important;transform:none!important}`}</style></noscript>
      </head>
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.companyName || site.brandName,
            alternateName: [site.brandEn, site.brandWordmark],
            url: SITE_URL,
            description: site.description,
            ...(site.email ? { email: site.email } : {}),
            ...(site.phone ? { telephone: site.phone } : {}),
            ...(site.address ? { address: { "@type": "PostalAddress", streetAddress: site.address, addressCountry: "KR" } } : {}),
          }}
        />
        <Header wordmark={site.brandWordmark} />
        <main id="main">{children}</main>
        <Footer site={site} services={services} />
        <MobileCta />
      </body>
    </html>
  );
}
