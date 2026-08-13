# Design

<!-- impeccable:design-schema 1 -->

## World

크라프트 로트 백. 포장대 위의 로트 스티커가 상품 카드다. 흰 그리드 몰·연두 포인트는 안티레퍼런스.

## Surfaces

- 스토어프론트(웹 `/`, 모바일 `/m`)만 이 세계를 쓴다. `/admin` 은 기존 테마.
- 토큰: `client/src/theme/kraft.ts`. 셸: `client/src/theme/ShopShell.tsx`.

## Palette

| 역할 | 값 |
|---|---|
| ink | `#1A120B` |
| paper | `#B48445` |
| paperDeep | `#8D5A2B` |
| sticker | `#F3E6C9` |
| stamp | `#B42318` |
| mute | `#4A341F` |

## Type

- UI: Noto Sans KR
- 워드마크·섹션: Archivo Narrow
- 로트/가격: Spline Sans Mono, tabular-nums

## Components

- 헤더: 잉크 워드마크, 빨간 LOT 스탬프, 스티커 카테고리
- 카드: 다이컷 창 + 스티커 라벨 (`ProductBag`)
- 버튼: 직각, contained=잉크/스티커, outlined=스티커 보더
- 장바구니·주문서·PDP 패널: 스티커 지면 + 잉크 2px 보더, radius 0

## Constraints

- 시드에 없는 원산지·후기·배송 면제 클레임을 만들지 않는다.
- LOT 번호는 상품 id 카탈로그 번호다.
