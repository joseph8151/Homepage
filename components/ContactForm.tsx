"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { budgetOptions, contactMethods, timelineOptions } from "@/content/site";
import { FILE_RULES, OPTIONAL_KEYS, REQUIRED_KEYS, validateField, type InquiryInput } from "@/lib/validation";

type Svc = { slug: string; name: string; en: string };
type PkgLite = { id: string; name: string; defaultServices: string[] };
type Fallback = { email: string; phone: string };
type Errors = Partial<Record<keyof InquiryInput | "file", string>>;

const empty: InquiryInput = {
  name: "", company: "", email: "", phone: "", selected_services: [], budget: "", timeline: "",
  project_description: "", current_website: "", reference_website: "", preferred_contact: "", privacy_consent: false,
};

export function ContactForm(props: { services: Svc[]; packages: PkgLite[]; fallback: Fallback }) {
  return <Inner {...props} />;
}

function Inner({ services, packages, fallback }: { services: Svc[]; packages: PkgLite[]; fallback: Fallback }) {
  const sp = useSearchParams();
  const opts = useMemo(() => ({ budgets: budgetOptions, timelines: timelineOptions, contacts: contactMethods, services: services.map((s) => s.slug) }), [services]);
  const [v, setV] = useState<InquiryInput>(empty);
  const [touched, setTouched] = useState<Partial<Record<string, boolean>>>({});
  const [errors, setErrors] = useState<Errors>({});
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMsg, setServerMsg] = useState<{ code?: string; text: string } | null>(null);
  const startedAt = useRef(Date.now());
  const submitting = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [fromPkg, setFromPkg] = useState<string | null>(null);

  // 서비스/패키지 버튼에서 넘어온 경우 관심 서비스를 자동 선택
  useEffect(() => {
    const picked: string[] = [];
    const s = sp.get("service");
    const p = sp.get("package");
    (s ?? "").split(",").forEach((x) => { if (opts.services.includes(x)) picked.push(x); });
    const note = sp.get("note");
    if (note) setV((cur) => (cur.project_description ? cur : { ...cur, project_description: note.slice(0, 1500) }));
    const pk = packages.find((x) => x.id === p);
    if (pk) { picked.push(...pk.defaultServices.filter((x) => opts.services.includes(x))); setFromPkg(pk.name); }
    if (picked.length) setV((cur) => ({ ...cur, selected_services: Array.from(new Set(picked)) }));
  }, [sp, packages, opts.services]);

  // 임시저장: 작성 중인 내용(파일 제외)을 이 브라우저에만 보관합니다.
  const DRAFT = "inquiry-draft-v1";
  const [draftRestored, setDraftRestored] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT);
      if (raw && !sp.get("service") && !sp.get("package") && !sp.get("note")) { setV({ ...empty, ...JSON.parse(raw), privacy_consent: false }); setDraftRestored(true); }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const t = setTimeout(() => { try { const { privacy_consent, ...rest } = v; if (Object.values(rest).some((x) => (Array.isArray(x) ? x.length : x))) localStorage.setItem(DRAFT, JSON.stringify(rest)); } catch {} }, 600);
    return () => clearTimeout(t);
  }, [v]);

  const check = (key: keyof InquiryInput, next: InquiryInput) => validateField(key, next, opts);
  const set = <K extends keyof InquiryInput>(key: K, value: InquiryInput[K]) => {
    const next = { ...v, [key]: value };
    setV(next);
    if (touched[key]) setErrors((e) => ({ ...e, [key]: check(key, next) }));
  };
  const blur = (key: keyof InquiryInput) => { setTouched((t) => ({ ...t, [key]: true })); setErrors((e) => ({ ...e, [key]: check(key, v) })); };

  const validateFile = (f: File | null) => {
    if (!f) return undefined;
    const ext = (f.name.split(".").pop() || "").toLowerCase();
    if (!FILE_RULES.extensions.includes(ext)) return `허용되지 않는 파일 형식입니다. (${FILE_RULES.extensions.join(", ")})`;
    if (f.size > FILE_RULES.maxBytes) return "파일 크기는 10MB 이하여야 합니다.";
    return undefined;
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting.current) return; // 중복 클릭 방지
    const all: Errors = {};
    for (const k of [...REQUIRED_KEYS, ...OPTIONAL_KEYS]) { const m = check(k, v); if (m) all[k] = m; }
    const fe = validateFile(file); if (fe) all.file = fe;
    setTouched(Object.fromEntries([...REQUIRED_KEYS, ...OPTIONAL_KEYS].map((k) => [k, true])));
    setErrors(all);
    if (Object.keys(all).length) {
      const first = Object.keys(all)[0];
      const el = formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"] input, [data-field="${first}"] textarea, [data-field="${first}"] select, [data-field="${first}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" }); (el as HTMLElement | null)?.focus?.({ preventScroll: true });
      return;
    }
    submitting.current = true; setState("submitting"); setServerMsg(null);
    try {
      const fd = new FormData();
      Object.entries(v).forEach(([k, val]) => { if (k !== "selected_services") fd.set(k, String(val)); });
      fd.set("selected_services", JSON.stringify(v.selected_services));
      fd.set("_t", String(startedAt.current));
      fd.set("contact_url", (formRef.current?.elements.namedItem("contact_url") as HTMLInputElement)?.value || "");
      if (file) fd.set("attachment", file);
      const res = await fetch("/api/inquiries", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) { try { localStorage.removeItem(DRAFT); } catch {} setState("success"); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
      if (data.fields) setErrors(data.fields);
      setServerMsg({ code: data.code, text: data.message || "상담 신청을 접수하지 못했습니다. 잠시 후 다시 시도해 주세요." });
      setState("error");
    } catch {
      setServerMsg({ text: "네트워크 연결을 확인한 뒤 다시 시도해 주세요." });
      setState("error");
    } finally { submitting.current = false; }
  }

  if (state === "success")
    return (
      <div role="status" className="border border-navy p-8 md:p-12">
        <p className="t-label text-accent">Received</p>
        <p className="t-sub mt-4">상담 신청이 정상적으로 접수되었습니다.</p>
        <p className="t-body mt-4 text-mute">남겨주신 연락처를 통해 안내해 드리겠습니다.</p>
        <Link href="/" className="u-link mt-8 inline-block font-semibold">홈으로 돌아가기</Link>
      </div>
    );

  const Err = ({ k }: { k: string }) => errors[k as keyof Errors] ? <p id={`${k}-err`} role="alert" className="mt-2 text-[0.85rem] text-[#c0392b]">{errors[k as keyof Errors]}</p> : null;
  const aria = (k: string) => ({ "aria-invalid": errors[k as keyof Errors] ? (true as const) : undefined, "aria-describedby": errors[k as keyof Errors] ? `${k}-err` : undefined });
  const Lbl = ({ htmlFor, children, req }: { htmlFor: string; children: React.ReactNode; req?: boolean }) => (
    <label htmlFor={htmlFor} className="mb-2 block text-[0.92rem] font-semibold">{children}{req ? <span className="ml-1 text-accent" aria-hidden>*</span> : <span className="ml-2 text-[0.8rem] font-normal text-mute">(선택)</span>}</label>
  );

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-14" aria-busy={state === "submitting"}>
      {draftRestored && <p className="flex flex-wrap items-center justify-between gap-3 border-l-2 border-accent bg-off px-4 py-3 text-[0.92rem]"><span>이전에 작성하던 내용을 불러왔습니다. (이 브라우저에만 저장됩니다)</span><button type="button" className="u-link font-semibold" onClick={() => { try { localStorage.removeItem(DRAFT); } catch {} setV(empty); setDraftRestored(false); }}>처음부터 작성</button></p>}
      {fromPkg && <p className="border-l-2 border-accent bg-off px-4 py-3 text-[0.92rem]">‘{fromPkg}’ 패키지 기준으로 관심 서비스를 선택해 두었습니다. 필요에 따라 변경하세요.</p>}

      <fieldset className="space-y-6">
        <legend className="t-label mb-6 text-accent">01 — 연락처</legend>
        <div className="grid gap-6 md:grid-cols-2">
          <div data-field="name"><Lbl htmlFor="name" req>담당자 성함</Lbl><input id="name" name="name" autoComplete="name" className="field" value={v.name} onChange={(e) => set("name", e.target.value)} onBlur={() => blur("name")} {...aria("name")} /><Err k="name" /></div>
          <div data-field="company"><Lbl htmlFor="company" req>회사명 또는 브랜드명</Lbl><input id="company" name="company" autoComplete="organization" className="field" value={v.company} onChange={(e) => set("company", e.target.value)} onBlur={() => blur("company")} {...aria("company")} /><Err k="company" /></div>
          <div data-field="email"><Lbl htmlFor="email" req>이메일</Lbl><input id="email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="name@company.com" className="field" value={v.email} onChange={(e) => set("email", e.target.value)} onBlur={() => blur("email")} {...aria("email")} /><Err k="email" /></div>
          <div data-field="phone"><Lbl htmlFor="phone" req>연락처</Lbl><input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="010-1234-5678" className="field" value={v.phone} onChange={(e) => set("phone", e.target.value)} onBlur={() => blur("phone")} {...aria("phone")} /><Err k="phone" /></div>
        </div>
      </fieldset>

      <fieldset data-field="selected_services" tabIndex={-1} aria-describedby="selected_services-err" className="outline-none">
        <legend className="t-label mb-2 text-accent">02 — 관심 서비스 <span className="text-mute normal-case tracking-normal">(복수 선택)</span></legend>
        <p className="t-small mb-5 text-mute">{v.selected_services.length}개 선택됨</p>
        <div className="grid border-t border-line sm:grid-cols-2">
          {services.map((s) => {
            const on = v.selected_services.includes(s.slug);
            return (
              <label key={s.slug} className={`flex min-h-12 cursor-pointer items-center gap-3 border-b border-line px-1 py-3 transition-colors hover:bg-off ${on ? "bg-off" : ""}`}>
                <input type="checkbox" className="h-[18px] w-[18px] shrink-0 accent-[#2864d8]" checked={on}
                  onChange={() => { const next = on ? v.selected_services.filter((x) => x !== s.slug) : [...v.selected_services, s.slug]; set("selected_services", next); setTouched((t) => ({ ...t, selected_services: true })); }} />
                <span className="text-[0.95rem]">{s.name}</span>
              </label>
            );
          })}
        </div>
        <Err k="selected_services" />
      </fieldset>

      <div className="grid gap-10 md:grid-cols-2">
        <fieldset data-field="budget" tabIndex={-1} className="outline-none">
          <legend className="t-label mb-5 text-accent">03 — 예상 예산</legend>
          <div className="space-y-2">{budgetOptions.map((b) => (
            <label key={b} className={`flex min-h-12 cursor-pointer items-center gap-3 border px-4 py-2.5 transition-colors ${v.budget === b ? "border-accent bg-[#f1f5fd]" : "border-line hover:border-[#9fb0c5]"}`}>
              <input type="radio" name="budget" value={b} checked={v.budget === b} onChange={() => set("budget", b)} onBlur={() => blur("budget")} className="accent-[#2864d8]" /><span className="text-[0.95rem]">{b}</span>
            </label>))}</div><Err k="budget" />
        </fieldset>
        <fieldset data-field="timeline" tabIndex={-1} className="outline-none">
          <legend className="t-label mb-5 text-accent">04 — 희망 제작 일정</legend>
          <div className="space-y-2">{timelineOptions.map((b) => (
            <label key={b} className={`flex min-h-12 cursor-pointer items-center gap-3 border px-4 py-2.5 transition-colors ${v.timeline === b ? "border-accent bg-[#f1f5fd]" : "border-line hover:border-[#9fb0c5]"}`}>
              <input type="radio" name="timeline" value={b} checked={v.timeline === b} onChange={() => set("timeline", b)} onBlur={() => blur("timeline")} className="accent-[#2864d8]" /><span className="text-[0.95rem]">{b}</span>
            </label>))}</div><Err k="timeline" />
        </fieldset>
      </div>

      <div data-field="project_description">
        <p className="t-label mb-5 text-accent">05 — 프로젝트 내용</p>
        <Lbl htmlFor="project_description" req>프로젝트 상세 내용</Lbl>
        <textarea id="project_description" name="project_description" rows={7} className="field resize-y" placeholder="사업 분야, 사이트의 목적, 필요한 기능, 참고하고 싶은 점 등을 자유롭게 적어 주세요." value={v.project_description} onChange={(e) => set("project_description", e.target.value)} onBlur={() => blur("project_description")} {...aria("project_description")} />
        <div className="mt-2 flex justify-between"><Err k="project_description" /><span className="ml-auto text-[0.8rem] text-mute">{v.project_description.trim().length} / 5,000</span></div>
      </div>

      <details className="group border-y border-line" open={Boolean(errors.current_website || errors.reference_website || errors.file)}>
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between font-semibold"><span>추가 정보 <span className="ml-2 text-[0.85rem] font-normal text-mute">(선택 · 기존 사이트, 참고 사이트, 파일, 연락 방식)</span></span><span aria-hidden className="text-xl transition-transform group-open:rotate-45">+</span></summary>
        <div className="grid gap-6 pb-8 pt-2 md:grid-cols-2">
          <div data-field="current_website"><Lbl htmlFor="current_website">기존 홈페이지 URL</Lbl><input id="current_website" name="current_website" type="url" inputMode="url" placeholder="https://" className="field" value={v.current_website} onChange={(e) => set("current_website", e.target.value)} onBlur={() => blur("current_website")} {...aria("current_website")} /><Err k="current_website" /></div>
          <div data-field="reference_website"><Lbl htmlFor="reference_website">참고하고 싶은 사이트 URL</Lbl><input id="reference_website" name="reference_website" type="url" inputMode="url" placeholder="https://" className="field" value={v.reference_website} onChange={(e) => set("reference_website", e.target.value)} onBlur={() => blur("reference_website")} {...aria("reference_website")} /><Err k="reference_website" /></div>
          <div data-field="preferred_contact"><Lbl htmlFor="preferred_contact">연락 선호 방식</Lbl><select id="preferred_contact" className="field" value={v.preferred_contact} onChange={(e) => set("preferred_contact", e.target.value)}><option value="">선택하지 않음</option>{contactMethods.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div data-field="file"><Lbl htmlFor="attachment">프로젝트 관련 파일</Lbl><input id="attachment" type="file" accept={FILE_RULES.extensions.map((x) => "." + x).join(",")} className="field !p-2.5 text-[0.9rem]" onChange={(e) => { const f = e.target.files?.[0] ?? null; setFile(f); setErrors((er) => ({ ...er, file: validateFile(f) })); }} {...aria("file")} /><p className="mt-2 text-[0.8rem] text-mute">1개 · 10MB 이하 · {FILE_RULES.extensions.join(", ")}</p><Err k="file" /></div>
        </div>
      </details>

      {/* 허니팟: 사람에게는 보이지 않습니다 */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>연락 URL<input name="contact_url" tabIndex={-1} autoComplete="off" defaultValue="" /></label></div>

      <div data-field="privacy_consent">
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" className="mt-1.5 h-5 w-5 shrink-0 accent-[#2864d8]" checked={v.privacy_consent} onChange={(e) => set("privacy_consent", e.target.checked)} onBlur={() => blur("privacy_consent")} {...aria("privacy_consent")} />
          <span className="text-[0.95rem]"><b>[필수]</b> 상담을 위한 개인정보 수집·이용에 동의합니다. <Link href="/privacy" target="_blank" className="u-link text-accent">자세히 보기</Link>
            <span className="t-small mt-1 block text-mute">수집 항목: 성함, 회사명, 이메일, 연락처, 프로젝트 내용 및 선택 입력 정보 · 목적: 상담 및 견적 안내 · 보유: 상담 종결 후 3년(또는 삭제 요청 시까지)</span></span>
        </label>
        <Err k="privacy_consent" />
      </div>

      {state === "error" && serverMsg && (
        <div role="alert" className="border border-[#c0392b] bg-[#fdf3f2] p-5 text-[0.95rem]">
          <p className="font-semibold text-[#9b2c20]">{serverMsg.code === "NOT_CONFIGURED" ? "상담 접수 시스템이 아직 연결되지 않았습니다." : "상담 신청이 접수되지 않았습니다."}</p>
          <p className="mt-1.5">{serverMsg.text}</p>
          {(fallback.email || fallback.phone) && <p className="mt-2">직접 문의: {fallback.email && <a className="u-link font-semibold" href={`mailto:${fallback.email}`}>{fallback.email}</a>} {fallback.phone && <a className="u-link ml-2 font-semibold" href={`tel:${fallback.phone.replace(/[^\d+]/g, "")}`}>{fallback.phone}</a>}</p>}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" disabled={state === "submitting"} className="inline-flex min-h-14 items-center justify-center gap-3 bg-accent px-10 font-semibold text-white transition-colors hover:bg-[#1f55c0] disabled:cursor-not-allowed disabled:opacity-60">
          {state === "submitting" ? (<><span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />접수 중입니다…</>) : "상담 신청하기"}
        </button>
        <p className="t-small text-mute">제작 비용과 기간은 요구사항 확인 후 확정되어 안내됩니다.</p>
      </div>
    </form>
  );
}
