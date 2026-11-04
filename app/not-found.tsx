import { Button, Label } from "@/components/ui";
export default function NotFound() {
  return (
    <section className="bg-off pb-32 pt-48"><div className="wrap">
      <Label className="text-accent">404</Label>
      <h1 className="t-hero mt-6">페이지를 찾을 수 없습니다.</h1>
      <p className="t-body mt-6 max-w-lg text-mute">주소가 바뀌었거나 삭제된 페이지입니다. 아래 링크에서 원하는 정보를 찾아보세요.</p>
      <div className="mt-10 flex flex-wrap gap-3"><Button href="/">홈으로</Button><Button href="/services" variant="outline" className="text-navy hover:!bg-navy hover:!text-white">서비스 보기</Button></div>
    </div></section>
  );
}
