import { getPosts } from "@/lib/content";
import { postCategories } from "@/content/posts";
import { PageHead } from "@/components/ui";
import { InsightsList } from "@/components/InsightsList";
import { FinalCta } from "@/components/sections";
import { meta } from "@/lib/seo";

export const revalidate = 60;
export const metadata = meta({
  title: "인사이트 | 홈페이지 제작 가이드·비용·SEO·쇼핑몰 운영",
  description: "홈페이지 제작 비용, 반응형 웹, 리뉴얼과 SEO, 기업 웹사이트 구성, 쇼핑몰 운영까지 제작 전에 알아두면 좋은 정보를 정리합니다.",
  path: "/insights",
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
