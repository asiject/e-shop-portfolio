# Cursor 작업 결정 보고

원본 `cccvlmcia/1958shop2` (`origin/main`, `eb20f29`) 이후 Cursor와 진행한 결정만 적습니다. 구현 세부가 아니라 **무엇을 택했고 무엇을 버렸는지**입니다.

## 1. 레포 범위 (포트폴리오)

| 결정 | 이유 |
|---|---|
| 공개 레포 `asiject/1958shop-portfolio` | 개인 포트폴리오 |
| 기존 git 이력은 가져가지 않음 (orphan) | 원본 커밋/작성자 이력을 복제하지 않음 |
| `main` = 원본 샵 스냅샷, PR 브랜치 = 이후 기능 커밋 | “git에서 받은 부분부터 현재까지”를 PR로 보여 줌 |
| `frontend/`, `frontend-admin/` 제외 | 레거시. 원본 `frontend/.env`가 추적되어 공개 불가 |
| `query.txt` 제외 | DB 계정·호스트가 평문으로 들어 있음. **해당 비밀번호는 교체할 것** |
| `server/dist`, `config/json`, `.yarn` 캐시 제외 | 빌드 산출물·로컬 시크릿·설치 캐시 |

이 작업 폴더(`1958shop2`)의 `frontend`는 삭제하지 않았습니다. 포트폴리오 레포에만 넣지 않습니다.

## 2. 런타임 · 타입 ([Fastify module error](062a9702-5b8d-4c75-84f9-a77534f719de))

- `Cannot find module 'fastify'`: 의존성은 `package.json`에 있고 `node_modules`가 없었음 → 설치로 해결.
- `tsconfig` `baseUrl` 경고: 경로 별칭은 `tsconfig.path.json`으로 유지.

## 3. 데이터 · 상품 ([Ponytail client/server 감사](46133360-7476-4db2-aa6a-afe345f3a9e7))

- `Table '1958shop.productoptionitems' doesn't exist`: SQL 오타가 아니라 **테이블 미생성**. TypeORM 엔티티명과 실제 테이블이 달랐음.
- 상품/옵션 API는 엔티티 관계 기준으로 조회하도록 맞춤. 시드는 가상 커피 SKU(원두·콜드브루·드리퍼·머그).

## 4. 데모 로그인 · 관리자 메뉴 ([데모 관리자 메뉴](f9fe9082-19fa-4c9b-8e08-2b545ad96347), [데모 어드민 기능](d7fd1230-a205-4a24-8752-0fde9973a428))

- 소개용으로 Google 없이 `USER` / `ADMIN` 원클릭 로그인.
- 운영 기본값은 끔 (`ENABLE_DEMO_LOGIN`, `VITE_ENABLE_DEMO_LOGIN`). DEV만 버튼 표시.
- 데모 관리자 메뉴가 비던 이유: 역할은 있어도 **menu 시드가 없음**. 데모 관리자 생성 시 기본 메뉴를 보장.
- 관리자 라우트는 `isAdmin`으로 가드. 스토어 UI와 관리자 UI를 섞지 않음.

## 5. 스토어 UI ([Modern UI design proposals](48a36bb3-9f1b-4233-b266-cfc3528bb0f7))

- Impeccable(`pbakaus/impeccable`)로 방향 워크숍. 기존 1024px·연두(`#9ac66d`) 몰은 안티레퍼런스.
- 후보: A 키사텐 / **B 크라프트 로트** / C 네오브루털 / D 프로비넌스.
- **채택 B.** 상품이 로트 가방으로 보이게. 관리자는 리디자인 범위 밖.
- 시드에 없는 원산지·후기·무료배송 클레임은 만들지 않음. LOT 번호는 상품 id 카탈로그 번호.
- 세계가 하나여야 해서 B+C 혼합은 하지 않음.

## 6. 품질 게이트

- 클라이언트 `tsc`에는 원본부터 있던 Register/OrderSheet 타입 에러가 남아 있음. 이번 작업에서 우회하지 않음.
- 공개 전: 자격 증명 파일은 커밋하지 않음. 원본 `query.txt`·`frontend/.env`는 유출로 보고 교체 권고.
