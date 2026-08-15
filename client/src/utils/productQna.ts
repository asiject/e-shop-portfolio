import {isMobile} from "react-device-detect";

export type ProductQnaKind = "question" | "exchange" | "return";

export const PRODUCT_QNA_KIND_LABEL: Record<ProductQnaKind, string> = {
  question: "상품 문의",
  exchange: "교환",
  return: "반품",
};

export function isProductQnaKind(value: string | null): value is ProductQnaKind {
  return value === "question" || value === "exchange" || value === "return";
}

export function shopProductPath(productid: number | string) {
  return isMobile ? `/m/products/${productid}` : `/products/${productid}`;
}

export function shopProductQnaHref(
  productid: number | string,
  opts?: {kind?: ProductQnaKind; orderid?: string},
) {
  const params = new URLSearchParams();
  if (opts?.kind) params.set("kind", opts.kind);
  if (opts?.orderid) params.set("orderid", opts.orderid);
  const query = params.toString();
  return `${shopProductPath(productid)}${query ? `?${query}` : ""}#qna`;
}
