import { getPosts } from "@/lib/content";
import { postCategories } from "@/content/posts";
import { PageHead } from "@/components/ui";
import { InsightsList } from "@/components/InsightsList";
import { FinalCta } from "@/components/sections";
import { meta } from "@/lib/seo";

export const metadata = meta({
  title: "홈페이지 제작 가이드 | 비용·기간·SEO·쇼핑몰 정보",
  description: "홈페이지 제작 비용, 제작 기간, 업체 선정, 반응형, 리뉴얼과 SEO, 쇼핑몰 운영까지 제작 전에 알아야 할 실무 정보를 정리합니다.",
  path: "/insights",
  keywords: ["홈페이지 제작 가이드","홈페이지 제작 비용","홈페이지 제작 업체 선정","네이버 SEO","홈페이지 리뉴얼 SEO"],
});

export default async function Insights() {
  const posts = await getPosts();
  return (
    <>
      <PageHead label="Insights" title={<>제작 전에 읽어두면<br />좋은 이야기.</>} lead="홈페이지 제작과 운영에 필요한 실무 정보를 정리합니다." />
      <section className="bg-white py-14 md:py-20"><div className="wrap"><InsightsList posts={posts} categories={postCategories} /></div></section>
      <FinalCta />
    </>
  );
}
