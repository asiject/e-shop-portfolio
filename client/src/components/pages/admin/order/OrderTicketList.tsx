import {ReactNode} from "react"
import {Box, Button, Checkbox, TextField, Typography} from "@mui/material"
import {wb} from "theme/adminWorkbench"
import {AdminOrderRow, formatOrderWhen, orderItemSummary, orderMatchesQuery} from "@utils/adminOrderSearch"

type OrderTicketListProps = {
  title: string
  list: AdminOrderRow[]
  selectedIds: string[]
  onToggle: (order: AdminOrderRow) => void
  query: string
  onQueryChange: (value: string) => void
  actions?: ReactNode
  emptyHint: string
}

export const OrderTicketList = ({title, list, selectedIds, onToggle, query, onQueryChange, actions, emptyHint}: OrderTicketListProps) => {
  const visible = list.filter(order => orderMatchesQuery(order, query))

  return (
    <Box sx={{display: "flex", flexDirection: "column", gap: 1.5, minHeight: "100%"}}>
      <Box sx={{display: "flex", alignItems: "flex-end", flexWrap: "wrap", gap: 1.5}}>
        <Box sx={{flex: "1 1 200px"}}>
          <Typography component="h1" sx={{m: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", color: wb.ink}}>
            {title} {visible.length}
          </Typography>
          <Typography sx={{m: 0, mt: 0.5, fontSize: 13, color: wb.mute}}>날짜는 평문(예: 2025-08-14, 8월 14일), 이름·품목은 포함 검색</Typography>
        </Box>
        <TextField
          size="small"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          placeholder="2025-08-14, 이름, 품목"
          inputProps={{"aria-label": "날짜 평문, 이름, 품목 검색"}}
          sx={{
            width: 240,
            bgcolor: wb.paper,
            "& .MuiOutlinedInput-root": {borderRadius: "2px"},
            "& fieldset": {borderColor: wb.line},
          }}
        />
        {actions}
      </Box>
      {visible.length === 0 ? (
        <Box sx={{p: 6, textAlign: "center", color: wb.mute, bgcolor: wb.paper, border: `1px dashed ${wb.line}`}}>{emptyHint}</Box>
      ) : (
        <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
          {visible.map(order => {
            const checked = selectedIds.includes(order.orderid)
            return (
              <Button
                key={order.orderid}
                type="button"
                onClick={() => onToggle(order)}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "28px 1fr auto",
                  gap: 1.5,
                  alignItems: "center",
                  p: 1.5,
                  textAlign: "left",
                  bgcolor: checked ? "#fff7f2" : wb.paper,
                  border: `1px solid ${checked ? wb.action : wb.line}`,
                  borderRadius: "2px",
                  color: wb.ink,
                  textTransform: "none",
                  "&:hover": {bgcolor: checked ? "#fff7f2" : wb.paper, borderColor: wb.action},
                }}>
                <Checkbox checked={checked} tabIndex={-1} disableRipple sx={{p: 0, color: wb.mute, "&.Mui-checked": {color: wb.action}}} />
                <Box>
                  <Box sx={{fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em"}}>{order.orderid}</Box>
                  <Box sx={{mt: 0.25, fontSize: 13, color: wb.mute}}>
                    {formatOrderWhen(order.createdate)}
                    {order.buyer?.buyername ? ` · ${order.buyer.buyername}` : ""}
                    {` · ${orderItemSummary(order)}`}
                  </Box>
                </Box>
                <Box sx={{fontWeight: 650, fontVariantNumeric: "tabular-nums", fontSize: 13, color: wb.mute}}>{order.status}</Box>
              </Button>
            )
          })}
        </Box>
      )}
    </Box>
  )
}
