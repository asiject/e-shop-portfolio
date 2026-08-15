import {useState, useEffect} from "react";
import AdminGnb from "@layout/AdminGnb";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {Box, Button, FormControlLabel, Switch, TextField, Typography} from "@mui/material";
import {getDeliveryPolicy, getDiscountPolicy, putDeliveryPolicy, putDiscountPolicy} from "@recoils/admin/policy/axios";
import {useQuery, useQueryClient} from "react-query";
import {options} from "@recoils/common";

export default function PolicyList() {
  return (
    <AdminGnb>
      <MainPane />
    </AdminGnb>
  );
}

function MainPane() {
  const queryClient = useQueryClient();
  const discountQ = useQuery("discountPolicy", () => getDiscountPolicy(), options);
  const deliveryQ = useQuery("deliveryPolicy", () => getDeliveryPolicy(), options);

  const [discount, setDiscount] = useState({id: 0, type: "RATE", value: 0, useyn: "Y"});
  const [delivery, setDelivery] = useState({
    id: 0,
    company: "",
    price: 0,
    address: "",
    return_price: 0,
    change_price: 0,
    conditions: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (discountQ.data?.data) {
      setDiscount(discountQ.data.data);
    }
  }, [discountQ.data]);

  useEffect(() => {
    if (deliveryQ.data?.data) {
      setDelivery(deliveryQ.data.data);
    }
  }, [deliveryQ.data]);

  if (discountQ.isLoading || deliveryQ.isLoading) return <Loading />;
  if (discountQ.isError || deliveryQ.isError) return <Error />;

  const handleSaveDiscount = async () => {
    if (!discount?.id) {
      alert("할인 정책 데이터가 없습니다");
      return;
    }
    setSaving(true);
    try {
      await putDiscountPolicy(discount);
      queryClient.invalidateQueries("discountPolicy");
      alert("할인 정책을 저장했습니다");
    } catch (err) {
      console.error(err);
      alert("할인 정책 저장에 실패했습니다");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDelivery = async () => {
    if (!delivery?.id) {
      alert("배송 정책 데이터가 없습니다");
      return;
    }
    setSaving(true);
    try {
      await putDeliveryPolicy(delivery);
      queryClient.invalidateQueries("deliveryPolicy");
      alert("배송 정책을 저장했습니다");
    } catch (err) {
      console.error(err);
      alert("배송 정책 저장에 실패했습니다");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{p: 3, display: "flex", flexDirection: "column", gap: 4}}>
      <Box>
        <Typography variant="h6" sx={{mb: 2}}>
          할인 정책
        </Typography>
        {!discount?.id ? (
          <Typography color="text.secondary">등록된 할인 정책이 없습니다</Typography>
        ) : (
          <Box sx={{display: "flex", flexDirection: "column", gap: 1.5, maxWidth: 420}}>
            <TextField
              size="small"
              label="타입 (RATE/AMOUNT)"
              value={discount.type || ""}
              onChange={e => setDiscount({...discount, type: e.target.value})}
            />
            <TextField
              size="small"
              type="number"
              label="값"
              value={discount.value ?? 0}
              onChange={e => setDiscount({...discount, value: Number(e.target.value) || 0})}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={discount.useyn === "Y"}
                  onChange={e => setDiscount({...discount, useyn: e.target.checked ? "Y" : "N"})}
                />
              }
              label={discount.useyn === "Y" ? "사용" : "미사용"}
            />
            <Button variant="contained" onClick={handleSaveDiscount} disabled={saving} sx={{alignSelf: "flex-start"}}>
              할인 정책 저장
            </Button>
          </Box>
        )}
      </Box>

      <Box>
        <Typography variant="h6" sx={{mb: 2}}>
          배송 정책
        </Typography>
        {!delivery?.id ? (
          <Typography color="text.secondary">등록된 배송 정책이 없습니다</Typography>
        ) : (
          <Box sx={{display: "flex", flexDirection: "column", gap: 1.5, maxWidth: 420}}>
            <TextField
              size="small"
              label="택배사"
              value={delivery.company || ""}
              onChange={e => setDelivery({...delivery, company: e.target.value})}
            />
            <TextField
              size="small"
              type="number"
              label="배송비"
              value={delivery.price ?? 0}
              onChange={e => setDelivery({...delivery, price: Number(e.target.value) || 0})}
            />
            <TextField
              size="small"
              type="number"
              label="무료배송 조건금액"
              value={delivery.conditions ?? 0}
              onChange={e => setDelivery({...delivery, conditions: Number(e.target.value) || 0})}
            />
            <TextField
              size="small"
              type="number"
              label="반품 배송비"
              value={delivery.return_price ?? 0}
              onChange={e => setDelivery({...delivery, return_price: Number(e.target.value) || 0})}
            />
            <TextField
              size="small"
              type="number"
              label="교환 배송비"
              value={delivery.change_price ?? 0}
              onChange={e => setDelivery({...delivery, change_price: Number(e.target.value) || 0})}
            />
            <TextField
              size="small"
              label="반품/교환지"
              value={delivery.address || ""}
              onChange={e => setDelivery({...delivery, address: e.target.value})}
            />
            <Button variant="contained" onClick={handleSaveDelivery} disabled={saving} sx={{alignSelf: "flex-start"}}>
              배송 정책 저장
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
