"use client";
import { useEffect, useState } from "react";
import { inquiryStatuses } from "@/content/site";
import { defaultServices } from "@/content/services";
import { api } from "./api";

type R = { created_at: string; status: string; selected_services: string[]; budget: string };
const Bars = ({ rows }: { rows: [string, number][] }) => {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return <ul className="space-y-2.5">{rows.map(([k, n]) => (
    <li key={k} className="grid grid-cols-[minmax(0,9rem)_1fr_2rem] items-center gap-3 text-sm"><span className="truncate" title={k}>{k}</span><span className="h-2 bg-line"><i className="block h-2 bg-accent" style={{ width: `${(n / max) * 100}%` }} /></span><b className="text-right">{n}</b></li>))}</ul>;
};

export function Overview() {
  const [rows, setRows] = useState<R[] | null>(null); const [err, setErr] = useState("");
  useEffect(() => { api("/api/admin/inquiries").then((r) => (r.ok ? setRows(r.data.items) : setErr(r.data.message || "불러오지 못했습니다. schema.sql 적용 여부를 확인하세요."))); }, []);
  if (err) return <p role="alert" className="border border-[#c0392b] bg-[#fdf3f2] p-4 text-sm">{err}</p>;
  if (!rows) return <p role="status" className="text-mute">불러오는 중…</p>;
  const now = Date.now(); const days = (n: number) => rows.filter((r) => now - new Date(r.created_at).getTime() < n * 864e5).length;
  const bySvc = new Map<string, number>(); rows.forEach((r) => r.selected_services.forEach((s) => bySvc.set(s, (bySvc.get(s) ?? 0) + 1)));
  const svc = [...bySvc].map(([s, n]) => [defaultServices.find((x) => x.slug === s)?.name ?? s, n] as [string, number]).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const byBudget = new Map<string, number>(); rows.forEach((r) => byBudget.set(r.budget, (byBudget.get(r.budget) ?? 0) + 1));
  const stat = (l: string, v: number, hot = false) => <div className={`border p-5 ${hot ? "border-accent bg-[#f1f5fd]" : "border-line bg-white"}`}><p className="text-xs font-semibold text-mute">{l}</p><p className="mt-2 text-3xl font-bold tracking-tight">{v}</p></div>;
  return (
    <div className="space-y-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stat("처리 대기 (NEW)", rows.filter((r) => r.status === "NEW").length, true)}{stat("최근 7일", days(7))}{stat("최근 30일", days(30))}{stat("전체", rows.length)}
      </div>
      {rows.length === 0 ? <p className="border border-line bg-white p-10 text-center text-mute">아직 접수된 상담이 없습니다.</p> : (
        <div className="grid gap-8 lg:grid-cols-3">
          <section className="border border-line bg-white p-6"><h2 className="mb-4 font-bold">진행 상태</h2><Bars rows={inquiryStatuses.map((s) => [s, rows.filter((r) => r.status === s).length])} /></section>
          <section className="border border-line bg-white p-6"><h2 className="mb-4 font-bold">관심 서비스 TOP</h2><Bars rows={svc} /></section>
          <section className="border border-line bg-white p-6"><h2 className="mb-4 font-bold">예상 예산</h2><Bars rows={[...byBudget].sort((a, b) => b[1] - a[1])} /></section>
        </div>
      )}
    </div>
  );
}
