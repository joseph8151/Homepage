// Cloudflare Workers Builds(환경변수 WORKERS_CI=1)에서만, 의존성 설치 직후 Workers용 번들을 만듭니다.
// 대시보드의 Build command가 비어 있어도(`None`) `npx wrangler deploy`가 빌드 결과를 찾을 수 있게 하기 위한 안전장치입니다.
// 로컬 `npm install`에는 영향이 없습니다. 대시보드에 Build command=`npm run build`를 지정했다면 한 번 더 빌드되지 않도록 건너뜁니다.
import { spawnSync } from "node:child_process";

if (process.env.WORKERS_CI !== "1" && process.env.CF_FORCE_BUILD !== "1") process.exit(0);
console.log("[cf-postinstall] Workers build detected — running OpenNext build");
const r = spawnSync("npx", ["opennextjs-cloudflare", "build"], { stdio: "inherit", shell: process.platform === "win32" });
process.exit(r.status ?? 1);
