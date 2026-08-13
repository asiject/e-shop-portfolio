import React, {useEffect, useRef, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {useParams, useNavigate} from "react-router-dom";

import {Box, Button, Table, TableBody, TableCell, TableRow} from "@mui/material";

import {userState} from "@recoils/user/state";
import {useOrderSheetResultQuery} from "@recoils/order/query";
import {numberFormat} from "@utils/Numaric";
import {MStyles} from "@styles";

export default function MOrderSheetResult() {
  const {id} = useParams();
  // TODO: pay일 경우 query로 간사이름(장부명), 간사번호(장부번호) 받아와야함
  // const [] = useRecoilState()
  const [productList, setProductList] = useState([]);
  const resultRef = useRef<any>(null);
  const navigate = useNavigate();
  const loginUser = useRecoilValue(userState);
  const {isLoading, isError, data, error} = useOrderSheetResultQuery({userid: loginUser?.userid, orderid: id || ""});

  useEffect(() => {
    if (loginUser) {
      if (data) {
        orderSheetResultFunc(data);
      }
    } else {
      navigate("/login");
    }
  }, [data, loginUser, navigate]);
  const orderSheetResultFunc = async (data: any) => {
    const params = {userid: loginUser.userid, orderid: id};
    // console.log("orderSheet Result : ", result);
    const {products, payment, buyer, delivery} = data;
    console.log("result : ", products, payment, buyer, delivery);
    setProductList(products);
    resultRef.current = data;
    // TODO: THINKING POINT => STATUS 가 TEMP 가 아닌 것(결제 대기, 결제 완료, 혹은 그 이후 스탭)이면 orderSheetList? Query로 받아와도 되지 않을까? 쿼리 결과 확인하고 원하는 결과물이 나오면 해당 결과물 가져오기
  };

  return (
    <Box sx={MStyles.container}>
      <Box sx={MStyles.orderSheet}>
        <Box component={"h1"}>주문 완료</Box>
        {/*  */}
        <Box sx={MStyles.MOrderResultGuide}>
          <Box sx={MStyles.w100perC}>
            <Box>{loginUser && loginUser.username}님의 주문이 완료되었습니다.</Box>
            {/* <Box>
              귀하의 주문 확인 번호는 <strong>1234-5678</strong>입니다.
            </Box> */}
            <Box>입금 방법이 계좌이체인 경우 계좌 번호를 메모하세요.</Box>
            <Box>입금 확인 후 상품을 준비하여 배송됩니다.</Box>
            {/* <Box>입금 확인 후 상품을 준비하여 배송해드리곘습니다.</Box> */}
          </Box>
        </Box>
        {/*  */}
        <Box sx={MStyles.MOrderResultBox}>
          <Box>주문내역</Box>
          {productList &&
            productList.map(item => {
              return <ListItem key={`${item.productid}-${item.itemid}`} item={item} />;
            })}
        </Box>
        {/*  */}
        <Box sx={MStyles.MOrderResultBox}>
          <Box>결제정보</Box>
          <Table sx={MStyles.deliveryBox}>
            <TableBody>
              <TableRow>
                <TableCell sx={MStyles.leftCellSize}>결제방식</TableCell>
                <TableCell>
                  {data && data?.payment?.type == "pay"
                    ? //TODO: order_delivery에 간사명(ex : payname) 간사번호(ex: paynumber) 추가하고 아래 주석된 부분 풀고 수정하면 됨.
                      // ? `[페이공제]\n 간사 이름(장부 이름) : ${result.payment.payname} 간사 번호(장부 번호) : ${result.payment.paynumber}`
                      `[페이공제]\n 간사 이름(장부 이름) : 간사 번호(간사 번호) : `
                    : "[계좌 이체]\n카카오뱅크 3333-1234456789"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>금액</TableCell>
                <TableCell>{numberFormat(data?.payment?.total)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
        {/*  */}
        <Box sx={MStyles.MOrderResultBox}>
          <Box>배송정보</Box>
          <Table sx={MStyles.deliveryBox}>
            <TableBody>
              <TableRow>
                <TableCell sx={MStyles.leftCellSize}>보내는 사람</TableCell>
                <TableCell>{data && data?.buyer?.buyername}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>연락처</TableCell>
                <TableCell>{(data && data?.buyer?.phone) || "등록된 번호가 없습니다"}</TableCell>
              </TableRow>
              <TableRow sx={MStyles.MOrderResultDivisionLine}>
                <TableCell>받는 사람</TableCell>
                <TableCell>{data && data?.delivery?.receiver}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>연락처</TableCell>
                <TableCell>{data && data?.delivery?.phone}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>이메일</TableCell>
                <TableCell>{data && data?.delivery?.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>배송 주소</TableCell>
                <TableCell>{data && `(${data?.delivery?.postcode}) ${data?.delivery?.address1} ${data?.delivery?.address2}`}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>배송 메시지</TableCell>
                <TableCell>{data && data?.delivery?.description}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Box>
      <Box sx={MStyles.w100per}>
        <Button sx={MStyles.MOrderResultLastButton} variant={"contained"} onClick={() => navigate("/m/order/list")}>
          주문 내역 확인하기
        </Button>
      </Box>
    </Box>
  );
}

function ListItem({item}: any) {
  // console.log("item >> ", item);
  const {product, count} = item;
  let option;
  if (item.option.indexOf("/")) {
    option = item.option.split("/");
  } else {
    option = item.option;
  }

  return (
    <Box sx={MStyles.MOrderResultListItem}>
      <Box sx={MStyles.MOrderResultListItemTitle}>
        <Box sx={MStyles.bold}>{product.title}</Box>
        <Box>수량 : {count}개</Box>
      </Box>
      <Box sx={MStyles.MOrderResultListItemOption}>
        <Box>[옵션]</Box>
        <Box>{option.length > 1 ? option[0] + ", " + option[1] : option}</Box>
      </Box>
    </Box>
  );
}

// function SamplePost({open, setOpen}) {
//   const handleComplete = data => {
//     let fullAddress = data.address;
//     let extraAddress = "";

//     if (data.addressType === "R") {
//       if (data.bname !== "") {
//         extraAddress += data.bname;
//       }
//       if (data.buildingName !== "") {
//         extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
//       }
//       fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
//     }

//     console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
//     setOpen(false);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };
//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description"
//       sx={{".MuiPaper-root": {width: "400px"}}}>
//       <DaumPostcode onComplete={handleComplete} />
//     </Dialog>
//   );
// }
