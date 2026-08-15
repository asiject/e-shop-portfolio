import {useEffect, useMemo, useState} from "react"
import AdminGnb from "@layout/AdminGnb"
import Loading from "@layout/Loading"
import Error from "@layout/Error"
import {Button} from "@mui/material"
import {
  useAdminOrdersClaimCancelQuery,
  useAdminOrdersClaimReturnQuery,
  useAdminOrdersClaimChangeQuery,
} from "@recoils/admin/order/query"
import {putAdminOrdersStatus} from "@recoils/admin/order/axios"
import {useQueryClient} from "react-query"
import {useSearchParams} from "react-router-dom"
import {OrderTicketList} from "./OrderTicketList"
import {AdminOrderRow} from "@utils/adminOrderSearch"

type ClaimType = "cancel" | "return" | "change"

const statusByType: Record<ClaimType, string> = {
  cancel: "CANCEL",
  return: "RETURN",
  change: "CHANGE",
}

const titleByType: Record<ClaimType, string> = {
  cancel: "취소 요청",
  return: "반품 요청",
  change: "교환 요청",
}

export default function ClaimList() {
  const [params] = useSearchParams()
  const initial = (params.get("type") as ClaimType) || "cancel"
  const type: ClaimType = ["cancel", "return", "change"].includes(initial) ? initial : "cancel"
  const queryClient = useQueryClient()
  const cancel = useAdminOrdersClaimCancelQuery()
  const ret = useAdminOrdersClaimReturnQuery()
  const change = useAdminOrdersClaimChangeQuery()
  const [selected, setSelected] = useState<AdminOrderRow[]>([])
  const [query, setQuery] = useState("")

  const active = useMemo(() => {
    if (type === "return") return ret
    if (type === "change") return change
    return cancel
  }, [type, cancel, ret, change])

  const list = (active.data || []) as AdminOrderRow[]

  useEffect(() => {
    setSelected([])
    setQuery("")
  }, [type])

  if (active.isLoading) return <Loading />
  if (active.isError) return <Error />

  const toggle = (order: AdminOrderRow) => {
    const idx = selected.findIndex(o => o.orderid === order.orderid)
    if (idx > -1) {
      setSelected([...selected.slice(0, idx), ...selected.slice(idx + 1)])
      return
    }
    setSelected([...selected, order])
  }

  const handleConfirm = async () => {
    if (!selected.length) return
    try {
      await putAdminOrdersStatus(
        selected.map(o => o.orderid),
        statusByType[type],
      )
      setSelected([])
      queryClient.invalidateQueries("adminOrdersClaimCancel")
      queryClient.invalidateQueries("adminOrdersClaimReturn")
      queryClient.invalidateQueries("adminOrdersClaimChange")
      queryClient.invalidateQueries("adminOrders")
      active.refetch()
    } catch (err) {
      console.error(err)
      alert("클레임 처리에 실패했습니다")
    }
  }

  return (
    <AdminGnb>
      <OrderTicketList
        title={titleByType[type]}
        list={list}
        selectedIds={selected.map(o => o.orderid)}
        onToggle={toggle}
        query={query}
        onQueryChange={setQuery}
        emptyHint={query.trim() ? "검색어가 날짜·이름·품목에 포함된 주문이 없습니다. 검색어를 지워 보세요." : "이 큐는 비었습니다."}
        actions={
          <Button variant="contained" onClick={handleConfirm} disabled={!selected.length}>
            클레임 확정 {selected.length ? `(${selected.length})` : ""}
          </Button>
        }
      />
    </AdminGnb>
  )
}
