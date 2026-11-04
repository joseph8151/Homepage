export type Block = { type: "h2"; text: string; id: string } | { type: "p"; text: string } | { type: "ul"; items: string[] };

/** "## 제목", "- 항목", 빈 줄 문단 표기법을 구조화합니다. */
export function parseBody(body: string): Block[] {
  const blocks: Block[] = [];
  let ul: string[] | null = null;
  let para: string[] = [];
  const flushPara = () => { if (para.length) blocks.push({ type: "p", text: para.join(" ") }); para = []; };
  const flushUl = () => { if (ul) blocks.push({ type: "ul", items: ul }); ul = null; };
  let n = 0;
  for (const raw of body.split("\n")) {
    const line = raw.trim();
    if (!line) { flushPara(); flushUl(); continue; }
    if (line.startsWith("## ")) { flushPara(); flushUl(); blocks.push({ type: "h2", text: line.slice(3), id: `s${++n}` }); continue; }
    if (line.startsWith("- ")) { flushPara(); (ul ??= []).push(line.slice(2)); continue; }
    flushUl(); para.push(line);
  }
  flushPara(); flushUl();
  return blocks;
}
