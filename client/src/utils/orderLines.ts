import dateFormat from "@utils/DateFormat";
import statusCheck from "@utils/StatusCheck";
import {numberFormat} from "@utils/Numaric";

export type OrderLineView = {
  updatedate: string;
  status: string;
  title: string;
  productid: number;
  thumbnail: string;
  itemid: number;
  option: string;
  cost: number;
  count: number;
};

export function displayValue(value: unknown, fallback = "—"): string {
  if (value == null) return fallback;
  const text = String(value).trim();
  return text || fallback;
}

export function formatOrderDate(value: unknown): string {
  if (value == null || value === "") return "—";
  const time = new Date(value as string | number | Date);
  if (Number.isNaN(time.getTime())) return "—";
  return dateFormat(value);
}

export function formatOrderMoney(value: unknown): string {
  if (value == null || value === "") return "—";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  return numberFormat(amount);
}

export function formatOrderAddress(delivery?: {postcode?: string; address1?: string; address2?: string} | null): string {
  if (!delivery) return "—";
  const line = [delivery.postcode ? `(${delivery.postcode})` : "", delivery.address1, delivery.address2]
    .map(part => (part ?? "").trim())
    .filter(Boolean)
    .join(" ");
  return line || "—";
}

export function mapOrderProducts(data: {updatedate?: unknown; status?: string; products?: Array<any>} | null | undefined): OrderLineView[] {
  const products = Array.isArray(data?.products) ? data.products : [];
  return products.map(item => ({
    updatedate: formatOrderDate(data?.updatedate),
    status: displayValue(statusCheck(data?.status ?? "")),
    title: displayValue(item.product?.title, "상품 정보 없음"),
    productid: Number(item.productid) || 0,
    thumbnail: item.product?.thumbnail ? String(item.product.thumbnail) : "",
    itemid: Number(item.itemid) || 0,
    option: item.option ? String(item.option) : "",
    cost: Number(item.cost) || 0,
    count: Number(item.count) || 0,
  }));
}

export function toRepurchaseProducts(lines: OrderLineView[]) {
  return lines
    .filter(item => item.productid > 0 && item.count > 0)
    .map(item => ({
      productid: item.productid,
      itemid: item.itemid,
      option: item.option,
      count: item.count,
      cost: item.cost,
    }));
}
