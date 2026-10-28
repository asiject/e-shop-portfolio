# 1958SHOP

스페셜티 커피 쇼핑몰 포트폴리오입니다. React 클라이언트와 Fastify REST API 서버를 한 저장소에 둡니다.

## 이력서 문장

- 스페셜티 커피 쇼핑몰의 화면(React·TypeScript)과 REST API(Fastify·TypeORM·MySQL)를 클라이언트/서버로 나누어 구성했습니다.
- 상품·카테고리·장바구니·주문·회원·관리자 API와 Google 로그인 경로를 서버 라우트로 두었습니다.

공개 데모 URL은 없습니다. 대표 핀 3개(C-ON, THE FOUR, Bridge Card)와 별도인 풀스택 샘플입니다.

## 스택

| 영역 | 기술 |
|------|------|
| Client | React 18, TypeScript, Vite, MUI, React Query, Recoil, axios |
| Server | Fastify 4, TypeORM, MySQL, JWT, Google auth |

## 실행

의존성과 환경 변수가 맞아야 기동합니다. 비밀값은 커밋하지 않습니다.

```bash
cd client
npm install
npm run dev
```

```bash
cd server
npm install
npm run dev
```

클라이언트 환경 변수는 `client/.env.sample`을 기준으로 복사합니다. 서버는 MySQL 연결이 필요합니다.
