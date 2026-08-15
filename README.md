# E-SHOP

스페셜티 커피 쇼핑몰 포트폴리오입니다. 원본 `cccvlmcia/1958shop2`에서 레거시 `frontend` / `frontend-admin`을 제외하고, 브랜드를 **E-SHOP**으로 재구성했습니다.

공개 레포: [asiject/e-shop-portfolio](https://github.com/asiject/e-shop-portfolio)

`main`은 원본 샵 스냅샷(브랜드만 E-SHOP)입니다. 이후 기능은 PR 브랜치 커밋으로 봅니다.

## 구성

| 경로 | 역할 |
|---|---|
| `client/` | 스토어프론트(웹 `/`, 모바일 `/m`) + 관리자(`/admin`). Vite, React 18, MUI, Recoil, react-query |
| `server/` | Fastify + TypeORM(MariaDB). REST API, 세션 쿠키, 정적 시드 이미지 |
| `DESIGN.md` | 스토어 크라프트 로트 백 토큰·규칙 |
| `PRODUCT.md` | 제품 범위·원칙 |
| `REPORT.md` | Cursor 작업에서 택한/버린 결정 |

## 기능

### 스토어프론트
- 상품 목록(신상품) · 카테고리(신상품/베스트/세일) · 상품 상세(옵션: 분쇄도/세트/색상)
- 상세 이미지 0/1/2+장 분기 (`NoImage` / 단장 / 갤러리+키보드)
- 장바구니(수량 ± → `PUT /cart`) · 주문서(회원만) · 주문 결과 · 주문 내역/상세
- 상품 문의: 질문 / 교환 / 반품. 작성은 로그인 필수. 주문내역·상세에서 교환·반품 문의로 진입
- 웹/모바일 라우트 분리 (`react-device-detect`). 미매칭 경로는 404
- 크라프트 로트 UI: 포장대·로트 스티커가 상품 카드. 로고 `/public/img/logo.webp`

### 인증
- 데모 로그인(개발/소개용): 일반 유저 / 관리자 원클릭. `NODE_ENV=production`이면 서버가 `/auth/demo`를 항상 404. 로컬은 `ENABLE_DEMO_LOGIN=false`로 끌 수 있음. 버튼은 `VITE_ENABLE_DEMO_LOGIN`
- Google OAuth 코드는 남아 있으나 클라이언트 ID가 없어 버튼은 비활성. 복구하지 않음

### 관리자 (`/admin`, `isAdmin`)
- 큐 작업대 셸(`adminWorkbench`): 상단 IA + 좌측 큐. 스토어 크라프트와 섞지 않음
- 대시보드, 역할, 메뉴, 카테고리, 상품, 상품 문의 답변, 정책(배송/할인)
- 주문 · 출고 · 클레임. 주문 계열은 검색창 1개(날짜·주문자명·품목 includes)
- 비관리자·로그아웃은 쇼핑몰 홈으로. `/api/v1/admin/**`는 서버에서 ADMIN 역할 검사

### 시드
- `server/seed/` 원두·콜드브루·드리퍼·머그 샘플과 카테고리 매핑
- 이미지: `server/public/img/seed/`
- 로컬 DB 이름은 `eshop` (ormconfig · `insert_seed.sql`의 `USE`와 맞출 것)
- `insert_seed.sql`에 데모 유저/관리자 계정 포함. 원본 카탈로그 복사는 `copy_from_1958shop.sql`(같은 인스턴스, 선택)

## 로컬 실행

서버 설정 파일(`server/config/json/`, DB·JWT·cipher)은 저장소에 없습니다. 로컬에만 두고 `.gitignore` 됩니다. 스키마는 `server/config/sample.config.json` · `sample.config.ts` · `sample.ormconfig.json` 을 복사해 채웁니다.

```bash
# server
cd server
yarn
mkdir -p config/json
cp config/sample.config.json config/json/config.json
cp config/sample.ormconfig.json config/json/ormconfig.local.json
# ormconfig.dev.json / ormconfig.prod.json 도 같은 스키마로 로컬에서 준비
yarn local   # NODE_ENV=local, 기본 4000

# client
cd client
yarn
cp .env.sample .env   # 값은 비워도 데모 로그인은 DEV에서 동작
yarn dev              # 3000, /api /auth /public → 4000 프록시
```

브라우저: `http://localhost:3000/`  
데모 관리자: 로그인 화면 → 「관리자로 둘러보기」 → `/admin/dashboard`

`synchronize: true`(샘플 ormconfig 기본)면 서버 기동 시 `product_qna` 등 엔티티 테이블이 생깁니다.

## 공개 레포에서 뺀 것

- `frontend/`, `frontend-admin/` (레거시 프론트. 원본 `frontend/.env`가 추적되어 있었음)
- `query.txt` (DB 계정·호스트 등 자격 증명)
- `server/dist/`, `server/config/json/`, `.env`, Yarn 캐시

원본에 자격 증명이 들어 있던 파일은 **유출된 것으로 보고 비밀번호를 교체**하는 것이 안전합니다.

## 추후 작업

- **낮음 — Google OAuth 복구**: 코드·버튼은 유지. 클라이언트 ID를 넣을 때까지 비활성.
- **낮음 — `/api/login`**: 레거시 `POST /api/v1/login`은 현행 유지. Google을 다시 쓸 때 세션 발급과 맞춰 정리하거나 삭제한다.
- **중간 — JWT refresh + lifecycle `errorCode`**: access 쿠키 30분 만료와 `/auth/refreshToken`은 이미 있다. lifecycle이 `jwt expired`를 `ERROR_AUTH_EXPIRED`(512)로 내려주고, 클라이언트가 refresh 후 재시도하는 작업은 한 묶음으로 진행한다. `AuthCode` 515 중복(`UNVALID`/`REFRESH_EXPIRED`)과 Fastify `reply.code(511~516)` HTTP 오용을 같이 고친다.
- **중간 — `/auth/refreshToken` 에러 형식**: 문자열 + 비표준 status 대신 HTTP 401 + `{code, message}`로 통일. JWT refresh 슬라이스와 함께 한다.

범위 밖(이번에 하지 않기로 한 것): 비회원 주문, 교환·반품으로 주문 상태/클레임 큐 변경, 직접수령 주소 전환.

## 스택

React 18 · TypeScript · Vite · MUI 5 · Recoil · react-query v3 · Fastify 4 · TypeORM 0.3 · MariaDB
