# 배포 및 운영 가이드

## 1. Supabase 설정 (상담 저장·관리자·콘텐츠 편집)
1. supabase.com에서 프로젝트 생성 → **SQL Editor**에 `supabase/schema.sql` 전체를 붙여넣고 실행.
   - `inquiries`: RLS 활성 + 정책 없음 → 브라우저(anon)에서는 읽기/쓰기 모두 불가. 서버(service role)만 접근.
   - `site_content`: 공개 읽기 / 쓰기는 서버만.
   - `inquiry-attachments`: **비공개** 버킷. 관리자 인증 후 60초 서명 URL로만 다운로드.
2. **Authentication → Users → Add user**로 관리자 계정(이메일+비밀번호) 생성. (회원가입은 Authentication 설정에서 비활성화 권장)
3. **Project Settings → API**에서 URL, anon key, service_role key 확인.

## 2. 환경변수 (Vercel → Settings → Environment Variables)
| 이름 | 설명 |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | 실제 도메인(https://…). canonical·sitemap·OG 기준 |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 공개 가능 값 |
| `SUPABASE_SERVICE_ROLE_KEY` | **서버 전용 비밀키.** `NEXT_PUBLIC_` 금지, 저장소 커밋 금지 |
| `ADMIN_EMAILS` | 관리자 허용 이메일(쉼표 구분). Supabase에 계정이 있어도 여기에 없으면 접근 불가 |
| `GOOGLE_SITE_VERIFICATION`, `NAVER_SITE_VERIFICATION` | 검색엔진 소유 확인 메타 태그 값 |

## 3. Vercel 배포
GitHub 저장소를 Vercel에 Import → Framework: Next.js(자동) → 환경변수 입력 → Deploy. 도메인 연결 후 `NEXT_PUBLIC_SITE_URL`을 맞추고 재배포.

## 4. 배포 후 점검
- `/contact`에서 테스트 신청 → `/admin` 로그인 → 목록 확인, 상태 변경, CSV, 첨부 다운로드
- 로그아웃 상태에서 `/api/admin/inquiries`가 401인지 확인
- `/sitemap.xml`, `/robots.txt` 확인

## 5. 검색엔진 등록
- **Google Search Console**: 속성 추가 → HTML 태그 방식의 content 값을 `GOOGLE_SITE_VERIFICATION`에 입력 → 재배포 → 확인 → 사이트맵 `/sitemap.xml` 제출.
- **네이버 서치어드바이저**: 사이트 등록 → HTML 태그의 content 값을 `NAVER_SITE_VERIFICATION`에 입력 → 재배포 → 확인 → 사이트맵·RSS 제출.
- 검색 순위는 보장되지 않습니다. 문구에도 그런 표현을 쓰지 마세요.

## 6. 보안 설계 요약
- 비밀키는 서버 코드에서만 사용(`lib/supabase.ts`). 상담 INSERT도 서버 API를 통해서만 수행.
- 서버 검증(필수값·이메일·전화·URL·옵션 화이트리스트), 허니팟 + 최소 입력시간, IP당 10분 5회 제한(인메모리).
  - 서버리스에서는 인스턴스별로 동작하므로 트래픽이 있다면 Upstash Redis/Cloudflare Turnstile 추가를 권장합니다.
- 파일: 확장자 화이트리스트 + 10MB + **매직바이트 검사** + 랜덤 파일명 + 비공개 버킷.
- 관리자: Supabase Auth 비밀번호 로그인 → httpOnly·SameSite=Strict 쿠키에 토큰 저장 → 모든 관리자 API가 매 요청 서버에서 토큰 검증 + `ADMIN_EMAILS` 확인. 변경 요청은 Origin 검사. 로그인 시도 제한.
  - 세션은 Supabase 액세스 토큰 만료(기본 1시간) 시 재로그인이 필요합니다.
- CSV는 수식 주입(`= + - @`) 방지 처리, UTF-8 BOM 포함(엑셀 한글).
- 보안 헤더(nosniff, frame deny 등) 적용, `/admin`은 noindex.

## 7. 개인정보 보존·삭제
- 기본 정책: 상담 종결 후 3년(방침 문서에 명시, 변경 시 `app/privacy` 및 `PRIVACY_CONSENT_VERSION` 갱신).
- 관리자 상세 패널의 “영구 삭제”가 DB 행과 첨부파일을 함께 삭제합니다. 일괄 삭제 SQL 예시는 `schema.sql` 하단 주석 참고.

## 8. 아직 연결되지 않은 것 (필요 시 추가)
- 신규 상담 **이메일/메신저 알림**: 현재는 관리자 화면에서 확인. Resend 등을 `app/api/inquiries/route.ts` 저장 직후에 연결하세요.
- 분석 도구(GA4·네이버 애널리틱스), 실제 PG 결제는 포함하지 않았습니다.
- Pretendard 폰트는 jsDelivr CDN에서 로드합니다(자체 호스팅 시 `app/layout.tsx` 수정).
