import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// `npm run build` = OpenNext 빌드(Workers용 번들 생성). 내부적으로는 일반 Next 빌드를 실행합니다.
// 사전 렌더링된 페이지는 정적 에셋으로 제공되어 빠르고 CPU 제한에 안전합니다.
export default {
  ...defineCloudflareConfig(),
  buildCommand: "node scripts/gen-photos.mjs && next build",
};
