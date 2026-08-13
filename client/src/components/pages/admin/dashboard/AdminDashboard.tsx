import {Box, Grid, IconButton, Typography} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AdminGnb from "@layout/AdminGnb";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {useAdminDashboardStatsQuery} from "@recoils/admin/order/query";
import {useNavigate} from "react-router";

export default function AdminDashboard() {
  return (
    <AdminGnb>
      <MainPane />
    </AdminGnb>
  );
}

function MainPane() {
  const navigate = useNavigate();
  const {isLoading, isError, stats, refetch} = useAdminDashboardStatsQuery();
  const updatedAt = new Date().toLocaleTimeString("ko-KR", {hour: "2-digit", minute: "2-digit"});

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error />;
  }

  return (
    <Box sx={{p: 3}}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{border: "1px solid #ccc", height: "100%"}}>
            <Box sx={{display: "flex", padding: "10px 20px", alignItems: "center"}}>
              <Box>주문/배송</Box>
              <Box sx={{marginLeft: "auto", display: "flex", gap: "5px", alignItems: "center"}}>
                <Box>{updatedAt}</Box>
                <IconButton size="small" onClick={() => refetch()} aria-label="새로고침">
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{display: "flex", gap: 2, padding: 2, justifyContent: "center", flexWrap: "wrap"}}>
              <StatBox label="신규주문(WAIT)" value={stats.wait} onClick={() => navigate("/admin/order")} />
              <StatBox label="배송준비/결제" value={stats.shipment} onClick={() => navigate("/admin/shipment")} />
              <StatBox label="완료 등" value={stats.complete} onClick={() => navigate("/admin/order")} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{border: "1px solid #ccc", height: "100%"}}>
            <Box sx={{display: "flex", padding: "10px 20px", alignItems: "center"}}>
              <Box>클레임</Box>
              <Box sx={{marginLeft: "auto", display: "flex", gap: "5px", alignItems: "center"}}>
                <Box>{updatedAt}</Box>
                <IconButton size="small" onClick={() => refetch()} aria-label="클레임 새로고침">
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{padding: "10px 20px", display: "flex", flexDirection: "column", gap: 1}}>
              <ClaimLine label="취소요청" value={stats.cancel} onClick={() => navigate("/admin/claim?type=cancel")} />
              <ClaimLine label="반품요청" value={stats.return} onClick={() => navigate("/admin/claim?type=return")} />
              <ClaimLine label="교환요청" value={stats.change} onClick={() => navigate("/admin/claim?type=change")} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

function StatBox({label, value, onClick}: {label: string; value: number; onClick: () => void}) {
  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      sx={{
        width: 140,
        height: 120,
        border: "1px solid #333",
        padding: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        cursor: "pointer",
      }}>
      <Typography variant="body2">{label}</Typography>
      <Typography variant="h6">{value}건</Typography>
    </Box>
  );
}

function ClaimLine({label, value, onClick}: {label: string; value: number; onClick: () => void}) {
  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        border: "1px solid #333",
        height: 40,
        padding: "0 10px",
        cursor: "pointer",
      }}>
      <Box>{label}</Box>
      <Box sx={{marginLeft: "auto"}}>{value}건</Box>
    </Box>
  );
}
