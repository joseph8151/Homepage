"use client";
import { useEffect, useState } from "react";
import { api } from "./api";
import { portfolioCategories } from "@/content/portfolio";
import { postCategories } from "@/content/posts";

type Content = { site: Record<string, string>; services: any[]; packages: any[]; projects: any[]; posts: any[] };
type Which = "services" | "packages" | "projects" | "posts" | "site";

export function ContentPanels({ which }: { which: Which }) {
  const [c, setC] = useState<Content | null>(null);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { setC(null); setMsg(""); api("/api/admin/content").then((r) => (r.ok ? setC(r.data) : setErr(r.data.message || "불러오지 못했습니다."))); }, [which]);

  async function save(key: Which, value: unknown) {
    setSaving(true); setMsg("");
    const r = await api("/api/admin/content", { method: "PUT", json: { key, value } });
    setSaving(false);
    setMsg(r.ok ? "저장되었습니다. 공개 페이지에는 최대 1분 이내에 반영됩니다." : r.data.message || "저장에 실패했습니다.");
  }
  if (err) return <p role="alert" className="border border-[#c0392b] bg-[#fdf3f2] p-4 text-sm">{err}</p>;
  if (!c) return <p role="status" className="text-mute">불러오는 중…</p>;

  const status = msg && <p role="status" className="mt-4 text-sm font-semibold text-accent">{msg}</p>;
  if (which === "services") return <ServicesEditor list={c.services} onSave={(v) => save("services", v)} saving={saving} status={status} />;
  if (which === "packages") return <PackagesEditor list={c.packages} onSave={(v) => save("packages", v)} saving={saving} status={status} />;
  if (which === "site") return <SiteEditor site={c.site} onSave={(v) => save("site", v)} saving={saving} status={status} />;
  if (which === "projects")
    return <ListEditor key="p" title="포트폴리오" list={c.projects} saving={saving} status={status} onSave={(v) => save("projects", v)}
      blank={{ slug: "", title: "", industry: "", category: "CORPORATE", type: "", scope: [], summary: "", problem: "", direction: "", implementation: "", result: "", imageUrl: "", visual: "brand", isConcept: false, relatedService: "corporate-website" }}
      label={(p) => `${p.title || "(제목 없음)"} ${p.isConcept ? "· Concept" : ""}`}
      fields={[
        ["slug", "URL 주소(영문 소문자·숫자·하이픈)", "text"], ["title", "프로젝트명", "text"], ["industry", "업종", "text"],
        ["category", "카테고리", ["select", portfolioCategories as readonly string[]]], ["type", "제작 유형", "text"], ["scope", "수행 범위(줄바꿈으로 구분)", "lines"],
        ["summary", "한 줄 소개", "textarea"], ["problem", "문제 정의", "textarea"], ["direction", "디자인 방향", "textarea"], ["implementation", "구현 내용", "textarea"], ["result", "최종 결과", "textarea"],
        ["imageUrl", "이미지 URL(비우면 콘셉트 화면 표시)", "text"], ["visual", "콘셉트 화면 종류", ["select", ["law", "clinic", "shop", "brand", "landing", "dashboard"]]],
        ["isConcept", "Concept Project로 표시(실제 사례면 해제)", "check"], ["relatedService", "연결 서비스 slug", "text"],
      ]} />;
  return <ListEditor key="b" title="블로그" list={c.posts} saving={saving} status={status} onSave={(v) => save("posts", v)}
    blank={{ slug: "", title: "", excerpt: "", category: postCategories[0], author: "편집팀", publishedAt: new Date().toISOString().slice(0, 10), updatedAt: new Date().toISOString().slice(0, 10), body: "", published: false }}
    label={(p) => `${p.title || "(제목 없음)"} ${p.published ? "" : "· 비공개"}`}
    fields={[
      ["slug", "URL 주소(영문 소문자·숫자·하이픈)", "text"], ["title", "제목", "text"], ["excerpt", "요약(검색 결과 설명으로 사용)", "textarea"],
      ["category", "카테고리", ["select", postCategories as readonly string[]]], ["author", "작성자", "text"], ["publishedAt", "발행일(YYYY-MM-DD)", "text"], ["updatedAt", "수정일(YYYY-MM-DD)", "text"],
      ["body", "본문 — '## 제목'은 소제목(목차 자동 생성), '- '는 목록, 빈 줄은 문단 구분", "body"], ["published", "공개", "check"],
    ]} />;
}

const Save = ({ onClick, saving }: { onClick: () => void; saving: boolean }) => (
  <button onClick={onClick} disabled={saving} className="min-h-11 bg-accent px-6 font-semibold text-white disabled:opacity-60">{saving ? "저장 중…" : "저장"}</button>
);

function ServicesEditor({ list, onSave, saving, status }: { list: any[]; onSave: (v: unknown) => void; saving: boolean; status: React.ReactNode }) {
  const [rows, setRows] = useState(list);
  const upd = (i: number, k: string, v: string) => setRows((r) => r.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  return (
    <div>
      <h2 className="text-xl font-bold">서비스·가격</h2>
      <p className="mt-1 text-sm text-mute">가격이 확정되기 전까지는 “별도 견적”을 유지하세요. 확정된 가격만 입력합니다. (예: 300만원부터)</p>
      <div className="mt-5 overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-line bg-off text-left text-xs text-mute"><tr><th className="p-3">서비스</th><th>가격 표시</th><th>예상 일정 안내</th><th>가격 안내 문구</th></tr></thead>
          <tbody>{rows.map((s, i) => (
            <tr key={s.slug} className="border-b border-line align-top">
              <td className="p-3 font-semibold">{s.no}. {s.name}</td>
              <td className="p-2"><input aria-label={`${s.name} 가격`} className="field !py-2" value={s.priceLabel} onChange={(e) => upd(i, "priceLabel", e.target.value)} /></td>
              <td className="p-2"><input aria-label={`${s.name} 일정`} className="field !py-2" value={s.timeline} onChange={(e) => upd(i, "timeline", e.target.value)} /></td>
              <td className="p-2"><input aria-label={`${s.name} 안내`} className="field !py-2" value={s.priceNote} onChange={(e) => upd(i, "priceNote", e.target.value)} /></td>
            </tr>))}</tbody>
        </table>
      </div>
      <div className="mt-5"><Save saving={saving} onClick={() => onSave(Object.fromEntries(rows.map((s) => [s.slug, { priceLabel: s.priceLabel, timeline: s.timeline, priceNote: s.priceNote }])))} />{status}</div>
    </div>
  );
}

function PackagesEditor({ list, onSave, saving, status }: { list: any[]; onSave: (v: unknown) => void; saving: boolean; status: React.ReactNode }) {
  const [rows, setRows] = useState(list.map((p) => ({ ...p, featuresText: p.features.join("\n") })));
  const upd = (i: number, k: string, v: string) => setRows((r) => r.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  return (
    <div>
      <h2 className="text-xl font-bold">패키지</h2>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {rows.map((p, i) => (
          <div key={p.id} className="space-y-3 border border-line bg-white p-5">
            <b className="tracking-widest">{p.name}</b>
            <div><label className="mb-1 block text-xs font-semibold text-mute">대상</label><input className="field !py-2" value={p.target} onChange={(e) => upd(i, "target", e.target.value)} /></div>
            <div><label className="mb-1 block text-xs font-semibold text-mute">가격 표시</label><input className="field !py-2" value={p.priceLabel} onChange={(e) => upd(i, "priceLabel", e.target.value)} /></div>
            <div><label className="mb-1 block text-xs font-semibold text-mute">포함 범위(줄바꿈으로 구분)</label><textarea rows={8} className="field" value={p.featuresText} onChange={(e) => upd(i, "featuresText", e.target.value)} /></div>
          </div>
        ))}
      </div>
      <div className="mt-5"><Save saving={saving} onClick={() => onSave(rows.map(({ featuresText, ...p }) => ({ ...p, features: featuresText.split("\n").map((s: string) => s.trim()).filter(Boolean) })))} />{status}</div>
    </div>
  );
}

const siteLabels: Record<string, string> = {
  brandName: "브랜드명(한글)", brandWordmark: "로고 워드마크(영문)", tagline: "태그라인", description: "브랜드 소개(푸터·메타)",
  companyName: "상호", representative: "대표자", businessNumber: "사업자등록번호", address: "주소", email: "이메일", phone: "전화번호", hours: "운영시간",
};
function SiteEditor({ site, onSave, saving, status }: { site: Record<string, string>; onSave: (v: unknown) => void; saving: boolean; status: React.ReactNode }) {
  const [v, setV] = useState(site);
  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold">기본 정보</h2>
      <p className="mt-1 text-sm text-mute">확인된 정보만 입력하세요. 비워 두면 화면에 표시되지 않습니다.</p>
      <div className="mt-5 space-y-4">{Object.keys(siteLabels).map((k) => (
        <div key={k}><label htmlFor={`s-${k}`} className="mb-1 block text-xs font-semibold text-mute">{siteLabels[k]}</label>
          {k === "description" ? <textarea id={`s-${k}`} rows={3} className="field" value={v[k] ?? ""} onChange={(e) => setV({ ...v, [k]: e.target.value })} /> : <input id={`s-${k}`} className="field" value={v[k] ?? ""} onChange={(e) => setV({ ...v, [k]: e.target.value })} />}</div>
      ))}</div>
      <div className="mt-5"><Save saving={saving} onClick={() => onSave(v)} />{status}</div>
    </div>
  );
}

type Field = [string, string, "text" | "textarea" | "lines" | "check" | "body" | ["select", readonly string[]]];
function ListEditor({ title, list, blank, label, fields, onSave, saving, status }: { title: string; list: any[]; blank: any; label: (x: any) => string; fields: Field[]; onSave: (v: unknown) => void; saving: boolean; status: React.ReactNode }) {
  const [items, setItems] = useState<any[]>(list);
  const [sel, setSel] = useState<number | null>(null);
  const cur = sel !== null ? items[sel] : null;
  const upd = (k: string, v: unknown) => setItems((r) => r.map((x, j) => (j === sel ? { ...x, [k]: v } : x)));
  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div>
        <div className="flex items-center justify-between"><h2 className="text-xl font-bold">{title}</h2><button className="min-h-10 border border-navy px-3 text-sm font-semibold hover:bg-navy hover:text-white" onClick={() => { setItems((r) => [...r, { ...blank }]); setSel(items.length); }}>+ 추가</button></div>
        <ul className="mt-4 border border-line bg-white">
          {items.length === 0 && <li className="p-5 text-sm text-mute">등록된 항목이 없습니다.</li>}
          {items.map((it, i) => <li key={i} className="border-b border-line last:border-0"><button onClick={() => setSel(i)} className={`block min-h-11 w-full px-4 py-3 text-left text-sm ${sel === i ? "bg-off font-semibold" : "hover:bg-off"}`}>{label(it)}</button></li>)}
        </ul>
        <div className="mt-4"><Save saving={saving} onClick={() => onSave(items)} />{status}</div>
        <p className="mt-3 text-xs text-mute">변경 후 반드시 ‘저장’을 눌러야 반영됩니다.</p>
      </div>
      <div className="border border-line bg-white p-6">
        {!cur ? <p className="text-mute">왼쪽에서 항목을 선택하거나 추가하세요.</p> : (
          <div className="space-y-4">
            {fields.map(([k, l, t]) => (
              <div key={k}>
                {t === "check" ? <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={!!cur[k]} onChange={(e) => upd(k, e.target.checked)} />{l}</label> : (
                  <>
                    <label htmlFor={`f-${k}`} className="mb-1 block text-xs font-semibold text-mute">{l}</label>
                    {t === "text" && <input id={`f-${k}`} className="field !py-2" value={cur[k] ?? ""} onChange={(e) => upd(k, e.target.value)} />}
                    {t === "textarea" && <textarea id={`f-${k}`} rows={3} className="field" value={cur[k] ?? ""} onChange={(e) => upd(k, e.target.value)} />}
                    {t === "body" && <textarea id={`f-${k}`} rows={18} className="field font-mono !text-sm" value={cur[k] ?? ""} onChange={(e) => upd(k, e.target.value)} />}
                    {t === "lines" && <textarea id={`f-${k}`} rows={3} className="field" value={(cur[k] ?? []).join("\n")} onChange={(e) => upd(k, e.target.value.split("\n"))} onBlur={(e) => upd(k, e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))} />}
                    {Array.isArray(t) && <select id={`f-${k}`} className="field !py-2" value={cur[k]} onChange={(e) => upd(k, e.target.value)}>{t[1].map((o) => <option key={o}>{o}</option>)}</select>}
                  </>
                )}
              </div>
            ))}
            <button className="text-sm text-[#c0392b] underline" onClick={() => { if (confirm("이 항목을 삭제할까요? (저장 시 반영)")) { setItems((r) => r.filter((_, j) => j !== sel)); setSel(null); } }}>이 항목 삭제</button>
          </div>
        )}
      </div>
    </div>
  );
}
