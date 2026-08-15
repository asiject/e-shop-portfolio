import {useState, useEffect} from "react";
import {useRecoilValue} from "recoil";
import {useParams, useNavigate} from "react-router-dom";

import {Box, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";

import {userState} from "@recoils/user/state";
import {useOrderSheetQuery} from "@recoils/order/query";
import {numberFormat} from "@utils/Numaric";
import {OrderLine} from "@utils/Types";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {Styles} from "@styles";
import OrderGeneralInformation from "./OrderGeneralInformation";

export default function OrderSheetList() {
  const {id} = useParams();
  const loginUser = useRecoilValue(userState);
  const [orderSheet, setOrderSheet] = useState<OrderLine[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [deliveryCost, setDeliveryCost] = useState(3000);
  const styles = Styles();
  const navigate = useNavigate();
  const {isLoading, isError, data, error} = useOrderSheetQuery({userid: loginUser?.userid, orderid: id || ""});

  useEffect(() => {
    if (loginUser) {
      if (data) {
        const products = data?.products;
        if (products?.length > 0) {
          setOrderSheet(
            products?.map((product: any) => {
              return {
                productid: product.productid,
                title: product.product.title,
                thumbnail: product.product.thumbnail,
                option: product.option,
                count: product.count,
                cost: product.cost,
              };
            }),
          );
          setTotalCost(
            products?.map((product: any) => product.count * product.cost).reduce((prevCost: number, nextCost: number) => prevCost + nextCost),
          );
        }
      }
    } else {
      navigate("/login");
    }
  }, [data, loginUser, navigate]);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }

  return (
    <Box sx={styles.orderWrapper}>
      <Box sx={styles.container}>
        <Box sx={styles.orderBox}>
          <Box sx={styles.orderTitle}>주문/결제</Box>
          <Table sx={styles.mt20}>
            <TableHead>
              <TableRow sx={styles.orderTableHeader}>
                <TableCell sx={styles.w550c}>상품정보</TableCell>
                <TableCell sx={styles.w100c}>옵션</TableCell>
                <TableCell sx={styles.w50c}>수량</TableCell>
                <TableCell sx={styles.w50c}>할인</TableCell>
                {/* <TableCell sx={styles.w100c}>상품금액</TableCell> */}
                <TableCell sx={styles.w100c}>총금액</TableCell>
                {/* <TableCell sx={styles.w100c}>배송비</TableCell> */}
              </TableRow>
            </TableHead>
            {orderSheet.map(order => {
              return <OrderedList key={`${order.productid}-${order.option}`} order={order} />;
            })}
          </Table>
        </Box>
        <OrderGeneralInformation deliveryCost={deliveryCost} setDeliveryCost={setDeliveryCost} user={loginUser} totalCost={totalCost} />
      </Box>
    </Box>
  );
}

function OrderedList({order}: {order: any}) {
  const styles = Styles();
  const option = order.option.split("/");
  return (
    <TableBody>
      <TableRow>
        <TableCell sx={{display: "flex"}}>
          <Box>
            <Box component="img" src={order.thumbnail} sx={{width: "100px", marginRight: "16px"}} />
          </Box>
          <Box sx={{display: "flex", alignItems: "center"}}>{order.title}</Box>
        </TableCell>
        <TableCell sx={styles.font12}>
          {option &&
            option.map((op: any) => {
              return <Box key={op}>{op}</Box>;
            })}
        </TableCell>
        <TableCell>
          <Box sx={{textAlign: "center"}}>{order.count}개</Box>
        </TableCell>
        <TableCell sx={styles.textCenter}>
          <Box sx={styles.orderSheetDiscount}>(-){numberFormat(0)}</Box>
        </TableCell>
        <TableCell sx={styles.textCenter}>
          <Box>{numberFormat(order.cost * order.count)}</Box>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
