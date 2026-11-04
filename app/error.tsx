"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="bg-off pb-32 pt-48"><div className="wrap">
      <p className="t-label text-accent">Error</p>
      <h1 className="t-section mt-6">일시적인 문제가 발생했습니다.</h1>
      <p className="t-body mt-5 text-mute">잠시 후 다시 시도해 주세요. 문제가 계속되면 상담 문의로 알려주시기 바랍니다.</p>
      <button onClick={reset} className="mt-8 min-h-12 bg-navy px-8 font-semibold text-white">다시 시도</button>
    </div></section>
  );
}
