# Cloudflare Workers 배포 (homepage.yorkboy.workers.dev)

Next.js는 `@opennextjs/cloudflare` 어댑터로 Workers에서 실행됩니다. 이 저장소에는 설정이 이미 들어 있습니다(`wrangler.jsonc`, `open-next.config.ts`). Worker 이름은 `homepage`이며, 이 이름이 `homepage.<계정서브도메인>.workers.dev` 주소가 됩니다.

## A. Git 연동(Workers Builds)으로 배포 — 대시보드
**Workers & Pages → homepage → Settings → Build**

| 항목 | 값 |
|---|---|
| Git 저장소 | `joseph8151/Homepage` |
| **Production branch** | 코드가 있는 브랜치(현재 `claude/upbeat-hamilton-hy6vaa`) — `main`은 비어 있음 |
| Build command | `npx opennextjs-cloudflare build` |
| Deploy command | `npx opennextjs-cloudflare deploy` |
| Root directory | `/` |

**Build variables** (빌드 시점에 코드에 포함되므로 *빌드 변수*에 넣어야 함):
- `NEXT_PUBLIC_SITE_URL` = `https://homepage.yorkboy.workers.dev`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase 사용 시)

**Variables and Secrets** (런타임 — 비밀값은 반드시 *Secret*으로):
- `SUPABASE_SERVICE_ROLE_KEY`(Secret), `ADMIN_EMAILS`, 선택: `RESEND_API_KEY`·`NOTIFY_EMAIL_TO`·`NOTIFY_EMAIL_FROM`·`NOTIFY_WEBHOOK_URL`, `GOOGLE_SITE_VERIFICATION`, `NAVER_SITE_VERIFICATION`

> `NEXT_PUBLIC_*`를 런타임 변수에만 넣으면 반영되지 않습니다(빌드 변수로 넣고 재배포).

## B. 터미널에서 직접 배포
```bash
npm install
npx wrangler login
npm run cf:deploy      # 빌드 + 업로드
```
로컬에서 Workers 런타임으로 미리보기: `npm run cf:preview`

## C. 안 나올 때 점검 순서
1. **빌드 로그 확인**: Settings → Builds → 최근 빌드의 로그. 실패했다면 마지막 에러 메시지가 원인입니다.
2. **브랜치**: Production branch가 코드가 있는 브랜치인지 확인(비어 있는 `main`을 보면 빌드할 게 없습니다).
3. **명령어**: Build/Deploy command가 위 표와 같은지 확인(`next build`만 있으면 Workers용 번들이 만들어지지 않습니다).
4. **Worker 이름**: 대시보드의 Worker 이름이 `wrangler.jsonc`의 `name`(= `homepage`)과 같아야 합니다. 다르면 빌드가 실패합니다.
5. 배포 후 `https://homepage.yorkboy.workers.dev/` → 홈, `/robots.txt`, `/sitemap.xml`이 열리는지 확인.

## D. 제한 사항(알아둘 것)
- **관리자 수정 즉시 반영**: 기본 설정에서는 페이지가 빌드 시점에 정적으로 생성되므로, `/admin`에서 가격·포트폴리오·블로그를 수정해도 *재배포 전까지 공개 페이지에 반영되지 않을 수 있습니다.* 즉시 반영하려면 R2 증분 캐시(Next.js ISR)를 연결해야 합니다: R2 버킷 생성 → `wrangler.jsonc`에 `r2_buckets: [{ "binding": "NEXT_INC_CACHE_R2_BUCKET", "bucket_name": "<버킷>" }]` 추가 → `open-next.config.ts`에서 `incrementalCache: r2IncrementalCache` 설정([OpenNext 문서](https://opennext.js.org/cloudflare/caching) 참고).
- 상담 신청·관리자 로그인은 Supabase 환경변수가 모두 있어야 동작합니다. 없으면 폼이 "시스템 미연결"을 안내합니다.
- 번들 크기는 압축 후 약 1.9MB로 무료 플랜 한도(3MB) 안입니다. 기능을 크게 늘리면 다시 확인하세요(`npx wrangler deploy --dry-run`).
- 커스텀 도메인을 연결하면 `NEXT_PUBLIC_SITE_URL`을 그 주소로 바꾸고 재배포하세요(canonical·사이트맵 기준).
