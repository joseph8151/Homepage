"use client";
import { useCallback, useEffect, useState } from "react";
import { inquiryStatuses } from "@/content/site";
import { defaultServices } from "@/content/services";
import { api } from "./api";

type Row = {
  id: string; created_at: string; name: string; company: string; email: string; phone: string; selected_services: string[];
  budget: string; timeline: string; project_description: string; current_website: string | null; reference_website: string | null;
  attachment_path: string | null; preferred_contact: string | null; consent_version: string; status: string; admin_note: string | null;
};
const svc = (s: string) => defaultServices.find((x) => x.slug === s)?.name ?? s;
const color: Record<string, string> = { NEW: "bg-accent text-white", CONTACTED: "bg-[#e1e8f2] text-navy", QUOTED: "bg-[#f6ecd2] text-[#7a5a0b]", "IN PROGRESS": "bg-[#d9f0e4] text-[#1c6b46]", CLOSED: "bg-line text-mute" };

export function InquiriesPanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState(""); const [status, setStatus] = useState(""); const [service, setService] = useState("");
  const [loading, setLoading] = useState(true); const [err, setErr] = useState("");
  const [open, setOpen] = useState<Row | null>(null);

  const qs = useCallback((extra = "") => `?${new URLSearchParams({ q, status, service }).toString()}${extra}`, [q, status, service]);
  const load = useCallback(async () => {
    setLoading(true); setErr("");
    const r = await api(`/api/admin/inquiries${qs()}`);
    if (r.ok) setRows(r.data.items); else setErr(r.data.message || "불러오지 못했습니다. schema.sql 적용 여부를 확인하세요.");
    setLoading(false);
  }, [qs]);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);

  async function changeStatus(r: Row, s: string) {
    const res = await api("/api/admin/inquiries", { method: "PATCH", json: { id: r.id, status: s } });
    if (res.ok) { setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, status: s } : x))); setOpen((o) => (o?.id === r.id ? { ...o, status: s } : o)); }
    else alert(res.data.message);
  }
  async function remove(r: Row) {
    if (!confirm(`${r.company} / ${r.name} 님의 상담 내역과 첨부파일을 영구 삭제합니다. 계속할까요?`)) return;
    const res = await api("/api/admin/inquiries", { method: "DELETE", json: { id: r.id } });
    if (res.ok) { setOpen(null); load(); } else alert(res.data.message);
  }

  const counts = inquiryStatuses.map((s) => [s, rows.filter((r) => r.status === s).length] as const);
  return (
    <div>
      <div className="flex flex-wrap gap-2 text-sm">{counts.map(([s, n]) => <span key={s} className={`px-3 py-1.5 font-semibold ${color[s]}`}>{s} {n}</span>)}</div>
      <div className="mt-5 flex flex-wrap items-end gap-3">
        <div><label htmlFor="f-q" className="mb-1 block text-xs font-semibold text-mute">검색</label><input id="f-q" className="field !py-2" placeholder="이름·회사·이메일·연락처" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div><label htmlFor="f-s" className="mb-1 block text-xs font-semibold text-mute">상태</label><select id="f-s" className="field !py-2" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">전체</option>{inquiryStatuses.map((s) => <option key={s}>{s}</option>)}</select></div>
        <div><label htmlFor="f-v" className="mb-1 block text-xs font-semibold text-mute">서비스</label><select id="f-v" className="field !py-2" value={service} onChange={(e) => setService(e.target.value)}><option value="">전체</option>{defaultServices.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}</select></div>
        <a className="ml-auto min-h-10 border border-navy px-4 py-2 text-sm font-semibold hover:bg-navy hover:text-white" href={`/api/admin/inquiries${qs("&format=csv")}`}>CSV 다운로드</a>
      </div>

      {err && <p role="alert" className="mt-6 border border-[#c0392b] bg-[#fdf3f2] p-4 text-sm">{err}</p>}
      <div className="mt-5 overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line bg-off text-xs text-mute"><tr><th className="p-3">접수일</th><th>상태</th><th>회사 / 담당자</th><th>관심 서비스</th><th>예산</th><th>일정</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="cursor-pointer border-b border-line hover:bg-off" onClick={() => setOpen(r)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setOpen(r)}>
                <td className="whitespace-nowrap p-3">{new Date(r.created_at).toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" })}</td>
                <td><span className={`px-2 py-1 text-xs font-bold ${color[r.status]}`}>{r.status}</span></td>
                <td><b>{r.company}</b><br /><span className="text-mute">{r.name}</span></td>
                <td className="max-w-[260px] truncate pr-3">{r.selected_services.map(svc).join(", ")}</td>
                <td className="whitespace-nowrap pr-3">{r.budget}</td><td className="whitespace-nowrap pr-3">{r.timeline}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && rows.length === 0 && !err && <p className="p-10 text-center text-mute">조건에 맞는 상담 신청이 없습니다.</p>}
        {loading && <p className="p-10 text-center text-mute" role="status">불러오는 중…</p>}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label="상담 상세">
          <div className="h-full w-full max-w-xl overflow-y-auto bg-white p-7" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs text-mute">{new Date(open.created_at).toLocaleString("ko-KR")}</p><h2 className="mt-1 text-2xl font-bold">{open.company}</h2></div><button className="min-h-10 px-3 text-xl" aria-label="닫기" onClick={() => setOpen(null)} autoFocus>✕</button></div>
            <div className="mt-5"><label htmlFor="d-s" className="mb-1 block text-xs font-semibold text-mute">진행 상태</label>
              <select id="d-s" className="field" value={open.status} onChange={(e) => changeStatus(open, e.target.value)}>{inquiryStatuses.map((s) => <option key={s}>{s}</option>)}</select></div>
            <dl className="mt-6 space-y-4 text-sm">
              {([["담당자", open.name], ["이메일", open.email], ["연락처", open.phone], ["관심 서비스", open.selected_services.map(svc).join(", ")], ["예산", open.budget], ["일정", open.timeline], ["연락 선호", open.preferred_contact], ["기존 URL", open.current_website], ["참고 URL", open.reference_website], ["동의 버전", open.consent_version]] as [string, string | null][]).filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="grid grid-cols-[6rem_1fr] gap-3 border-t border-line pt-3"><dt className="text-mute">{k}</dt><dd className="break-all">{k.includes("URL") && /^https?:/.test(v!) ? <a className="text-accent underline" href={v!} target="_blank" rel="noopener noreferrer">{v}</a> : v}</dd></div>
              ))}
              <div className="border-t border-line pt-3"><dt className="text-mute">프로젝트 내용</dt><dd className="mt-2 whitespace-pre-wrap leading-relaxed">{open.project_description}</dd></div>
            </dl>
            <NoteBox key={open.id} id={open.id} initial={open.admin_note ?? ""} onSaved={(v) => setRows((rs) => rs.map((x) => (x.id === open.id ? { ...x, admin_note: v } : x)))} />
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="min-h-10 bg-navy px-4 py-2.5 text-sm font-semibold text-white" href={`mailto:${open.email}`}>이메일 보내기</a>
              {open.attachment_path && <a className="min-h-10 border border-navy px-4 py-2.5 text-sm font-semibold" href={`/api/admin/attachment?id=${open.id}`}>첨부파일 다운로드</a>}
              <button className="ml-auto min-h-10 px-4 text-sm text-[#c0392b] underline" onClick={() => remove(open)}>영구 삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NoteBox({ id, initial, onSaved }: { id: string; initial: string; onSaved: (v: string) => void }) {
  const [v, setV] = useState(initial); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  return (
    <div className="mt-6 border-t border-line pt-4">
      <label htmlFor="d-note" className="mb-1 block text-xs font-semibold text-mute">내부 메모 (고객에게 노출되지 않음)</label>
      <textarea id="d-note" rows={4} className="field" value={v} onChange={(e) => { setV(e.target.value); setMsg(""); }} placeholder="통화 내용, 견적 금액, 다음 연락일 등" maxLength={4000} />
      <div className="mt-2 flex items-center gap-3">
        <button disabled={busy || v === initial} className="min-h-10 border border-navy px-4 text-sm font-semibold hover:bg-navy hover:text-white disabled:opacity-40" onClick={async () => {
          setBusy(true); const r = await api("/api/admin/inquiries", { method: "PATCH", json: { id, admin_note: v } }); setBusy(false);
          if (r.ok) { onSaved(v); setMsg("저장되었습니다."); } else setMsg(r.data.message || "저장 실패 (schema.sql의 admin_note 컬럼 적용 여부 확인)");
        }}>{busy ? "저장 중…" : "메모 저장"}</button>
        {msg && <span role="status" className="text-sm text-accent">{msg}</span>}
      </div>
    </div>
  );
}
