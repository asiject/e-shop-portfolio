import {useEffect, useState} from "react";
import AdminGnb from "@layout/AdminGnb";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import {useAdminOrdersWaitQuery, useAdminOrdersQuery} from "@recoils/admin/order/query";
import {putAdminOrdersStatus} from "@recoils/admin/order/axios";
import {useQueryClient} from "react-query";
import NoData from "@web/common/NoData";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function OrderList() {
  const queryClient = useQueryClient();
  const wait = useAdminOrdersWaitQuery();
  const complete = useAdminOrdersQuery();
  const [tab, setTab] = useState<"wait" | "done">("wait");
  const [selected, setSelected] = useState<any[]>([]);
  const [nextStatus, setNextStatus] = useState("PAYMENT");

  const active = tab === "wait" ? wait : complete;
  const list = active.data || [];

  useEffect(() => {
    setSelected([]);
  }, [tab]);

  if (wait.isLoading || complete.isLoading) return <Loading />;
  if (wait.isError || complete.isError) return <Error />;

  const toggle = (order: any) => {
    const idx = selected.findIndex(o => o.orderid === order.orderid);
    if (idx > -1) {
      setSelected([...selected.slice(0, idx), ...selected.slice(idx + 1)]);
    } else {
      setSelected([...selected, order]);
    }
  };

  const handleStatus = async () => {
    if (!selected.length) {
      alert("주문을 선택하세요");
      return;
    }
    try {
      await putAdminOrdersStatus(
        selected.map(o => o.orderid),
        nextStatus,
      );
      setSelected([]);
      queryClient.invalidateQueries("adminOrdersWait");
      queryClient.invalidateQueries("adminOrders");
      queryClient.invalidateQueries("adminOrdersShipment");
    } catch (err) {
      console.error(err);
      alert("상태 변경에 실패했습니다");
    }
  };

  return (
    <AdminGnb
      RightButtons={
        <Box sx={{display: "flex", gap: 1, alignItems: "center"}}>
          <IconButton sx={{color: "white"}} onClick={() => active.refetch()} aria-label="새로고침">
            <RefreshIcon />
          </IconButton>
        </Box>
      }>
      <Box sx={{p: 2}}>
        <Box sx={{display: "flex", gap: 1, mb: 2}}>
          <Button variant={tab === "wait" ? "contained" : "outlined"} onClick={() => setTab("wait")}>
            대기({wait.data?.length || 0})
          </Button>
          <Button variant={tab === "done" ? "contained" : "outlined"} onClick={() => setTab("done")}>
            완료/클레임확정({complete.data?.length || 0})
          </Button>
        </Box>
        {selected.length > 0 && (
          <Toolbar sx={{gap: 1, mb: 1}}>
            <Select size="small" value={nextStatus} onChange={e => setNextStatus(e.target.value)}>
              <MenuItem value="PAYMENT">결제완료</MenuItem>
              <MenuItem value="COMPLETE">완료</MenuItem>
              <MenuItem value="CANCEL">취소</MenuItem>
              <MenuItem value="RETURN">반품</MenuItem>
              <MenuItem value="CHANGE">교환</MenuItem>
            </Select>
            <Button variant="contained" onClick={handleStatus}>
              상태 변경 ({selected.length})
            </Button>
          </Toolbar>
        )}
        <List>
          {list.length === 0 ? (
            <NoData />
          ) : (
            list.map((order: any) => (
              <ListItemButton key={order.orderid} onClick={() => toggle(order)}>
                <ListItemIcon>
                  <Checkbox edge="start" checked={selected.some(o => o.orderid === order.orderid)} tabIndex={-1} disableRipple />
                </ListItemIcon>
                <ListItemText
                  primary={`${order.orderid}`}
                  secondary={`상태: ${order.status} / 사용자: ${order.userid} / ${order.createdate ? new Date(order.createdate).toLocaleString("ko-KR") : ""}`}
                />
              </ListItemButton>
            ))
          )}
        </List>
      </Box>
    </AdminGnb>
  );
}
