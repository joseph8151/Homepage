# Cloudflare 배포·운영 가이드

Next.js 15 → `@opennextjs/cloudflare` → Cloudflare Workers. 데이터는 **D1(DB) + R2(파일)** 만 사용하며 외부 서비스 가입이 필요 없습니다.
Worker 이름은 `homepage` (`wrangler.jsonc`의 `name`) → 주소 `homepage.<계정서브도메인>.workers.dev`.

## 1단계 — 사이트 띄우기 (데이터 저장 없이)

대시보드 **Workers & Pages → homepage → Settings → Build** (Git 연결: `joseph8151/Homepage`, branch `main`)

| 항목 | 값 |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

**Build variables** (빌드 시점에 HTML에 들어가는 값은 반드시 *빌드 변수*):
- `NEXT_PUBLIC_SITE_URL` = `https://homepage.yorkboy.workers.dev` (커스텀 도메인이면 그 주소)
- 선택: `GOOGLE_SITE_VERIFICATION`, `NAVER_SITE_VERIFICATION`

Node 버전은 저장소의 `.node-version`(22)이 사용됩니다.
저장 후 **Deployments → 다시 배포** → 주소 새로고침. 이 단계에서는 사이트 전체가 보이고, 상담 폼은 “시스템 미연결”을 안내합니다(거짓 접수 없음).

### 빌드가 실패한다면
1. **Settings → Builds**에서 실패한 빌드를 열어 **로그 마지막 오류 줄**을 확인합니다.
2. Worker 이름이 `homepage`와 같은지, Production branch가 `main`인지 확인합니다.
3. Build command가 `npm run build`(또는 `npx opennextjs-cloudflare build`)인지 확인합니다. `next build`만 쓰면 Workers 번들이 만들어지지 않습니다.

## 2단계 — 상담 저장·관리자 켜기 (D1 + R2)

1. 저장소에서 `wrangler.data.jsonc`의 내용을 `wrangler.jsonc`로 교체(또는 복사)해 푸시합니다. 이 설정은 D1 `DB`, R2 `UPLOADS` 바인딩을 포함하며 `database_id`를 생략해 **배포 시 자동 생성**됩니다(wrangler 4.45+).
   - 자동 생성이 권한 문제로 실패하면: 터미널에서 `npx wrangler d1 create homepage-db`, `npx wrangler r2 bucket create homepage-uploads` 후 출력된 `database_id`를 `wrangler.jsonc`에 넣으세요.
2. 대시보드 **Settings → Variables and Secrets**에 **Secret** 추가:
   - `ADMIN_EMAILS` = 관리자 이메일(쉼표로 여러 명)
   - `ADMIN_PASSWORD` = 긴 비밀번호(12자 이상 권장)
   - (선택) `SESSION_SECRET` = 임의의 긴 문자열(없으면 비밀번호로 서명)
   - (선택 알림) `RESEND_API_KEY`, `NOTIFY_EMAIL_TO`, `NOTIFY_EMAIL_FROM` / `NOTIFY_WEBHOOK_URL`
3. 재배포 후 `/contact`에서 테스트 신청 → `/admin` 로그인 → 확인.

테이블은 첫 요청에서 **자동 생성**됩니다(별도 마이그레이션 불필요).

### 로컬에서 시험하기
```bash
cp .dev.vars.example .dev.vars        # 값 수정
npm run build
npx wrangler dev -c wrangler.data.jsonc --local
```

## 콘텐츠 수정 방법
서비스·가격·패키지·포트폴리오·블로그·회사정보는 `content/*.ts`(`content/site.ts` 등)를 수정하고 GitHub에 푸시하면 Cloudflare가 자동으로 다시 빌드·배포합니다. 페이지는 정적으로 제공되어 빠르고 Workers 무료 플랜의 CPU 제한에도 안전합니다. (관리자 화면의 콘텐츠 편집은 제공하지 않으며, 상담 조회·관리가 관리자의 역할입니다.)
- 가격 확정: `content/services.ts`의 `priceLabel`, `content/packages.ts`의 `priceLabel`
- 포트폴리오를 실제 사례로: `content/portfolio.ts`에서 `isConcept: false`, `imageUrl` 입력

## 보안 설계 요약
- 상담 저장·조회는 서버(Worker) 코드만 D1/R2에 접근. 브라우저에서 직접 접근 불가, R2는 공개 버킷이 아님(관리자 인증 후 스트리밍).
- 서버 검증, 허니팟+최소 입력 시간, IP별 요청 제한(인스턴스별 메모리 — 트래픽이 많다면 Cloudflare Turnstile/Rate Limiting 규칙 추가 권장), 파일 확장자·크기·매직바이트 검사, 랜덤 파일명.
- 관리자: 이메일 허용 목록 + 비밀번호(타이밍 안전 비교) → HMAC 서명 세션 쿠키(httpOnly, SameSite=Strict, 8시간) → 모든 관리자 API가 매 요청 서버에서 검증. 변경 요청은 Origin 검사, 로그인 시도 제한.
- 더 강한 보호가 필요하면 `/admin*`에 **Cloudflare Access**(Zero Trust)를 앞단에 추가하세요.
- 개인정보: 종결 후 3년 보관(방침 문서 명시), 관리자 화면의 “영구 삭제”가 DB 행과 R2 파일을 함께 삭제.

## 제한 사항
- Workers 번들은 압축 후 약 1.9MB(무료 플랜 한도 3MB). 기능을 크게 늘리면 `npx wrangler deploy --dry-run`으로 확인하세요.
- 상담 알림은 Secret을 설정한 경우에만 동작합니다. 알림에는 연락처·본문을 싣지 않고 관리자 링크만 보냅니다.
- 분석 도구, 실제 PG 결제는 포함하지 않았습니다.
