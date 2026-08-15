import {useEffect, useState} from "react"
import AdminGnb from "@layout/AdminGnb"
import Loading from "@layout/Loading"
import Error from "@layout/Error"
import {Box, Button, MenuItem, Select} from "@mui/material"
import {useAdminOrdersWaitQuery, useAdminOrdersQuery} from "@recoils/admin/order/query"
import {putAdminOrdersStatus} from "@recoils/admin/order/axios"
import {useQueryClient} from "react-query"
import {useSearchParams} from "react-router-dom"
import {OrderTicketList} from "./OrderTicketList"
import {AdminOrderRow} from "@utils/adminOrderSearch"

export default function OrderList() {
  const queryClient = useQueryClient()
  const [params] = useSearchParams()
  const tab = params.get("tab") === "done" ? "done" : "wait"
  const wait = useAdminOrdersWaitQuery()
  const complete = useAdminOrdersQuery()
  const [selected, setSelected] = useState<AdminOrderRow[]>([])
  const [nextStatus, setNextStatus] = useState("PAYMENT")
  const [query, setQuery] = useState("")

  const active = tab === "wait" ? wait : complete
  const list = (active.data || []) as AdminOrderRow[]

  useEffect(() => {
    setSelected([])
    setQuery("")
  }, [tab])

  if (wait.isLoading || complete.isLoading) return <Loading />
  if (wait.isError || complete.isError) return <Error />

  const toggle = (order: AdminOrderRow) => {
    const idx = selected.findIndex(o => o.orderid === order.orderid)
    if (idx > -1) {
      setSelected([...selected.slice(0, idx), ...selected.slice(idx + 1)])
      return
    }
    setSelected([...selected, order])
  }

  const handleStatus = async () => {
    if (!selected.length) return
    try {
      await putAdminOrdersStatus(
        selected.map(o => o.orderid),
        nextStatus,
      )
      setSelected([])
      queryClient.invalidateQueries("adminOrdersWait")
      queryClient.invalidateQueries("adminOrders")
      queryClient.invalidateQueries("adminOrdersShipment")
    } catch (err) {
      console.error(err)
      alert("상태 변경에 실패했습니다")
    }
  }

  return (
    <AdminGnb>
      <OrderTicketList
        title={tab === "wait" ? "대기" : "완료/클레임확정"}
        list={list}
        selectedIds={selected.map(o => o.orderid)}
        onToggle={toggle}
        query={query}
        onQueryChange={setQuery}
        emptyHint={query.trim() ? "검색어가 날짜·이름·품목에 포함된 주문이 없습니다. 검색어를 지워 보세요." : "이 목록은 비었습니다."}
        actions={
          <Box sx={{display: "flex", gap: 1, alignItems: "center"}}>
            <Select size="small" value={nextStatus} onChange={e => setNextStatus(e.target.value)} aria-label="변경할 상태" disabled={!selected.length}>
              <MenuItem value="PAYMENT">결제완료</MenuItem>
              <MenuItem value="COMPLETE">완료</MenuItem>
              <MenuItem value="CANCEL">취소</MenuItem>
              <MenuItem value="RETURN">반품</MenuItem>
              <MenuItem value="CHANGE">교환</MenuItem>
            </Select>
            <Button variant="contained" onClick={handleStatus} disabled={!selected.length}>
              처리 {selected.length ? `(${selected.length})` : ""}
            </Button>
          </Box>
        }
      />
    </AdminGnb>
  )
}
