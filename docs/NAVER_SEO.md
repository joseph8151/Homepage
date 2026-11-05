# 네이버 SEO 운영 가이드

> 검색 노출·순위는 어떤 설정으로도 **보장되지 않습니다.** 아래는 네이버가 사이트를 정확히 수집·이해하도록 돕는 기본기와 운영 체크리스트입니다. 서치어드바이저 메뉴 이름은 개편으로 바뀔 수 있습니다.

## 1. 이 사이트에 이미 적용된 것
| 항목 | 위치 | 비고 |
|---|---|---|
| 소유 확인 메타 태그 | `NAVER_SITE_VERIFICATION` 빌드 변수 → `<meta name="naver-site-verification">` | 값만 넣고 재배포 |
| robots.txt (Yeti·Daumoa·Googlebot 명시 허용, `/admin`·`/api` 차단) | `app/robots.ts` | 봇별 블록은 `*` 규칙을 상속하지 않아 동일 규칙을 반복 |
| XML 사이트맵 (서비스 20 · 업종 8 · 포트폴리오 · 인사이트 전체) | `/sitemap.xml` (`app/sitemap.ts`) | 정적 페이지 lastmod는 `CONTENT_UPDATED` 상수 — 내용을 실제로 갱신할 때만 수정 |
| RSS 2.0 (인사이트) | `/feed.xml` | 글 제목·링크·발행일·카테고리·요약 |
| 페이지별 고유 title / description / canonical / Open Graph / keywords | `lib/seo.ts`, 각 페이지 `metadata` | 핵심 키워드를 제목 앞쪽에 배치 |
| 구조화 데이터 | Organization, BreadcrumbList(서비스·업종), Service, Article, FAQPage | `components/JsonLd.tsx` |
| 서버 렌더링/사전 렌더링 (SSG + ISR 60초) | 전 페이지 | 본문이 HTML에 포함 → 수집 유리 |
| 모바일 최적화 · HTTPS · 가벼운 JS | — | 배포 환경에서 HTTPS 필수 |
| 동적 OG 이미지 | `app/opengraph-image.tsx` | 링크 공유 미리보기 |

## 2. 서치어드바이저 등록 절차 (배포 후 1회)
1. [searchadvisor.naver.com](https://searchadvisor.naver.com) 로그인 → **웹마스터 도구 → 사이트 등록**: 실제 도메인(`https://…`) 입력.
2. 소유 확인 방식에서 **HTML 태그** 선택 → `content` 값 복사 → Cloudflare **빌드 변수** `NAVER_SITE_VERIFICATION`에 입력 → 재배포 → **소유 확인**.
3. **요청 → 사이트맵 제출**: `https://도메인/sitemap.xml`
4. **요청 → RSS 제출**: `https://도메인/feed.xml`
5. **검증 → robots.txt**: 수집 허용 상태인지 확인(Yeti).
6. **요청 → 웹페이지 수집**: 홈, 서비스 목록, 핵심 서비스 4종, 업종별 가이드, 최신 글 URL을 개별 요청.
7. **분석** 메뉴에서 수집 오류·검색 반응을 주 1회 확인.
8. 구글은 [Search Console](https://search.google.com/search-console)에서 같은 방식(`GOOGLE_SITE_VERIFICATION`)으로 등록 후 사이트맵 제출.

## 3. 네이버 친화 콘텐츠 원칙
- **페이지 하나 = 검색 의도 하나.** 키워드 맵(`docs/KEYWORDS.md`)에서 페이지별 대표 키워드를 정하고, 같은 키워드를 여러 페이지가 다투지 않게 합니다.
- 제목은 **핵심 키워드 + 구체적 이점** 형태로 30자 안팎, 설명은 80~110자(검색 결과에서 잘림 방지). 현재 페이지 제목은 이 기준으로 작성되어 있습니다.
- 본문은 **이미지가 아니라 텍스트**로, 다른 곳에 없는 구체적 정보(과정·체크리스트·주의점)를 담습니다. 이 사이트의 인사이트·업종별 가이드가 그 용도입니다.
- 키워드를 억지로 반복하지 마세요. 질문형 소제목(예: “쇼핑몰 제작 비용은 무엇으로 구성될까”)과 FAQ로 자연스럽게 포함합니다.
- 글에는 **발행일·수정일**을 표기하고, 오래된 정보는 갱신합니다(`/admin → 블로그`에서 수정일 변경).
- 확인되지 않은 수치·후기·순위 보장 문구는 쓰지 않습니다(신뢰와 정책 위험).

## 4. 운영 캘린더 제안
| 주기 | 작업 |
|---|---|
| 주 1회 | 서치어드바이저 수집 오류·검색 반응 확인 |
| 월 2~4편 | 인사이트 글 발행 → 발행 즉시 해당 URL 수집 요청 (RSS가 자동 알림) |
| 분기 1회 | 기존 글 수정일·내용 갱신, 키워드 맵 재점검, 내부 링크 보강 |
| 리뉴얼 시 | URL 매핑표 작성 + 301 리디렉션 + 사이트맵 재제출 |

## 5. 네이버 생태계 연계(선택, 이 코드 외부 작업)
- **네이버 블로그/포스트**에 인사이트 요약을 올리고 본 사이트 글로 연결(중복 문서 방지를 위해 전문은 한 곳에만).
- 오프라인 사업장이 있으면 **네이버 스마트플레이스** 등록(주소·전화 정보는 사이트의 사업자 정보와 동일하게 유지).
- 사이트 사업자 정보(`/admin → 기본 정보`)를 채우면 푸터·Organization 구조화 데이터에 자동 반영됩니다.

## 6. 배포 전 체크
- [ ] `NEXT_PUBLIC_SITE_URL`이 실제 도메인으로 설정됨 (canonical·sitemap·OG 기준)
- [ ] HTTPS 적용, `www`/non-`www` 중 한 곳으로 리디렉션
- [ ] `NAVER_SITE_VERIFICATION`, `GOOGLE_SITE_VERIFICATION` 설정
- [ ] 사업자 정보 입력 (`content/site.ts`의 상호·대표·사업자등록번호·주소·연락처 — 브랜드명은 “브랜드웰 / BrandWell”로 반영됨)
- [ ] `app/layout.tsx`·`content/site.ts`의 브랜드 문구 최종 확인
