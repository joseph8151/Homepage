# 홈페이지 제작 에이전시 웹사이트

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · **Cloudflare Workers + D1 + R2** (OpenNext). 패키지는 최소화했습니다.

```bash
npm install
npm run dev                  # http://localhost:3000
npm run build                # Cloudflare Workers용 번들 생성(.open-next)
npm run cf:preview           # Workers 런타임으로 미리보기
```

배포·데이터 연결(D1/R2)·관리자 설정은 **[`docs/CLOUDFLARE.md`](docs/CLOUDFLARE.md)** 를 따르세요.

## 구조

| 경로 | 역할 |
|---|---|
| `content/site.ts` | **브랜드명(웹몬트로 WebMontro)·사업자 정보**, 메뉴, 예산/일정 옵션 |
| `content/services.ts` | 서비스 20개 데이터(가격 `priceLabel` 기본 "별도 견적") |
| `content/packages.ts` | 패키지 4종 |
| `content/portfolio.ts` | 포트폴리오(현재 전부 Concept Project) |
| `content/posts.ts` | 블로그 샘플 5편 |
| `content/process.ts` | 진행 6단계, 차별점 |
| `lib/content.ts` | 콘텐츠 로더(`content/*.ts`) |
| `components/visuals/Screens.tsx` | 히어로 데모·포트폴리오 콘셉트 화면(코드로 제작) |
| `app/api/inquiries` | 상담 접수(서버 검증·스팸 방어·파일 검증) |
| `app/api/admin/*`, `/admin` | 관리자 로그인·상담 관리·CSV·메모 |
| `lib/cf.ts` | D1/R2 바인딩·테이블 자동 생성 |

콘텐츠는 `content/*.ts`를 수정하고 GitHub에 푸시하면 Cloudflare가 자동 재배포합니다.

## 주요 기능
서비스 20개(검색·분류 필터) · 패키지 비교표 · **프로젝트 범위 진단(`/estimate`, 가격 산정 없음)** · FAQ(+FAQPage 구조화 데이터) · 블로그 12편(검색·읽는 시간·이전/다음·RSS `/feed.xml`) · 상담 폼(임시저장·서비스/패키지/진단 결과 자동 반영) · 신규 상담 알림(선택) · 관리자 개요 대시보드·내부 메모·CSV · 동적 OG 이미지.

## 검색(네이버·구글) 최적화
- 키워드 체계 `content/keywords.ts`(13개 클러스터·약 120개 키워드) → 페이지별 meta keywords, 키워드 맵 `docs/KEYWORDS.md`
- 업종별 롱테일 가이드 `/solutions/*` 8종, 서비스별 질문형 FAQ(비용·포함 작업·기간) 자동 생성, 글↔서비스 내부 링크
- Yeti/Daumoa 명시 robots, 사이트맵, RSS, 구조화 데이터 — 설정·운영 방법은 [`docs/NAVER_SEO.md`](docs/NAVER_SEO.md)

## 정직성 원칙(의도된 동작)
- 가격은 확정 전까지 모두 "별도 견적". 설립연도·건수·고객수·후기 등 **검증되지 않은 수치는 없음**(수치 섹션 미구현).
- 포트폴리오는 "Concept Project", 히어로는 "Demo Site"로 명시. 실제 사례가 생기면 관리자에서 `Concept` 체크 해제 및 이미지 URL 입력.
- DB가 연결되지 않으면 상담 폼은 **접수 완료를 표시하지 않고** "시스템 미연결" 오류를 보여줍니다.
- 사업자 정보가 비어 있으면 푸터·약관에 표시되지 않습니다. 개인정보처리방침/이용약관은 **기본 양식**이므로 법률 검토 후 확정하세요.

검색엔진 등록: [`docs/NAVER_SEO.md`](docs/NAVER_SEO.md)
