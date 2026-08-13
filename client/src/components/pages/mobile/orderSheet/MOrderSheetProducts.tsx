import {Box} from "@mui/material";
import {numberFormat} from "@utils/Numaric";
import {MStyles} from "@styles";

export default function MOrderSheetProducts({orderSheet, totalCost}: {orderSheet: any[]; totalCost: number}) {
  return (
    <Box sx={MStyles.orderSheet}>
      <Box component={"h1"}>주문/결제</Box>
      <Box component={"ul"}>
        {orderSheet &&
          orderSheet.map(order => {
            return <OrderedList key={`${order.productid}-${order.option}`} order={order} />;
          })}
        <Box sx={MStyles.orderProductsCost}>
          <Box>
            <Box>총 합계 금액</Box>
            <Box sx={MStyles.font20}>{numberFormat(totalCost)}</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function OrderedList({order}: any) {
  const option = order.option.replaceAll(":", ": ").split("/");
  return (
    <Box component={"li"} sx={MStyles.w100per}>
      <Box sx={MStyles.orderLeft}>
        <Box component={"img"} src={order.thumbnail} />
      </Box>
      <Box sx={MStyles.orderRight}>
        <Box component={"h2"}>{order.title}</Box>
        <Box component={"ul"}>
          <Box component={"li"}>상품가 : {numberFormat(order.cost * order.count)}</Box>
          <Box component={"li"}>수량 : {order.count}개</Box>
          <Box component={"ul"}>
            <Box component={"li"}>
              옵션 : {option[0]}, {option[1]}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
