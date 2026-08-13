# E-SHOP

스페셜티 커피 쇼핑몰 포트폴리오입니다. 원본 `cccvlmcia/1958shop2`에서 레거시 `frontend` / `frontend-admin`을 제외하고, 브랜드를 **E-SHOP**으로 재구성했습니다.

공개 레포: [asiject/e-shop-portfolio](https://github.com/asiject/e-shop-portfolio)

## 구성

| 경로 | 역할 |
|---|---|
| `client/` | 스토어프론트(웹 `/`, 모바일 `/m`) + 관리자(`/admin`). Vite, React 18, MUI, Recoil, react-query |
| `server/` | Fastify + TypeORM(MariaDB). REST API, 세션 쿠키, 정적 시드 이미지 |

## 기능

### 스토어프론트
- 상품 목록(신상품) · 카테고리(신상품/베스트/세일) · 상품 상세(옵션: 분쇄도/세트/색상)
- 장바구니 · 주문서 · 주문 결과 · 주문 내역/상세
- 웹/모바일 라우트 분리 (`react-device-detect`)
- 크라프트 로트 UI: 포장대·로트 스티커가 상품 카드. 관리자 화면은 기존 테마 유지

### 인증
- Google OAuth (환경변수 `VITE_GOOGLE_CLIENT_ID`, 서버 `oauth.google`)
- 데모 로그인(개발/소개용): 일반 유저 / 관리자 원클릭. 운영에서는 `ENABLE_DEMO_LOGIN=false` 및 `VITE_ENABLE_DEMO_LOGIN=false`

### 관리자 (`/admin`, `isAdmin`)
- 대시보드, 역할, 메뉴, 카테고리, 상품, 정책(배송/할인)
- 주문 · 출고 · 클레임

### 시드
- `server/seed/` 원두·콜드브루·드리퍼·머그 샘플과 카테고리 매핑
- 이미지: `server/public/img/seed/`
- 로컬 DB 이름은 `eshop` (ormconfig · `insert_seed.sql`의 `USE`와 맞출 것)

## 로컬 실행

서버 설정 파일(`server/config/json/`, DB·JWT·cipher)은 저장소에 없습니다. 로컬에만 두고 `.gitignore` 됩니다.

```bash
# server
cd server
yarn
# config/json/config.json, ormconfig.local.json 을 로컬에서 준비 (database: eshop)
yarn local   # NODE_ENV=local, 기본 4000

# client
cd client
yarn
cp .env.sample .env   # 값은 비워도 데모 로그인은 DEV에서 동작
yarn dev              # 3000, /api /auth /public → 4000 프록시
```

브라우저: `http://localhost:3000/`  
데모 관리자: 로그인 화면 → 「관리자로 둘러보기」 → `/admin/dashboard`

## 공개 레포에서 뺀 것

- `frontend/`, `frontend-admin/` (레거시 프론트. 원본 `frontend/.env`가 추적되어 있었음)
- `query.txt` (DB 계정·호스트 등 자격 증명)
- `server/dist/`, `server/config/json/`, `.env`, Yarn 캐시

원본에 자격 증명이 들어 있던 파일은 **유출된 것으로 보고 비밀번호를 교체**하는 것이 안전합니다.

## 스택

React 18 · TypeScript · Vite · MUI 5 · Recoil · react-query v3 · Fastify 4 · TypeORM 0.3 · MariaDB
