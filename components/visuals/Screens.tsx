import type { ReactNode } from "react";
import { ScaleBox } from "./ScaleBox";

/* 모든 화면은 가상의 콘셉트/데모입니다. 실제 고객사·실적이 아닙니다. */
const serif = { fontFamily: '"Noto Serif KR","Nanum Myeongjo",Georgia,serif' };
const Bar = ({ w, h = 8, c = "currentColor", o = 0.18, r = 0 }: { w: number | string; h?: number; c?: string; o?: number; r?: number }) => (
  <div style={{ width: w, height: h, background: c, opacity: o, borderRadius: r }} />
);

function NavBar({ brand, items, dark = false, cta }: { brand: ReactNode; items: string[]; dark?: boolean; cta?: string }) {
  return (
    <div className="flex items-center justify-between px-14" style={{ height: 76, borderBottom: `1px solid ${dark ? "rgba(255,255,255,.14)" : "rgba(8,27,51,.1)"}` }}>
      <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: ".12em" }}>{brand}</div>
      <div className="flex items-center gap-9" style={{ fontSize: 13, letterSpacing: ".1em", opacity: 0.75 }}>
        {items.map((i) => <span key={i}>{i}</span>)}
      </div>
      {cta ? <div style={{ fontSize: 13, padding: "10px 18px", border: "1px solid currentColor" }}>{cta}</div> : <div />}
    </div>
  );
}

/* ───────── DEMO: 히어로용 데스크톱/모바일 ───────── */
function DemoDesktop() {
  return (
    <div className="h-full w-full" style={{ background: "#fff", color: "#081b33" }}>
      <NavBar brand="MERIDIAN WORKS" items={["COMPANY", "BUSINESS", "PROJECTS", "NEWS"]} cta="CONTACT" />
      <div className="grid" style={{ gridTemplateColumns: "1.05fr 1fr", height: 674 }}>
        <div className="flex flex-col justify-between" style={{ padding: "64px 0 56px 56px" }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: ".2em", color: "#2864d8", fontWeight: 600 }}>INDUSTRIAL ENGINEERING</div>
            <div style={{ fontSize: 68, lineHeight: 1.06, fontWeight: 700, letterSpacing: "-.04em", marginTop: 26 }}>
              정밀함이<br />기준이 되는<br />엔지니어링.
            </div>
            <div style={{ fontSize: 16, lineHeight: 1.7, color: "#66758a", marginTop: 26, width: 420 }}>
              설계부터 시공, 유지관리까지 하나의 책임 아래 진행하는 가상의 엔지니어링 기업 데모 사이트입니다.
            </div>
          </div>
          <div className="flex gap-3">
            <div style={{ background: "#081b33", color: "#fff", padding: "15px 26px", fontSize: 14, fontWeight: 600 }}>프로젝트 문의 →</div>
            <div style={{ border: "1px solid #cfd8e3", padding: "15px 26px", fontSize: 14, fontWeight: 600 }}>사업 영역</div>
          </div>
        </div>
        <div className="relative" style={{ background: "#e8edf3", margin: "0 0 0 40px" }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(160deg,#123763 0%,#081b33 100%)" }} />
          <svg viewBox="0 0 560 674" className="absolute inset-0 h-full w-full" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1.2">
            <path d="M40 560h480M40 560V180l180-80 180 80v380" />
            <path d="M120 560V250h120v310M240 300h160M240 360h160M240 420h160M240 480h160" />
            <circle cx="440" cy="140" r="54" /><circle cx="440" cy="140" r="26" />
            <path d="M0 640h560" stroke="rgba(255,255,255,.2)" />
          </svg>
          <div className="absolute bottom-6 left-6" style={{ color: "#fff", fontSize: 12, letterSpacing: ".16em", opacity: 0.8 }}>PLANT-A / STRUCTURAL DRAWING</div>
        </div>
      </div>
    </div>
  );
}

function DemoMobile() {
  return (
    <div className="h-full w-full" style={{ background: "#fff", color: "#081b33" }}>
      <div className="flex items-center justify-between px-5" style={{ height: 58, borderBottom: "1px solid #e8edf3" }}>
        <b style={{ fontSize: 13, letterSpacing: ".1em" }}>MERIDIAN WORKS</b>
        <div style={{ width: 20 }}><Bar w={20} h={2} o={1} /><div style={{ height: 5 }} /><Bar w={20} h={2} o={1} /></div>
      </div>
      <div style={{ padding: "30px 20px 0" }}>
        <div style={{ fontSize: 10, letterSpacing: ".18em", color: "#2864d8", fontWeight: 600 }}>INDUSTRIAL ENGINEERING</div>
        <div style={{ fontSize: 34, lineHeight: 1.12, fontWeight: 700, letterSpacing: "-.04em", marginTop: 14 }}>정밀함이<br />기준이 되는<br />엔지니어링.</div>
        <div style={{ fontSize: 12.5, lineHeight: 1.65, color: "#66758a", marginTop: 14 }}>가상의 데모 사이트입니다.</div>
        <div style={{ background: "#081b33", color: "#fff", padding: "13px 0", textAlign: "center", fontSize: 13, fontWeight: 600, marginTop: 20 }}>프로젝트 문의 →</div>
      </div>
      <div style={{ margin: "26px 20px 0", height: 190, background: "linear-gradient(160deg,#123763,#081b33)" }} />
    </div>
  );
}

export function HeroDemo() {
  return (
    <div className="crop relative w-full text-white/70">
      {/* 데스크톱 */}
      <div style={{ boxShadow: "0 30px 60px -30px rgba(0,0,0,.6)" }}>
        <div className="flex items-center gap-2 px-4" style={{ height: 34, background: "#0d2a4b", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
          <i className="h-2 w-2 rounded-full bg-white/25" /><i className="h-2 w-2 rounded-full bg-white/25" /><i className="h-2 w-2 rounded-full bg-white/25" />
          <span className="ml-3 flex-1 truncate bg-white/10 px-3 py-0.5 text-[10px] tracking-wide text-white/55">demo.example — Demo Site</span>
        </div>
        <ScaleBox w={1200} h={750} label="가상의 엔지니어링 기업 데모 사이트의 데스크톱 화면"><DemoDesktop /></ScaleBox>
      </div>
      {/* 모바일 */}
      <div className="absolute -bottom-10 -right-2 w-[24%] min-w-[96px] sm:-right-4" style={{ boxShadow: "0 24px 50px -20px rgba(0,0,0,.7)", border: "5px solid #0d2a4b", background: "#0d2a4b" }}>
        <ScaleBox w={390} h={780} label="같은 데모 사이트의 모바일 화면"><DemoMobile /></ScaleBox>
      </div>
      <span className="t-label absolute -top-9 right-0 text-white/55">Demo Site — 가상 데모</span>
    </div>
  );
}

/* ───────── 포트폴리오 콘셉트 화면 ───────── */
const W = 1200, H = 750;

function Law() {
  return (
    <div className="h-full w-full" style={{ background: "#f3efe8", color: "#1b2233", ...serif }}>
      <NavBar brand="HALDEN & PARTNERS" items={["업무분야", "전문가", "상담절차", "칼럼"]} cta="상담 예약" />
      <div style={{ padding: "74px 56px 0" }} className="grid grid-cols-12 gap-10">
        <div className="col-span-8">
          <div style={{ fontSize: 12, letterSpacing: ".22em", fontFamily: "sans-serif", opacity: 0.6 }}>LAW OFFICE — EST. CONCEPT</div>
          <div style={{ fontSize: 84, lineHeight: 1.05, letterSpacing: "-.03em", marginTop: 26 }}>정확하게 따지고,<br />차분하게 맡습니다.</div>
        </div>
        <div className="col-span-4" style={{ paddingTop: 60, fontFamily: "sans-serif", fontSize: 15, lineHeight: 1.8, opacity: 0.7 }}>
          업무 분야와 상담 절차를 먼저 설명합니다. 과장된 약속 대신 구조와 정확성으로 신뢰를 만듭니다.
        </div>
      </div>
      <div className="grid grid-cols-4" style={{ margin: "70px 56px 0", borderTop: "1px solid rgba(27,34,51,.25)", fontFamily: "sans-serif" }}>
        {["기업 자문", "민사·상사 분쟁", "지식재산", "노동·인사"].map((t, i) => (
          <div key={t} style={{ padding: "22px 0", borderRight: i < 3 ? "1px solid rgba(27,34,51,.12)" : 0, paddingLeft: i ? 24 : 0 }}>
            <div style={{ fontSize: 12, opacity: 0.45 }}>0{i + 1}</div><div style={{ fontSize: 21, marginTop: 6, ...serif }}>{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Clinic() {
  return (
    <div className="h-full w-full" style={{ background: "#f2f7fc", color: "#0f2a4a" }}>
      <NavBar brand="LINEA CLINIC" items={["진료과목", "의료진", "진료시간", "오시는 길"]} cta="진료 예약" />
      <div className="grid" style={{ gridTemplateColumns: "1.1fr .9fr", padding: "58px 56px 0", gap: 48 }}>
        <div>
          <div style={{ fontSize: 13, color: "#2864d8", fontWeight: 600 }}>진료 안내 · 콘셉트</div>
          <div style={{ fontSize: 64, lineHeight: 1.12, fontWeight: 700, letterSpacing: "-.04em", marginTop: 20 }}>필요한 정보를<br />가장 먼저<br />보여드립니다.</div>
          <div className="flex gap-3" style={{ marginTop: 38 }}>
            <div style={{ background: "#2864d8", color: "#fff", padding: "16px 30px", fontSize: 15, fontWeight: 600, borderRadius: 40 }}>진료 예약하기</div>
            <div style={{ border: "1px solid #b9cbe3", padding: "16px 30px", fontSize: 15, borderRadius: 40 }}>전화 연결</div>
          </div>
        </div>
        <div className="relative" style={{ height: 540 }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#cfe0f5,#e9f1fb)", borderRadius: "300px 300px 6px 6px" }} />
          <div className="absolute" style={{ left: 54, right: 54, bottom: 40, background: "#fff", padding: 24, borderRadius: 6 }}>
            <div style={{ fontSize: 12, color: "#66758a" }}>진료시간</div>
            {[["평일", "09:30 – 18:30"], ["토요일", "09:30 – 14:00"], ["점심", "13:00 – 14:00"]].map(([a, b]) => (
              <div key={a} className="flex justify-between" style={{ fontSize: 15, padding: "9px 0", borderTop: "1px solid #e8edf3", marginTop: 8 }}><span>{a}</span><b>{b}</b></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Shop() {
  const items = [
    { n: "Oru Vase 01", p: "₩ 00,000", bg: "#d9d2c5", shape: <div style={{ width: 90, height: 190, background: "#8c7b63", borderRadius: "45px 45px 20px 20px" }} /> },
    { n: "Linen Throw", p: "₩ 00,000", bg: "#cfd6d3", shape: <div style={{ width: 200, height: 130, background: "#7f8f89", transform: "rotate(-8deg)" }} /> },
    { n: "Stone Tray", p: "₩ 00,000", bg: "#e4ddd2", shape: <div style={{ width: 190, height: 190, background: "#a89c8a", borderRadius: "50%" }} /> },
    { n: "Oak Stool", p: "₩ 00,000", bg: "#d6cfc6", shape: <div style={{ width: 120, height: 150, borderTop: "26px solid #6f5a45", borderLeft: "10px solid #6f5a45", borderRight: "10px solid #6f5a45" }} /> },
  ];
  return (
    <div className="h-full w-full" style={{ background: "#f6f4f0", color: "#26231f" }}>
      <NavBar brand="MAISON ORU" items={["NEW", "LIVING", "KITCHEN", "SALE"]} cta="CART 0" />
      <div className="flex items-end justify-between" style={{ padding: "44px 56px 26px" }}>
        <div style={{ fontSize: 58, lineHeight: 1.05, letterSpacing: "-.04em", fontWeight: 600 }}>Living<br />Objects</div>
        <div style={{ fontSize: 13, opacity: 0.6, letterSpacing: ".1em" }}>48 ITEMS — FILTER / SORT</div>
      </div>
      <div className="grid grid-cols-4 gap-5" style={{ padding: "0 56px" }}>
        {items.map((i) => (
          <div key={i.n}>
            <div className="flex items-center justify-center" style={{ background: i.bg, height: 340 }}>{i.shape}</div>
            <div className="flex justify-between" style={{ marginTop: 14, fontSize: 15 }}><span>{i.n}</span><span style={{ opacity: 0.6 }}>{i.p}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Brand() {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: "#ecebe6", color: "#111" }}>
      <NavBar brand="STUDIO SORA" items={["WORK", "STUDIO", "JOURNAL"]} cta="CONTACT" />
      <div className="absolute" style={{ left: 40, top: 110, fontSize: 340, lineHeight: 0.85, fontWeight: 800, letterSpacing: "-.07em" }}>Sora</div>
      <div className="absolute" style={{ right: 56, top: 130, width: 270, height: 340, background: "#c8452d" }} />
      <div className="absolute" style={{ right: 250, top: 330, width: 230, height: 280, background: "#111" }} />
      <div className="absolute" style={{ left: 56, bottom: 48, width: 360, fontSize: 15, lineHeight: 1.75 }}>
        공간과 사물을 다루는 가상의 디자인 스튜디오. 이미지와 타이포그래피의 비율로 브랜드의 태도를 만듭니다.
      </div>
      <div className="absolute" style={{ right: 56, bottom: 48, fontSize: 12, letterSpacing: ".16em" }}>SCROLL ↓</div>
    </div>
  );
}

function Landing() {
  return (
    <div className="h-full w-full" style={{ background: "#0a1f3a", color: "#fff" }}>
      <NavBar brand="LEDGER ADVISORY" items={[]} dark cta="무료 진단 신청" />
      <div className="grid" style={{ gridTemplateColumns: "1.2fr .8fr", padding: "68px 56px 0", gap: 60 }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: ".2em", color: "#8db2ff" }}>FINANCIAL ADVISORY · CONCEPT</div>
          <div style={{ fontSize: 66, lineHeight: 1.1, fontWeight: 700, letterSpacing: "-.04em", marginTop: 24 }}>우리 회사의<br />재무 구조,<br />한 번 짚어보세요.</div>
          <div className="flex gap-10" style={{ marginTop: 44, fontSize: 14, opacity: 0.75 }}>
            {["1 현황 접수", "2 진단 미팅", "3 개선 제안"].map((s) => <span key={s}>{s}</span>)}
          </div>
        </div>
        <div style={{ background: "#fff", color: "#081b33", padding: 32, alignSelf: "start", marginTop: 10 }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>상담 신청</div>
          {["성함", "연락처", "회사명"].map((l) => (
            <div key={l} style={{ marginTop: 16 }}><div style={{ fontSize: 12, color: "#66758a" }}>{l}</div><div style={{ height: 42, border: "1px solid #cfd8e3", marginTop: 6 }} /></div>
          ))}
          <div style={{ background: "#2864d8", color: "#fff", textAlign: "center", padding: "15px 0", marginTop: 22, fontWeight: 600 }}>신청하기</div>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const rows: [string, string, string, string][] = [
    ["Project A", "김○○", "NEW", "#2864d8"], ["Project B", "이○○", "CONTACTED", "#6b7c93"],
    ["Project C", "박○○", "QUOTED", "#b07d1a"], ["Project D", "최○○", "IN PROGRESS", "#1e8a5a"], ["Project E", "정○○", "CLOSED", "#9aa5b5"],
  ];
  return (
    <div className="grid h-full w-full" style={{ gridTemplateColumns: "230px 1fr", background: "#f3f6fa", color: "#0f2238" }}>
      <div style={{ background: "#081b33", color: "#fff", padding: "28px 24px" }}>
        <b style={{ letterSpacing: ".12em", fontSize: 15 }}>FIELDNOTE</b>
        {["Overview", "Inquiries", "Accounts", "Reports", "Settings"].map((m, i) => (
          <div key={m} style={{ marginTop: 18, fontSize: 14, opacity: i === 1 ? 1 : 0.55, borderLeft: i === 1 ? "2px solid #2864d8" : "2px solid transparent", paddingLeft: 12 }}>{m}</div>
        ))}
      </div>
      <div style={{ padding: "30px 36px" }}>
        <div className="flex items-center justify-between"><div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-.03em" }}>Inquiries</div><div style={{ border: "1px solid #cfd8e3", padding: "9px 90px 9px 14px", fontSize: 13, background: "#fff", color: "#94a3b6" }}>Search</div></div>
        <div className="flex items-end gap-2" style={{ marginTop: 26, height: 110 }}>
          {[38, 62, 45, 80, 58, 92, 70, 54, 86, 64, 76, 100].map((h, i) => <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 11 ? "#2864d8" : "#c3d1e6" }} />)}
        </div>
        <div style={{ marginTop: 24, background: "#fff", border: "1px solid #e3e9f1" }}>
          {rows.map(([a, b, s, c], i) => (
            <div key={a} className="grid items-center" style={{ gridTemplateColumns: "2fr 1fr 1fr", padding: "14px 20px", borderTop: i ? "1px solid #eef2f7" : 0, fontSize: 14 }}>
              <span style={{ fontWeight: 600 }}>{a}</span><span style={{ opacity: 0.6 }}>{b}</span>
              <span style={{ color: c, fontWeight: 700, fontSize: 11, letterSpacing: ".08em" }}>● {s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const screens = { law: Law, clinic: Clinic, shop: Shop, brand: Brand, landing: Landing, dashboard: Dashboard } as const;
export type VisualKind = keyof typeof screens;

export function ConceptScreen({ kind, alt, className = "" }: { kind: VisualKind; alt: string; className?: string }) {
  const C = screens[kind] ?? Law;
  return <ScaleBox w={W} h={H} label={alt} className={className}><C /></ScaleBox>;
}
