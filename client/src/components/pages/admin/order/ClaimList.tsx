import {useMemo, useState} from "react";
import AdminGnb from "@layout/AdminGnb";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {Box, Button, Checkbox, List, ListItemButton, ListItemIcon, ListItemText, Tab, Tabs, Toolbar} from "@mui/material";
import {
  useAdminOrdersClaimCancelQuery,
  useAdminOrdersClaimReturnQuery,
  useAdminOrdersClaimChangeQuery,
} from "@recoils/admin/order/query";
import {putAdminOrdersStatus} from "@recoils/admin/order/axios";
import {useQueryClient} from "react-query";
import NoData from "@web/common/NoData";
import {useSearchParams} from "react-router-dom";

type ClaimType = "cancel" | "return" | "change";

const statusByType: Record<ClaimType, string> = {
  cancel: "CANCEL",
  return: "RETURN",
  change: "CHANGE",
};

export default function ClaimList() {
  const [params, setParams] = useSearchParams();
  const initial = (params.get("type") as ClaimType) || "cancel";
  const [type, setType] = useState<ClaimType>(["cancel", "return", "change"].includes(initial) ? initial : "cancel");
  const queryClient = useQueryClient();
  const cancel = useAdminOrdersClaimCancelQuery();
  const ret = useAdminOrdersClaimReturnQuery();
  const change = useAdminOrdersClaimChangeQuery();
  const [selected, setSelected] = useState<any[]>([]);

  const active = useMemo(() => {
    if (type === "return") return ret;
    if (type === "change") return change;
    return cancel;
  }, [type, cancel, ret, change]);

  const list = active.data || [];

  if (cancel.isLoading || ret.isLoading || change.isLoading) return <Loading />;
  if (cancel.isError || ret.isError || change.isError) return <Error />;

  const handleTab = (_: any, value: ClaimType) => {
    setType(value);
    setSelected([]);
    setParams({type: value});
  };

  const toggle = (order: any) => {
    const idx = selected.findIndex(o => o.orderid === order.orderid);
    if (idx > -1) {
      setSelected([...selected.slice(0, idx), ...selected.slice(idx + 1)]);
    } else {
      setSelected([...selected, order]);
    }
  };

  const handleConfirm = async () => {
    if (!selected.length) {
      alert("주문을 선택하세요");
      return;
    }
    try {
      await putAdminOrdersStatus(
        selected.map(o => o.orderid),
        statusByType[type],
      );
      setSelected([]);
      queryClient.invalidateQueries("adminOrdersClaimCancel");
      queryClient.invalidateQueries("adminOrdersClaimReturn");
      queryClient.invalidateQueries("adminOrdersClaimChange");
      queryClient.invalidateQueries("adminOrders");
      active.refetch();
    } catch (err) {
      console.error(err);
      alert("클레임 처리에 실패했습니다");
    }
  };

  return (
    <AdminGnb>
      <Box sx={{p: 2}}>
        <Tabs value={type} onChange={handleTab} sx={{mb: 2}}>
          <Tab value="cancel" label={`취소(${cancel.data?.length || 0})`} />
          <Tab value="return" label={`반품(${ret.data?.length || 0})`} />
          <Tab value="change" label={`교환(${change.data?.length || 0})`} />
        </Tabs>
        {selected.length > 0 && (
          <Toolbar sx={{gap: 1, mb: 1}}>
            <Button variant="contained" onClick={handleConfirm}>
              클레임 확정 ({selected.length})
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
                <ListItemText primary={order.orderid} secondary={`상태: ${order.status} / 사용자: ${order.userid}`} />
              </ListItemButton>
            ))
          )}
        </List>
      </Box>
    </AdminGnb>
  );
}
