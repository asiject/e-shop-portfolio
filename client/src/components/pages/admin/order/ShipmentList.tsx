import {useState} from "react";
import AdminGnb from "@layout/AdminGnb";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {Box, Button, Checkbox, List, ListItemButton, ListItemIcon, ListItemText, Toolbar} from "@mui/material";
import {useAdminOrdersShipmentQuery} from "@recoils/admin/order/query";
import {putAdminOrdersStatus} from "@recoils/admin/order/axios";
import {useQueryClient} from "react-query";
import NoData from "@web/common/NoData";

export default function ShipmentList() {
  const queryClient = useQueryClient();
  const {isLoading, isError, data, refetch} = useAdminOrdersShipmentQuery();
  const [selected, setSelected] = useState<any[]>([]);
  const list = data || [];

  if (isLoading) return <Loading />;
  if (isError) return <Error />;

  const toggle = (order: any) => {
    const idx = selected.findIndex(o => o.orderid === order.orderid);
    if (idx > -1) {
      setSelected([...selected.slice(0, idx), ...selected.slice(idx + 1)]);
    } else {
      setSelected([...selected, order]);
    }
  };

  const handleComplete = async () => {
    if (!selected.length) {
      alert("주문을 선택하세요");
      return;
    }
    try {
      await putAdminOrdersStatus(
        selected.map(o => o.orderid),
        "COMPLETE",
      );
      setSelected([]);
      queryClient.invalidateQueries("adminOrdersShipment");
      queryClient.invalidateQueries("adminOrders");
      refetch();
    } catch (err) {
      console.error(err);
      alert("상태 변경에 실패했습니다");
    }
  };

  return (
    <AdminGnb>
      <Box sx={{p: 2}}>
        {selected.length > 0 && (
          <Toolbar sx={{gap: 1, mb: 1}}>
            <Button variant="contained" onClick={handleComplete}>
              발송완료 처리 ({selected.length})
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
                  primary={order.orderid}
                  secondary={`상태: ${order.status} / 사용자: ${order.userid}`}
                />
              </ListItemButton>
            ))
          )}
        </List>
      </Box>
    </AdminGnb>
  );
}
