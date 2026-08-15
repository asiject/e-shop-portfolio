# Cursor 작업 결정 보고

원본 `cccvlmcia/1958shop2` (`origin/main`, `eb20f29`) 이후 Cursor와 진행한 결정만 적습니다. 구현 세부가 아니라 **무엇을 택했고 무엇을 버렸는지**입니다.

## 1. 레포 범위 (포트폴리오)

| 결정 | 이유 |
|---|---|
| 공개 레포 `asiject/e-shop-portfolio` | 개인 포트폴리오. 최초 이름은 `1958shop-portfolio`였으나 레포·브랜드를 E-SHOP으로 맞춤 |
| 제품 브랜드 1958SHOP → E-SHOP | 포트폴리오 공개명과 UI 워드마크를 일치 |
| 기존 git 이력은 가져가지 않음 (orphan) | 원본 커밋/작성자 이력을 복제하지 않음 |
| `main` = 원본 샵 스냅샷(브랜드만 E-SHOP), PR 브랜치 = 이후 기능 커밋 | “git에서 받은 부분부터 현재까지”를 PR로 보여 줌 |
| `frontend/`, `frontend-admin/` 제외 | 레거시. 원본 `frontend/.env`가 추적되어 공개 불가 |
| `query.txt` 제외 | DB 계정·호스트가 평문으로 들어 있음. **해당 비밀번호는 교체할 것** |
| `server/dist`, `config/json`, `.yarn` 캐시 제외 | 빌드 산출물·로컬 시크릿·설치 캐시 |
| `cia.config.ts` → `eshop.config.ts` + `sample.*.json` | 공개 레포에 실비밀 없이 스키마만 둠. `config/json`은 로컬 |

원본 작업 폴더의 `frontend`는 삭제하지 않았습니다. 포트폴리오 레포에만 넣지 않습니다.

## 2. 런타임 · 타입 ([Fastify module error](062a9702-5b8d-4c75-84f9-a77534f719de))

- `Cannot find module 'fastify'`: 의존성은 `package.json`에 있고 `node_modules`가 없었음 → 설치로 해결.
- `tsconfig` `baseUrl` 경고: 경로 별칭은 `tsconfig.path.json`으로 유지.

## 3. 데이터 · 상품 ([Ponytail client/server 감사](46133360-7476-4db2-aa6a-afe345f3a9e7))

- `productoptionitems` 테이블 없음: SQL 오타가 아니라 **테이블 미생성**. TypeORM 엔티티명과 실제 테이블이 달랐음.
- 상품/옵션 API는 엔티티 관계 기준으로 조회하도록 맞춤. 시드는 가상 커피 SKU(원두·콜드브루·드리퍼·머그).
- 포트폴리오 시드 DB 이름은 `eshop`.
- 데모 계정은 `insert_seed.sql`에도 넣음. 원본 `1958shop` 카탈로그 복사는 선택 스크립트 `copy_from_1958shop.sql`(유저/카트/주문은 복사하지 않음).

## 4. 데모 로그인 · 관리자 메뉴 ([데모 관리자 메뉴](f9fe9082-19fa-4c9b-8e08-2b545ad96347), [데모 어드민 기능](d7fd1230-a205-4a24-8752-0fde9973a428))

- 소개용으로 Google 없이 `USER` / `ADMIN` 원클릭 로그인.
- 운영 기본값은 끔 (`ENABLE_DEMO_LOGIN`, `VITE_ENABLE_DEMO_LOGIN`). DEV만 버튼 표시.
- 데모 관리자 메뉴가 비던 이유: 역할은 있어도 **menu 시드가 없음**. 데모 관리자 생성 시 기본 메뉴를 보장.
- 관리자 라우트는 `isAdmin`으로 가드. 스토어 UI와 관리자 UI를 섞지 않음.
- **Google 로그인은 복구하지 않음.** 버튼은 클라이언트 ID가 있을 때만. Register는 유지(타입만 수정).

## 5. 스토어 UI ([Modern UI design proposals](48a36bb3-9f1b-4233-b266-cfc3528bb0f7), [로고 연결](94c7cea6-accd-48c5-8e07-df4b7de58963), [상품 이미지·DESIGN 스키마](073503f2-3fb8-4dcd-af43-92fbd0943288))

- Impeccable(`pbakaus/impeccable`)로 방향 워크숍. 기존 1024px·연두(`#9ac66d`) 몰은 안티레퍼런스.
- 후보: A 키사텐 / **B 크라프트 로트** / C 네오브루털 / D 프로비넌스.
- **채택 B.** 상품이 로트 가방으로 보이게. 관리자는 이 세계를 쓰지 않음.
- 시드에 없는 원산지·후기·무료배송 클레임은 만들지 않음. LOT 번호는 상품 id 카탈로그 번호.
- 세계가 하나여야 해서 B+C 혼합은 하지 않음.
- 로고는 `/public/img/logo.webp` + `Logo`. 관리자 작업대에는 스토어 로고를 넣지 않음.
- 상세 이미지: 0장 `no image` 텍스트, 1장은 갤러리 없음, 2장 이상만 썸네일+키보드. 1장짜리 시드에 가짜 2번째 컷을 두지 않음.
- 404는 스토어 스티커 카드 / 관리자 작업대 카드. 미매칭 `*` 라우트.

## 6. 관리자 UI ([백오피스 admin UI 견본](2c6b9e62-9bc5-4372-ad93-403b3b5a7e21))

- 견본 A 밀도 콘솔 / **B 큐 작업대** / C 원장 그리드 / D 인스펙터 스플릿. 정적 견본은 `docs/admin-ui-proposals/`.
- **채택 B.** 셸은 전 관리자 공통. 좌측 레일은 해당 메뉴(주문 화면에서는 큐).
- 검색창 1개, includes(대소문자 무시). 대상은 주문/배송/클레임만(날짜 문자열·주문자명·품목명+옵션).
- 토큰 `adminWorkbench`. 크라프트 잉크/스탬프를 관리자에 가져오지 않음.
- 로그아웃·비관리자 보호 라우트는 쇼핑몰 홈.

## 7. 상품 문의 · 교환/반품 ([문의 API·잔여 결정](fd674599-45c8-40dd-9cec-9b4533455c8f))

| 항목 | 결정 |
|---|---|
| 문의 작성 | 로그인 필수. 미로그인은 `/login` |
| 관리자 | 목록 + 답변. 스토어 PDP에 답변(없으면 답변 대기) |
| 교환/반품 | 문의 `kind`만. 주문 상태·클레임 큐는 바꾸지 않음 |
| Google | 복구하지 않음 |
| 죽은 파일 | 삭제 안 함. `Package`/`Location` 임포트만 수정 |

시퀀스: PDP 「문의 작성」 → `POST /api/v1/product/:id/qna` → 관리자 `/admin/product/qna` → `PUT /api/v1/admin/qna/:id`. 주문목록·상세 「교환, 반품 문의」는 `/products/:id?kind=return&orderid=#qna`.

## 8. 주문·장바구니 잔여 ([같은 대화](fd674599-45c8-40dd-9cec-9b4533455c8f))

| 항목 | 결정 |
|---|---|
| SHOP-15 수량 ± | `PUT /cart` |
| SHOP-16 「쇼핑하기」 | 버튼 제거(onClick 없던 자리) |
| SHOP-17 주문서 | 회원 주문 유지. 비회원 주문 안 염 |
| 직접수령·기본지 | 현행 유지(배송비 0 + 수령지 표시). 주소 전환·`defaultyn` 안 함 |
| 페이공제 카피 | 「간사」「간사번호」 삭제. 필드 이름/번호. 결제 수단은 유지 |
| 주문완료 번호 | 하드코딩 `1234-5678` 제거. 실제 `orderid` |

## 9. 품질 게이트

- 클라이언트 `tsc`(Register `useState` never, OrderSheet 타입, Package/Location 임포트)는 이번 슬라이스에서 맞춤. 우회 `@ts-ignore`는 쓰지 않음.
- 공개 전: 자격 증명 파일은 커밋하지 않음. 원본 `query.txt`·`frontend/.env`는 유출로 보고 교체 권고.
- 남은 서버 FIXME(`jwt expired` → errorCode, refresh 에러 형식, 레거시 `/api/login`)는 README 추후 작업.
