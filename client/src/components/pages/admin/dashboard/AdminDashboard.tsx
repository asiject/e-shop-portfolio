import {Box, IconButton, Typography} from "@mui/material"
import RefreshIcon from "@mui/icons-material/Refresh"
import AdminGnb from "@layout/AdminGnb"
import Loading from "@layout/Loading"
import Error from "@layout/Error"
import {useAdminDashboardStatsQuery} from "@recoils/admin/order/query"
import {useNavigate} from "react-router"
import {wb} from "theme/adminWorkbench"

type QueueItem = {label: string; value: number; to: string; hot?: boolean}

export default function AdminDashboard() {
  return (
    <AdminGnb>
      <MainPane />
    </AdminGnb>
  )
}

function MainPane() {
  const navigate = useNavigate()
  const {isLoading, isError, stats, refetch} = useAdminDashboardStatsQuery()
  const updatedAt = new Date().toLocaleTimeString("ko-KR", {hour: "2-digit", minute: "2-digit"})

  if (isLoading) return <Loading />
  if (isError) return <Error />

  const queues: QueueItem[] = [
    {label: "신규 주문", value: stats.wait, to: "/admin/order", hot: true},
    {label: "배송 준비", value: stats.shipment, to: "/admin/shipment"},
    {label: "취소 요청", value: stats.cancel, to: "/admin/claim?type=cancel", hot: true},
    {label: "반품 요청", value: stats.return, to: "/admin/claim?type=return", hot: true},
    {label: "교환 요청", value: stats.change, to: "/admin/claim?type=change", hot: true},
    {label: "완료", value: stats.complete, to: "/admin/order?tab=done"},
  ]

  return (
    <Box>
      <Box sx={{display: "flex", alignItems: "flex-end", gap: 1, mb: 2}}>
        <Box sx={{flex: 1}}>
          <Typography component="h1" sx={{m: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em"}}>
            오늘 큐
          </Typography>
          <Typography sx={{m: 0, mt: 0.5, fontSize: 13, color: wb.mute}}>갱신 {updatedAt}</Typography>
        </Box>
        <IconButton size="small" onClick={() => refetch()} aria-label="새로고침" sx={{color: wb.ink}}>
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
        {queues.map(item => (
          <Box
            key={item.to}
            component="button"
            type="button"
            onClick={() => navigate(item.to)}
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              p: 1.5,
              border: `1px solid ${wb.line}`,
              bgcolor: wb.paper,
              color: wb.ink,
              cursor: "pointer",
              font: "inherit",
              textAlign: "left",
              "&:hover": {borderColor: wb.action},
            }}>
            <Box>{item.label}</Box>
            <Box sx={{ml: "auto", fontWeight: 700, fontVariantNumeric: "tabular-nums", color: item.hot && item.value > 0 ? wb.wait : wb.ink}}>
              {item.value}건
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
