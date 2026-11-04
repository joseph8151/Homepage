"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import { InquiriesPanel } from "./InquiriesPanel";
import { ContentPanels } from "./ContentPanels";

type Me = { state: "loading" } | { state: "unconfigured" } | { state: "anon" } | { state: "in"; email: string };
const tabs = [
  ["inquiries", "상담 신청"], ["services", "서비스·가격"], ["packages", "패키지"], ["projects", "포트폴리오"], ["posts", "블로그"], ["site", "기본 정보"],
] as const;

export function AdminApp() {
  const [me, setMe] = useState<Me>({ state: "loading" });
  const [tab, setTab] = useState<(typeof tabs)[number][0]>("inquiries");

  const load = useCallback(async () => {
    const r = await api("/api/admin/me");
    if (r.data.configured === false) setMe({ state: "unconfigured" });
    else if (r.ok) setMe({ state: "in", email: r.data.email });
    else setMe({ state: "anon" });
  }, []);
  useEffect(() => { load(); }, [load]);

  const wrap = "min-h-screen bg-off text-navy";
  if (me.state === "loading") return <div className={`${wrap} flex items-center justify-center`} role="status">불러오는 중…</div>;
  if (me.state === "unconfigured")
    return (
      <div className={`${wrap} flex items-center justify-center p-6`}>
        <div className="max-w-xl border border-line bg-white p-8">
          <h1 className="text-2xl font-bold">관리자 기능이 아직 연결되지 않았습니다</h1>
          <p className="mt-4 text-mute">관리자 로그인과 데이터 관리를 사용하려면 환경변수 <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, <code>SUPABASE_SERVICE_ROLE_KEY</code>, <code>ADMIN_EMAILS</code> 를 설정하고 <code>supabase/schema.sql</code> 을 적용해야 합니다. 자세한 방법은 <code>docs/DEPLOYMENT.md</code> 를 참고하세요.</p>
        </div>
      </div>
    );
  if (me.state === "anon") return <Login onDone={load} />;

  return (
    <div className={wrap}>
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-4"><b className="tracking-[0.14em]">ADMIN</b><span className="text-sm text-mute">{me.email}</span></div>
          <div className="flex items-center gap-5 text-sm">
            <a href="/" className="underline-offset-4 hover:underline" target="_blank" rel="noreferrer">사이트 보기</a>
            <button className="min-h-10 border border-navy px-4 font-semibold hover:bg-navy hover:text-white" onClick={async () => { await api("/api/admin/logout", { method: "POST" }); setMe({ state: "anon" }); }}>로그아웃</button>
          </div>
        </div>
        <nav aria-label="관리자 메뉴" className="mx-auto flex max-w-[1400px] gap-1 overflow-x-auto px-3">
          {tabs.map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} aria-current={tab === k ? "page" : undefined}
              className={`min-h-11 whitespace-nowrap border-b-2 px-4 text-sm font-semibold ${tab === k ? "border-accent text-navy" : "border-transparent text-mute hover:text-navy"}`}>{l}</button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-[1400px] px-5 py-8">
        {tab === "inquiries" ? <InquiriesPanel /> : <ContentPanels which={tab} />}
      </main>
    </div>
  );
}

function Login({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex min-h-screen items-center justify-center bg-deep p-5">
      <form className="w-full max-w-sm space-y-5 bg-white p-8" onSubmit={async (e) => {
        e.preventDefault(); if (busy) return; setBusy(true); setErr("");
        const r = await api("/api/admin/login", { method: "POST", json: { email, password: pw } });
        setBusy(false);
        if (r.ok) onDone(); else setErr(r.data.message || "로그인에 실패했습니다.");
      }}>
        <h1 className="text-xl font-bold">관리자 로그인</h1>
        <div><label htmlFor="a-email" className="mb-1.5 block text-sm font-semibold">이메일</label><input id="a-email" type="email" autoComplete="username" required className="field" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><label htmlFor="a-pw" className="mb-1.5 block text-sm font-semibold">비밀번호</label><input id="a-pw" type="password" autoComplete="current-password" required className="field" value={pw} onChange={(e) => setPw(e.target.value)} /></div>
        {err && <p role="alert" className="text-sm text-[#c0392b]">{err}</p>}
        <button disabled={busy} className="min-h-12 w-full bg-accent font-semibold text-white disabled:opacity-60">{busy ? "확인 중…" : "로그인"}</button>
      </form>
    </div>
  );
}
