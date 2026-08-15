import {useEffect} from "react";
import {useRecoilValue} from "recoil";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";

import {Box, Button} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import {userState} from "@recoils/user/state";
import {useOrderDetailQuery} from "@recoils/order/query";
import {execute} from "@utils/Executor";
import statusCheck from "@utils/StatusCheck";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {Styles} from "@styles";
import {shopProductQnaHref} from "@utils/productQna";
import {
  displayValue,
  formatOrderAddress,
  formatOrderDate,
  formatOrderMoney,
  mapOrderProducts,
  toRepurchaseProducts,
  type OrderLineView,
} from "@utils/orderLines";
import NoImage from "components/shop/NoImage";
import {kraft} from "theme/kraft";

const panelSx = {
  backgroundColor: kraft.sticker,
  border: `2px solid ${kraft.ink}`,
  p: "28px 24px",
} as const;

const sectionTitleSx = {
  mt: "28px",
  mb: "8px",
  fontFamily: kraft.display,
  fontSize: 22,
  fontWeight: 700,
  letterSpacing: "-0.03em",
} as const;

const labelSx = {
  fontFamily: kraft.mono,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.08em",
  color: kraft.mute,
} as const;

const moneySx = {
  fontFamily: kraft.mono,
  fontVariantNumeric: "tabular-nums",
} as const;

export default function OrderDetails() {
  const {id} = useParams();
  const loginUser = useRecoilValue(userState);
  const navigate = useNavigate();
  const styles = Styles();
  const orderid = id || "";

  const {isLoading, isError, data, error} = useOrderDetailQuery({userid: loginUser?.userid, orderid});
  const detailInfo = data;
  const detailList = mapOrderProducts(data);

  useEffect(() => {
    if (!loginUser) navigate("/login");
  }, [loginUser, navigate]);

  if (!loginUser || isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }

  const handleRepurchase = async () => {
    const products = toRepurchaseProducts(detailList);
    if (!products.length) {
      alert("재구매할 상품이 없습니다");
      return;
    }
    await execute(async () => {
      const {data: created} = await axios.post(`/api/v1/user/${loginUser.userid}/order/`, {status: "TEMP", products});
      if (!created?.orderid) {
        alert("주문을 만들지 못했습니다");
        return;
      }
      navigate(`/order/sheet/${created.orderid}`);
    });
  };

  const handleBackToList = () => {
    navigate("/order/list");
  };

  return (
    <Box sx={styles.orderWrapper}>
      <Box sx={styles.container}>
        <Box sx={{width: "100%", maxWidth: 880, mx: "auto", my: "40px"}}>
          <Box
            component="button"
            type="button"
            onClick={handleBackToList}
            aria-label="주문 내역으로 돌아가기"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.25,
              mb: 1.5,
              ml: "-6px",
              padding: "4px 8px 4px 2px",
              background: "none",
              border: 0,
              cursor: "pointer",
              color: kraft.ink,
              fontFamily: kraft.display,
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: "0.04em",
              "&:hover": {backgroundColor: "rgba(26, 18, 11, 0.08)"},
            }}>
            <ChevronLeftIcon sx={{fontSize: 22}} aria-hidden="true" />
            주문 내역
          </Box>

          <Box
            component="h1"
            sx={{
              m: 0,
              fontFamily: kraft.display,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}>
            주문 상세
          </Box>

          {!detailInfo ? (
            <Box sx={{...panelSx, mt: 2, textAlign: "center"}}>
              <Box sx={{color: kraft.mute, fontSize: 14, lineHeight: 1.45, mb: 2}}>주문 정보를 찾을 수 없습니다.</Box>
              <Button type="button" variant="contained" onClick={handleBackToList}>
                주문 내역으로
              </Button>
            </Box>
          ) : (
            <>
          <Box sx={{...panelSx, mt: 2, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px 28px"}}>
            <MetaField label="주문일자" value={formatOrderDate(detailInfo?.updatedate ?? detailInfo?.createdate)} />
            <MetaField label="주문번호" value={displayValue(detailInfo?.orderid)} mono />
            <MetaField label="처리상태" value={displayValue(statusCheck(detailInfo?.status ?? ""))} />
            <Box sx={{ml: "auto"}}>
              <Button type="button" variant="outlined" size="small" onClick={handleRepurchase} disabled={!detailList.length}>
                재구매
              </Button>
            </Box>
          </Box>

          <Box sx={sectionTitleSx}>구매 내역</Box>
          {detailList.length === 0 ? (
            <Box sx={{...panelSx, textAlign: "center"}}>
              <Box sx={{color: kraft.mute, fontSize: 14, lineHeight: 1.45, mb: 2}}>이 주문에 담긴 상품이 없습니다.</Box>
              <Button type="button" variant="contained" onClick={handleBackToList}>
                주문 내역으로
              </Button>
            </Box>
          ) : (
            detailList.map(item => (
              <DetailList key={`${item.productid}-${item.itemid}`} item={item} userid={String(loginUser.userid)} orderid={orderid} />
            ))
          )}

          <Box sx={sectionTitleSx}>주문 정보</Box>
          <Box sx={{...panelSx, display: "flex", gap: 2, flexWrap: "wrap"}}>
            <Box sx={{flex: 1, minWidth: 220}}>
              <InfoRow label="상품금액" value={formatOrderMoney(detailInfo?.payment?.price)} mono />
              <InfoRow label="배송비" value={formatOrderMoney(detailInfo?.payment?.charge)} mono />
              <InfoRow label="할인" value={detailInfo?.payment ? formatOrderMoney(0) : "—"} mono />
            </Box>
            <Box
              sx={{
                minWidth: 200,
                backgroundColor: kraft.ink,
                color: kraft.sticker,
                p: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}>
              <Box sx={{fontWeight: 800, fontSize: 15}}>주문금액</Box>
              <Box sx={{...moneySx, fontWeight: 700}}>{formatOrderMoney(detailInfo?.payment?.total)}</Box>
            </Box>
          </Box>

          <Box sx={sectionTitleSx}>배송 · 주문자</Box>
          <Box sx={{...panelSx, display: "flex", gap: "28px", flexWrap: "wrap"}}>
            <Box sx={{flex: 1, minWidth: 240}}>
              <Box sx={{...labelSx, mb: 1}}>수신자</Box>
              <InfoRow label="받는사람" value={displayValue(detailInfo?.delivery?.receiver)} />
              <InfoRow label="휴대폰" value={displayValue(detailInfo?.delivery?.phone)} />
              <InfoRow label="주소" value={formatOrderAddress(detailInfo?.delivery)} />
              <InfoRow label="기타메모" value={displayValue(detailInfo?.delivery?.description)} />
            </Box>
            <Box sx={{width: 240, borderLeft: {sm: `1px solid ${kraft.ink}`}, pl: {sm: "28px"}}}>
              <Box sx={{...labelSx, mb: 1}}>주문자</Box>
              <Box sx={{fontSize: 14, lineHeight: 1.6}}>{displayValue(detailInfo?.buyer?.buyername)}</Box>
              <Box sx={{fontSize: 14, lineHeight: 1.6}}>{displayValue(detailInfo?.buyer?.phone)}</Box>
              <Box sx={{fontSize: 14, lineHeight: 1.6, wordBreak: "break-all"}}>{displayValue(detailInfo?.buyer?.email)}</Box>
            </Box>
          </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function MetaField({label, value, mono}: {label: string; value: string; mono?: boolean}) {
  return (
    <Box>
      <Box sx={labelSx}>{label}</Box>
      <Box sx={{mt: "4px", fontSize: 14, fontFamily: mono ? kraft.mono : kraft.sans, fontVariantNumeric: mono ? "tabular-nums" : undefined}}>
        {value}
      </Box>
    </Box>
  );
}

function InfoRow({label, value, mono}: {label: string; value: string; mono?: boolean}) {
  return (
    <Box sx={{display: "flex", gap: 2, py: "8px", borderBottom: `1px solid ${kraft.ink}`}}>
      <Box sx={{width: 88, flexShrink: 0, color: kraft.mute, fontSize: 14}}>{label}</Box>
      <Box sx={{fontSize: 14, fontFamily: mono ? kraft.mono : kraft.sans, fontVariantNumeric: mono ? "tabular-nums" : undefined}}>{value}</Box>
    </Box>
  );
}

function DetailList({item, userid, orderid}: {item: OrderLineView; userid: string; orderid: string}) {
  const navigate = useNavigate();

  const handleAddCart = async () => {
    if (!item.productid) {
      alert("상품 정보를 찾을 수 없습니다");
      return;
    }
    await execute(async () => {
      await axios.post(`/api/v1/cart/`, {
        userid,
        productid: item.productid,
        pid: item.productid,
        itemid: item.itemid,
        option: item.option,
        cost: item.cost,
        count: item.count,
      });
      if (confirm("장바구니에 상품을 담았습니다.\n장바구니로 이동하시겠습니까?")) {
        navigate("/cart/list");
      }
    });
  };

  return (
    <Box sx={{...panelSx, display: "flex", gap: 2, mt: 2, p: "16px 24px"}}>
      <Box sx={{width: 100, height: 100, flexShrink: 0, backgroundColor: kraft.window, overflow: "hidden"}}>
        {item.thumbnail ? (
          <Box component="img" src={item.thumbnail} alt={item.title} width={100} height={100} sx={{width: "100%", height: "100%", objectFit: "cover", display: "block"}} />
        ) : (
          <NoImage size="thumb" />
        )}
      </Box>
      <Box sx={{flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center"}}>
        <Box sx={{fontFamily: kraft.mono, fontSize: 11, letterSpacing: "0.08em", color: kraft.mute}}>
          {item.status} · {item.updatedate}
        </Box>
        <Box sx={{mt: "8px", fontWeight: 800, fontSize: 15, lineHeight: 1.3}}>{item.title}</Box>
        <Box sx={{mt: "4px", color: kraft.mute, fontSize: 14}}>{displayValue(item.option, "옵션 없음")}</Box>
        <Box sx={{mt: "8px", ...moneySx, fontSize: 14}}>
          {formatOrderMoney(item.cost)} / {item.count}개
        </Box>
      </Box>
      <Box sx={{width: 160, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 1}}>
        <Button type="button" variant="outlined" size="small" onClick={handleAddCart}>
          장바구니 담기
        </Button>
        <Button
          type="button"
          variant="outlined"
          size="small"
          onClick={() => {
            if (!item.productid) {
              alert("상품 정보를 찾을 수 없습니다");
              return;
            }
            navigate(shopProductQnaHref(item.productid, {kind: "return", orderid}));
          }}>
          교환, 반품 문의
        </Button>
      </Box>
    </Box>
  );
}
