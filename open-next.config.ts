import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// 기본 설정: 사전 렌더링된 페이지는 정적 에셋으로 제공됩니다.
// ISR 재검증(관리자에서 콘텐츠 수정 후 즉시 반영)을 쓰려면 R2/KV 캐시 바인딩을 추가하세요(docs/CLOUDFLARE.md).
export default defineCloudflareConfig();
