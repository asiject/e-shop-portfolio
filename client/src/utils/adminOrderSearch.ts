export type AdminOrderProduct = {
  option?: string
  product?: {title?: string}
}

export type AdminOrderRow = {
  orderid: string
  status: string
  createdate?: string | Date
  userid?: string
  buyer?: {buyername?: string}
  products?: AdminOrderProduct[]
}

function pad(n: number) {
  return String(n).padStart(2, "0")
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "")
}

function toDate(value?: string | Date): Date | null {
  if (!value) return null
  const d = value instanceof Date ? value : new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

function datePlainTexts(value?: string | Date): string[] {
  const d = toDate(value)
  if (!d) return value ? [String(value)] : []
  const y = d.getFullYear()
  const m = d.getMonth() + 1
  const day = d.getDate()
  const pm = pad(m)
  const pd = pad(day)
  return [
    `${y}-${pm}-${pd}`,
    `${y}.${pm}.${pd}`,
    `${y}/${pm}/${pd}`,
    `${y}${pm}${pd}`,
    `${pm}-${pd}`,
    `${pm}/${pd}`,
    `${m}/${day}`,
    `${y}년 ${m}월 ${day}일`,
    `${m}월 ${day}일`,
    d.toLocaleDateString("ko-KR"),
    d.toLocaleString("ko-KR"),
    formatOrderWhen(d),
  ]
}

function dateMatchesPlain(value: string | Date | undefined, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  if (datePlainTexts(value).some(text => text.toLowerCase().includes(q))) return true
  const qDigits = digitsOnly(q)
  if (qDigits.length < 3) return false
  const d = toDate(value)
  if (!d) return digitsOnly(String(value)).includes(qDigits)
  const ymd = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
  const ymdShort = ymd.slice(2)
  const md = ymd.slice(4)
  return ymd.includes(qDigits) || ymdShort.includes(qDigits) || md.includes(qDigits)
}

function itemText(order: AdminOrderRow): string {
  return (order.products || [])
    .map(line => `${line.product?.title || ""} ${line.option || ""}`)
    .join(" ")
}

export function orderMatchesQuery(order: AdminOrderRow, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const name = (order.buyer?.buyername || "").toLowerCase()
  const items = itemText(order).toLowerCase()
  return name.includes(q) || items.includes(q) || dateMatchesPlain(order.createdate, query)
}

export function formatOrderWhen(value?: string | Date): string {
  if (!value) return ""
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleString("ko-KR", {month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit"})
}

export function orderItemSummary(order: AdminOrderRow): string {
  const lines = order.products || []
  if (!lines.length) return "상품 정보 없음"
  const first = lines[0]
  const title = first.product?.title || "상품"
  const option = first.option ? ` · ${first.option}` : ""
  const extra = lines.length > 1 ? ` 외 ${lines.length - 1}건` : ""
  return `${title}${option}${extra}`
}
