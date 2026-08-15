import {useState} from "react"
import AdminGnb from "@layout/AdminGnb"
import Loading from "@layout/Loading"
import Error from "@layout/Error"
import {Button} from "@mui/material"
import {useAdminOrdersShipmentQuery} from "@recoils/admin/order/query"
import {putAdminOrdersStatus} from "@recoils/admin/order/axios"
import {useQueryClient} from "react-query"
import {OrderTicketList} from "./OrderTicketList"
import {AdminOrderRow} from "@utils/adminOrderSearch"

export default function ShipmentList() {
  const queryClient = useQueryClient()
  const {isLoading, isError, data, refetch} = useAdminOrdersShipmentQuery()
  const [selected, setSelected] = useState<AdminOrderRow[]>([])
  const [query, setQuery] = useState("")
  const list = (data || []) as AdminOrderRow[]

  if (isLoading) return <Loading />
  if (isError) return <Error />

  const toggle = (order: AdminOrderRow) => {
    const idx = selected.findIndex(o => o.orderid === order.orderid)
    if (idx > -1) {
      setSelected([...selected.slice(0, idx), ...selected.slice(idx + 1)])
      return
    }
    setSelected([...selected, order])
  }

  const handleComplete = async () => {
    if (!selected.length) return
    try {
      await putAdminOrdersStatus(
        selected.map(o => o.orderid),
        "COMPLETE",
      )
      setSelected([])
      queryClient.invalidateQueries("adminOrdersShipment")
      queryClient.invalidateQueries("adminOrders")
      refetch()
    } catch (err) {
      console.error(err)
      alert("상태 변경에 실패했습니다")
    }
  }

  return (
    <AdminGnb>
      <OrderTicketList
        title="배송 준비"
        list={list}
        selectedIds={selected.map(o => o.orderid)}
        onToggle={toggle}
        query={query}
        onQueryChange={setQuery}
        emptyHint={query.trim() ? "검색어가 날짜·이름·품목에 포함된 주문이 없습니다. 검색어를 지워 보세요." : "배송 준비 주문이 없습니다."}
        actions={
          <Button variant="contained" onClick={handleComplete} disabled={!selected.length}>
            발송완료 {selected.length ? `(${selected.length})` : ""}
          </Button>
        }
      />
    </AdminGnb>
  )
}
