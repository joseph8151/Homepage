import type { Pkg } from "@/content/packages";
import { comparison } from "@/content/packages";

const mark = (c: string) => c === "포함" ? <span className="font-semibold text-accent" aria-label="포함">●</span> : c === "옵션" ? <span className="text-navy/70">옵션</span> : c === "협의" ? <span className="text-navy/70">협의</span> : <span className="text-mute/50" aria-label="미포함">—</span>;

/** 데이터 기반 비교표. 모바일에서는 가로 스크롤하되 첫 열을 고정합니다. */
export function Comparison({ packages }: { packages: Pkg[] }) {
  const names = packages.slice(0, 4).map((p) => p.name);
  return (
    <div>
      <div className="overflow-x-auto border-y border-navy" tabIndex={0} role="region" aria-label="패키지 비교표">
        <table className="w-full min-w-[640px] border-collapse text-left text-[0.92rem]">
          <caption className="sr-only">패키지별 포함 범위 비교</caption>
          <thead><tr className="border-b border-line">
            <th scope="col" className="sticky left-0 bg-off p-4 text-xs font-medium text-mute">기능</th>
            {names.map((n) => <th key={n} scope="col" className="t-label p-4 text-center text-accent" style={{ fontSize: ".7rem" }}>{n}</th>)}
          </tr></thead>
          <tbody>
            {comparison.map((r) => (
              <tr key={r.label} className="border-b border-line last:border-0">
                <th scope="row" className="sticky left-0 bg-off p-4 font-medium">{r.label}</th>
                {r.v.map((c, i) => <td key={i} className="p-4 text-center">{mark(c)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="t-small mt-4 text-mute">● 기본 포함 · 옵션 선택 시 추가 · 협의 프로젝트 범위에 따라 결정. 포함 범위는 상담 후 확정되며 서면 견적에 명시됩니다.</p>
    </div>
  );
}
