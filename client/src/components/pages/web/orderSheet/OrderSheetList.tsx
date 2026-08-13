import {useState, useEffect} from "react";
import {useRecoilValue} from "recoil";
import {useParams, useNavigate} from "react-router-dom";

import {Box, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";

import {userState} from "@recoils/user/state";
import {useOrderSheetQuery} from "@recoils/order/query";
import {numberFormat} from "@utils/Numaric";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {Styles} from "@styles";
import OrderGeneralInformation from "./OrderGeneralInformation";

export default function OrderSheetList() {
  const {id} = useParams();
  const loginUser = useRecoilValue(userState);
  const [orderSheet, setOrderSheet] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [deliveryCost, setDeliveryCost] = useState(3000);
  const styles = Styles();
  const navigate = useNavigate();
  const {isLoading, isError, data, error} = useOrderSheetQuery({userid: loginUser?.userid, orderid: id || ""});

  console.log("data >", data);
  useEffect(() => {
    //FIXME: [SHOP-17] 비회원과 회원에 대한 방법
    if (loginUser) {
      if (data) {
        const products = data?.products;
        console.log("products >", products);
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

  // TODO: 직접수령 클릭하면 배송지 주소 대신 수령 주소로 변경
  // TODO: 직접수령하면 수령 예정일을 적는 게 나을까?

  // TODO: 기본 배송지가 없을 때 기본 배송지 설정 ~ 처음 기본 배송지 설정 => DB에서 기본 배송지를 어떻게 구분할까?
  // 1) 기본 배송지가 없을 때 -> 현재 등록하는 주소가 기본 배송지로 설정
  // 2) 신규 배송지로 설정하면 -> 신규 배송지 정보 등록
  // TODO: 목록 중에 기본 배송지 설정하기

  // TODO: 입력 정보 required 처리 받기 (axios.post / param)
  // [필수 체크] 수령인, 전화번호, 우편 번호, 배송지 기본 주소(주소1), 배송지 상세 주소(주소2)
  // 배송 메모(선택)

  // TODO:  페이공제 require => 계좌입금을 누르면 페이공제 require 비활성화 |결제수단 1. 페이공제 -> 이름, 간사번호 /  2. 계좌 입금 (배송비 포함 금액)

  // TODO:결제 수단 누르는 것에 따라 article 활성화 => UI도 신경써야함
  // 배송비 활성화 / 비활성화
  // 페이공제 정보 입력창 활성화 / 비활성화

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
