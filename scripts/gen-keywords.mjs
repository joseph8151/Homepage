// 사용: node scripts/gen-keywords.mjs  (Node 22.18+ 타입 스트리핑 사용)
import { writeFileSync } from "node:fs";
const { keywordClusters } = await import("../content/keywords.ts");
let md = "# 키워드 맵\n\n> `content/keywords.ts`에서 자동 생성(`node scripts/gen-keywords.mjs`). 대표 키워드는 클러스터당 담당 페이지 1곳에 배정해 키워드 경쟁(자기잠식)을 피합니다.\n\n| 클러스터 | 대표 키워드 | 세부(롱테일) 키워드 | 담당 페이지 |\n|---|---|---|---|\n";
for (const c of keywordClusters) md += `| ${c.name} | ${c.head.join(", ")} | ${c.long.join(", ")} | \`${c.page}\` |\n`;
const n = keywordClusters.reduce((a, c) => a + c.head.length + c.long.length, 0);
md += `\n총 ${keywordClusters.length}개 클러스터 · ${n}개 키워드\n\n## 자동 생성되는 서비스별 세부 키워드\n각 서비스 상세 페이지는 \`{서비스명}\`, \`{서비스명} 비용\`, \`{서비스명} 업체\`, \`{서비스명} 기간\`, \`{서비스명} 견적\`, 영문명을 meta keywords로, 같은 주제의 질문형 FAQ(비용·포함 작업·기간)를 본문에 포함합니다.\n\n## 업종별 롱테일 페이지\n\`/solutions/*\` 8개 페이지가 병원·법률·세무·학원·쇼핑몰·스타트업·B2B·해외 진출 키워드를 각각 담당합니다.\n`;
writeFileSync(new URL("../docs/KEYWORDS.md", import.meta.url), md);
console.log(`${keywordClusters.length} clusters, ${n} keywords`);
