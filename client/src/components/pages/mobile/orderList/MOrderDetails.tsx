import {useEffect} from "react";
import {useRecoilValue} from "recoil";
import {useParams, useNavigate} from "react-router-dom";

import {Box, Button} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import {userState} from "@recoils/user/state";
import {useOrderDetailQuery} from "@recoils/order/query";
import statusCheck from "@utils/StatusCheck";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {MStyles} from "@styles";
import {shopProductQnaHref} from "@utils/productQna";
import {
  displayValue,
  formatOrderAddress,
  formatOrderDate,
  formatOrderMoney,
  mapOrderProducts,
  type OrderLineView,
} from "@utils/orderLines";
import NoImage from "components/shop/NoImage";
import {kraft} from "theme/kraft";

const panelSx = {
  backgroundColor: kraft.sticker,
  border: `2px solid ${kraft.ink}`,
  p: "16px",
  mb: 2,
} as const;

const sectionTitleSx = {
  m: "0 0 8px",
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

export default function MOrderDetails() {
  const {id} = useParams();
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const orderid = id || "";
  const {isLoading, isError, data, error} = useOrderDetailQuery({userid: user?.userid, orderid});
  const detailInfo = data;
  const detailList = mapOrderProducts(data);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user || isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }

  const handleBackToList = () => {
    navigate("/m/order/list");
  };

  return (
    <Box sx={MStyles.container}>
      <Box
        component="button"
        type="button"
        onClick={handleBackToList}
        aria-label="주문 내역으로 돌아가기"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.25,
          alignSelf: "flex-start",
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

      <Box component="h1" sx={{...sectionTitleSx, mb: 2}}>
        주문 상세
      </Box>

      {!detailInfo ? (
        <Box sx={{...panelSx, textAlign: "center"}}>
          <Box sx={{color: kraft.mute, fontSize: 14, lineHeight: 1.45, mb: 2}}>주문 정보를 찾을 수 없습니다.</Box>
        </Box>
      ) : (
        <>
      <Box sx={panelSx}>
        <Box sx={labelSx}>주문 정보</Box>
        <InfoRow label="주문일자" value={formatOrderDate(detailInfo?.updatedate ?? detailInfo?.createdate)} />
        <InfoRow label="주문번호" value={displayValue(detailInfo?.orderid)} />
        <InfoRow label="주문자" value={displayValue(detailInfo?.buyer?.buyername)} />
        <InfoRow label="처리상태" value={displayValue(statusCheck(detailInfo?.status ?? ""))} last />
      </Box>

      <Box sx={panelSx}>
        <Box sx={labelSx}>구매 내역</Box>
        {detailList.length === 0 ? (
          <Box sx={{py: 2, textAlign: "center", color: kraft.mute, fontSize: 14, lineHeight: 1.45}}>이 주문에 담긴 상품이 없습니다.</Box>
        ) : (
          detailList.map(item => <ListItem key={`${item.productid}-${item.itemid}`} item={item} orderid={orderid} />)
        )}
        <InfoRow label="상품금액" value={formatOrderMoney(detailInfo?.payment?.price)} />
        <InfoRow label="배송비" value={formatOrderMoney(detailInfo?.payment?.charge)} />
        <InfoRow label="주문금액" value={formatOrderMoney(detailInfo?.payment?.total)} last />
      </Box>

      <Box sx={panelSx}>
        <Box sx={labelSx}>배송지 정보</Box>
        <InfoRow label="받는 분" value={displayValue(detailInfo?.delivery?.receiver)} />
        <InfoRow label="연락처" value={displayValue(detailInfo?.delivery?.phone)} />
        <InfoRow label="주소" value={formatOrderAddress(detailInfo?.delivery)} />
        <InfoRow label="배송 메시지" value={displayValue(detailInfo?.delivery?.description)} last />
      </Box>
        </>
      )}

      <Button type="button" variant="contained" fullWidth onClick={handleBackToList}>
        주문 내역으로
      </Button>
    </Box>
  );
}

function InfoRow({label, value, last}: {label: string; value: string; last?: boolean}) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        py: "10px",
        borderBottom: last ? 0 : `1px solid ${kraft.ink}`,
      }}>
      <Box sx={{width: 88, flexShrink: 0, color: kraft.mute, fontSize: 14}}>{label}</Box>
      <Box sx={{fontSize: 14, fontFamily: kraft.sans, wordBreak: "break-all"}}>{value}</Box>
    </Box>
  );
}

function ListItem({item, orderid}: {item: OrderLineView; orderid: string}) {
  const navigate = useNavigate();
  const optionLabel = item.option ? item.option.replace(/\//g, ", ") : "옵션 없음";

  return (
    <Box sx={{display: "flex", gap: 1, py: 1.5, borderBottom: `1px solid ${kraft.ink}`}}>
      <Box sx={{width: 88, height: 88, flexShrink: 0, backgroundColor: kraft.window, overflow: "hidden"}}>
        {item.thumbnail ? (
          <Box component="img" src={item.thumbnail} alt={item.title} width={88} height={88} sx={{width: "100%", height: "100%", objectFit: "cover", display: "block"}} />
        ) : (
          <NoImage size="thumb" />
        )}
      </Box>
      <Box sx={{minWidth: 0, flex: 1}}>
        <Box sx={{fontWeight: 800, fontSize: 15, lineHeight: 1.3}}>{item.title}</Box>
        <Box sx={{mt: "4px", color: kraft.mute, fontSize: 14}}>{optionLabel}</Box>
        <Box sx={{mt: "4px", fontFamily: kraft.mono, fontVariantNumeric: "tabular-nums", fontSize: 14}}>수량 {item.count}개</Box>
        <Box sx={{fontFamily: kraft.mono, fontVariantNumeric: "tabular-nums", fontSize: 14}}>{formatOrderMoney(item.cost * item.count)}</Box>
        <Box sx={{mt: 1}}>
          <Button
            type="button"
            size="small"
            variant="outlined"
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
    </Box>
  );
}
