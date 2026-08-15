---
name: E-SHOP
description: 크라프트 포장대 위의 로트 스티커가 상품 카드인 스페셜티 커피 샵
colors:
  ink: "#1A120B"
  ink-hover: "#2A1E14"
  paper: "#B48445"
  paper-deep: "#8D5A2B"
  sticker: "#F3E6C9"
  sticker-hover: "#E8D7B4"
  stamp: "#B42318"
  mute: "#4A341F"
  window: "#2A1A10"
typography:
  display:
    fontFamily: "Archivo Narrow, Noto Sans KR, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    letterSpacing: "0.04em"
  headline:
    fontFamily: "Archivo Narrow, Noto Sans KR, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Noto Sans KR, sans-serif"
    fontSize: "15px"
    fontWeight: 800
    lineHeight: 1.3
  body:
    fontFamily: "Noto Sans KR, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Spline Sans Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 600
    letterSpacing: "0.08em"
rounded:
  none: "0"
spacing:
  sm: "8px"
  md: "16px"
  lg: "28px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sticker}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
    typography: "{typography.title}"
  button-primary-hover:
    backgroundColor: "{colors.ink-hover}"
    textColor: "{colors.sticker}"
    rounded: "{rounded.none}"
  button-outlined:
    backgroundColor: "{colors.sticker}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
  button-outlined-hover:
    backgroundColor: "{colors.sticker-hover}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  input:
    backgroundColor: "{colors.sticker}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  card-sticker:
    backgroundColor: "{colors.sticker}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "28px 24px"
  card-lot-bag:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "14px 14px 18px"
---

# Design System: E-SHOP

<!-- impeccable:design-schema 1 -->

## Overview

**Creative North Star: "크라프트 로트 백"**

포장대 위의 로트 스티커가 상품 카드다. 화면은 흰 그리드 몰이 아니라 크라프트지 필드이고, 상품은 다이컷 창이 난 종이 봉투다. 가격은 영수증 모노로 읽고, 빨간 LOT 스탬프는 한 번에 하나만 찍힌다.

밀도는 작업대처럼 촘촘하지 않다. 로트를 고르고 분쇄·세트·색상을 이해한 뒤 담는 구매 결정이 한눈에 보여야 한다. 연두 언더라인·네이비 가격·범용 이커머스 카드는 안티레퍼런스다.

**Key Characteristics:**
- 전폭 크라프트 필드 (`html`과 `ShopShell`이 같은 그라데이션 캔버스)
- 직각, 잉크 보더, 오프셋 블록 섀도
- 다이컷 창 + 스티커 라벨이 상품의 기본 단위
- `/admin`은 이 세계를 쓰지 않는다

## Colors

크라프트지·잉크·한 방의 적색 스탬프. 액센트는 stamp뿐이고 드물다.

### Primary
- **Ink** (`{colors.ink}`): 텍스트, contained 버튼, 2px 보더. 호버는 `{colors.ink-hover}`.
- **Paper** (`{colors.paper}`): 페이지 필드. 하이라이트 타원과 그림자 타원이 겹친 크라프트 그라데이션의 바닥색.
- **Paper Deep** (`{colors.paper-deep}`): 로트 백 외피.

### Secondary
- **Stamp** (`{colors.stamp}`): LOT 스탬프·경고. 화면당 한 음성.

### Neutral
- **Sticker** (`{colors.sticker}`): 패널·라벨·outlined 버튼 지면. 호버 `{colors.sticker-hover}`.
- **Mute** (`{colors.mute}`): 보조 카피. 회색이 아니라 잉크의 묽은 갈색.
- **Window** (`{colors.window}`): 다이컷 창·이미지 없는 슬롯.

**The One Stamp Rule.** stamp는 LOT 표시와 진짜 경고에만 쓴다. 링크·호버·아이콘을 빨갛게 물리지 않는다.

**The No Gray Rule.** 보조 텍스트는 mute다. `#888`·`text.secondary` 기본 회색은 쓰지 않는다.

## Typography

**Display Font:** Archivo Narrow (Noto Sans KR fallback)
**Body Font:** Noto Sans KR
**Label/Mono Font:** Spline Sans Mono (`tabular-nums`)

**Character:** 좁은 산세리프가 섹션을 찍고, 본문은 한국어 산세리프, 로트·가격만 모노다. 브랜드는 `/public/img/logo.webp` 정사각 로고다.

### Hierarchy
- **Display** (700, 28px, tracking 0.04em): 404 제목, 로그인 보조 카피.
- **Headline** (700, 22px, tracking -0.03em): 페이지 제목.
- **Title** (800, 15px, line-height 1.3): 상품명.
- **Body** (400, 14px): 설명·보조. 회색 대신 mute.
- **Label** (600, 11px, tracking 0.08em): `LOT 01` 형식. `lotLabel(id)`가 유일한 번호 형식.

**The Receipt Rule.** 가격·LOT·재고 숫자는 Spline Sans Mono + tabular-nums. 본문 산세리프에 금액을 넣지 않는다.

## Layout

스토어프론트 웹은 콘텐츠 폭 1024px, 모바일은 `/m`에서 전폭. 셸은 `min-height: 100vh`. 로그인·404는 중앙 280px 스티커 카드. PDP는 스티커 패널 안에서 이미지(정사각) + 구매 정보가 나란히(웹) 또는 위아래(모바일).

리듬은 8의 배수: 8 / 16 / 28 / 40. 그룹은 붙이고, 섹션 사이는 넉넉히.

## Elevation & Depth

그림자는 분위기용 블러가 아니라 종이 한 장이 포장대에 놓인 오프셋이다. 보더와 섀도를 동시에 쓰면 보더는 실루엣, 섀도는 놓인 위치.

### Shadow Vocabulary
- **Lot bag** (`box-shadow: 6px 8px 0 rgba(26, 18, 11, 0.28)`): 로트 백·로그인 카드. `kraft.shadow`.
- **Category chip** (`box-shadow: 2px 3px 0 rgba(26, 18, 11, 0.35)`): 모바일 카테고리 스티커.
- **Resting controls:** 버튼은 `box-shadow: none`. 호버로 떠오르지 않는다.

**The Paper-On-Table Rule.** 떠 있는 카드(소프트 블러, 0-offset 글로우)는 금지. 그림자는 항상 아래-오른쪽으로 밀린 블록이다.

## Shapes

모든 컨트롤·패널 radius 0. 유일한 곡선은 로트 백 다이컷 창(`border-radius: 50% / 42%`, 창 보더 3px `#3A2414`). 알약·12px 카드 라운드는 이 세계에 없다.

보더는 잉크 2px가 기본(패널·outlined 버튼). 라벨 스티커만 1px. 포커스는 잉크 3px outline, offset 3px (`ShopShell`).

## Components

### Buttons
- **Shape:** 직각 (0). 대문자 변환 없음, weight 700.
- **Primary (contained):** 잉크 바탕 / 스티커 글자. 호버 `{colors.ink-hover}`, 섀도 없음.
- **Outlined:** 스티커 바탕, 잉크 2px 보더. 호버 `{colors.sticker-hover}`.
- **Focus:** 셸의 3px 잉크 링.

### Cards / Containers
- **Lot bag (`ProductBag`):** paper-deep 외피, 잉크 2px, lot-bag 섀도. 위 다이컷 창(4:5, window 필), 아래 스티커 라벨(상품명·설명·가격).
- **Sticker panel:** 스티커 지면, 잉크 2px. 로그인, 404, PDP, 장바구니·주문서.
- **Internal padding:** 라벨 10px, 로그인/404 28×24, PDP는 패널이 감싼다.

### Inputs / Fields
- **Style:** 스티커 바탕, 직각, 잉크 fieldset.
- **Focus:** 보더 2px 잉크. caret는 잉크.
- **Selection:** 잉크 바탕 / 스티커 글자.

### Navigation
- **로고:** `/public/img/logo.webp` 정사각. GNB는 LOT 스탬프 옆(`md` 56px), 모바일 `sm` 36px, 로그인 `lg` 96px.
- **LOT 스탬프:** 로고 옆, stamp 3px 보더 + 모노 라벨. 한 개.
- **카테고리:** 스티커 칩. 모바일은 작은 블록 섀도.
- **로그인 칩:** 스티커 + 잉크 1px.

### Product images
- **0장:** `NoImage` — window 필 위 모노 `no image`.
- **1장:** 정사각 커버, 갤러리 없음.
- **2장 이상:** 정사각 뷰어 + 하단 56px 썸네일. 현재 컷만 잉크 2px, 나머지는 paper-deep 2px. 좌우 키로 전환. 썸네일·상세 경로가 같으면 한 장으로 합친다.

### Empty / 404
로그인·404는 같은 280px 스티커 카드. 404 제목은 Display `404 Not Found`, 본문은 mute, 액션은 contained **매장으로**.

## Do's and Don'ts

### Do:
- **Do** 페이지 필드와 `html`에 같은 크라프트 그라데이션을 쓴다. 오버스크롤이 하얗게 비치면 안 된다.
- **Do** 상품 카드는 `ProductBag` 다이컷+스티커 구조로 만든다.
- **Do** LOT 번호는 `lotLabel(id)`만 쓴다.
- **Do** `/admin`은 `adminWorkbench` 토큰을 쓰고 크라프트를 섞지 않는다.

### Don't:
- **Don't** 연두 `#9ac66d`, 흰 그리드, 소프트 카드 섀도, 알약 버튼을 스토어에 되돌리지 않는다.
- **Don't** 시드에 없는 원산지·후기·수상·배송 면제를 카피에 넣지 않는다.
- **Don't** 이미지 없을 때 빈 박스를 두지 않는다. `no image` 텍스트다.
- **Don't** 1장짜리 상품에 썸네일 스트립을 달지 않는다.
