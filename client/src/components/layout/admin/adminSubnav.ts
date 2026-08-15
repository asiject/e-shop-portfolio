export type SubnavCountKey = "wait" | "shipment" | "complete" | "cancel" | "return" | "change"

export type NavLeaf = {
  id: string
  label: string
  to: string
  countKey?: SubnavCountKey
}

export type NavMid = {
  id: string
  label: string
  to: string
  children: NavLeaf[]
}

export type NavMajor = {
  id: string
  label: string
  children: NavMid[]
}

export const adminNavTree: NavMajor[] = [
  {
    id: "ops",
    label: "운영",
    children: [
      {
        id: "dash",
        label: "대시보드",
        to: "/admin/dashboard",
        children: [{id: "dash-queue", label: "오늘 큐", to: "/admin/dashboard"}],
      },
      {
        id: "order",
        label: "주문",
        to: "/admin/order",
        children: [
          {id: "order-wait", label: "대기", to: "/admin/order", countKey: "wait"},
          {id: "order-done", label: "완료/클레임확정", to: "/admin/order?tab=done", countKey: "complete"},
        ],
      },
      {
        id: "ship",
        label: "배송",
        to: "/admin/shipment",
        children: [{id: "ship-ready", label: "배송 준비", to: "/admin/shipment", countKey: "shipment"}],
      },
      {
        id: "claim",
        label: "클레임",
        to: "/admin/claim?type=cancel",
        children: [
          {id: "claim-cancel", label: "취소 요청", to: "/admin/claim?type=cancel", countKey: "cancel"},
          {id: "claim-return", label: "반품 요청", to: "/admin/claim?type=return", countKey: "return"},
          {id: "claim-change", label: "교환 요청", to: "/admin/claim?type=change", countKey: "change"},
        ],
      },
    ],
  },
  {
    id: "goods",
    label: "상품",
    children: [
      {
        id: "product",
        label: "상품",
        to: "/admin/product",
        children: [
          {id: "product-list", label: "상품 목록", to: "/admin/product"},
          {id: "product-write", label: "상품 등록", to: "/admin/product/write"},
          {id: "product-qna", label: "상품 문의", to: "/admin/product/qna"},
        ],
      },
      {
        id: "category",
        label: "카테고리",
        to: "/admin/category",
        children: [{id: "category-list", label: "카테고리 목록", to: "/admin/category"}],
      },
    ],
  },
  {
    id: "settings",
    label: "설정",
    children: [
      {
        id: "policy",
        label: "정책",
        to: "/admin/policy",
        children: [{id: "policy-list", label: "할인·배송 정책", to: "/admin/policy"}],
      },
      {
        id: "role",
        label: "권한",
        to: "/admin/role",
        children: [{id: "role-list", label: "관리자 목록", to: "/admin/role"}],
      },
      {
        id: "menu",
        label: "메뉴",
        to: "/admin/menu",
        children: [{id: "menu-list", label: "메뉴 목록", to: "/admin/menu"}],
      },
    ],
  },
]

export function isSubnavCurrent(to: string, pathname: string, search: string): boolean {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search)
  const target = new URL(to, "http://local")
  const targetPath = target.pathname
  const targetParams = target.searchParams

  if (targetPath === "/admin/dashboard") {
    return pathname === "/admin/dashboard"
  }
  if (pathname.startsWith("/admin/product/qna") || targetPath.startsWith("/admin/product/qna")) {
    return pathname.startsWith("/admin/product/qna") && targetPath.startsWith("/admin/product/qna")
  }
  if (pathname.startsWith("/admin/product/write") || targetPath.startsWith("/admin/product/write")) {
    return pathname.startsWith("/admin/product/write") && targetPath.startsWith("/admin/product/write")
  }
  if (targetPath === "/admin/product") {
    return pathname === "/admin/product" || /^\/admin\/product\/\d+$/.test(pathname)
  }
  if (pathname.startsWith("/admin/order") || targetPath.startsWith("/admin/order")) {
    if (!pathname.startsWith("/admin/order") || !targetPath.startsWith("/admin/order")) return false
    return (targetParams.get("tab") === "done") === (params.get("tab") === "done")
  }
  if (pathname.startsWith("/admin/claim") || targetPath.startsWith("/admin/claim")) {
    if (!pathname.startsWith("/admin/claim") || !targetPath.startsWith("/admin/claim")) return false
    return (targetParams.get("type") || "cancel") === (params.get("type") || "cancel")
  }
  return pathname === targetPath || pathname.startsWith(`${targetPath}/`)
}

export function isMainNavCurrent(url: string, pathname: string): boolean {
  const path = new URL(url, "http://local").pathname
  if (path === "/admin/dashboard") {
    return pathname === "/admin/dashboard"
  }
  return pathname === path || pathname.startsWith(`${path}/`)
}
