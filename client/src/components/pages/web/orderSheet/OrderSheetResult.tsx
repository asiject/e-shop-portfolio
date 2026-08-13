import React, {useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {useParams, useNavigate} from "react-router-dom";

import {Box} from "@mui/material";

import {userState} from "@recoils/user/state";
import {useOrderSheetResultQuery} from "@recoils/order/query";
import {numberFormat} from "@utils/Numaric";
import {Styles} from "@styles";
export default function OrderSheetResult() {
  const {id} = useParams();
  // TODO: pay일 경우 query로 간사이름(장부명), 간사번호(장부번호) 받아와야함
  // const [] = useRecoilState()
  const [productList, setProductList] = useState([]);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
  const loginUser = useRecoilValue(userState);
  const {isLoading, isError, data, error} = useOrderSheetResultQuery({userid: loginUser?.userid, orderid: id || ""});
  const styles = Styles();
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
    const result = data;
    const {products, payment, buyer, delivery} = result;
    console.log("result : ", products, payment, buyer, delivery);
    setProductList(products);
    setResult(result);
    // TODO: THINKING POINT => STATUS 가 TEMP 가 아닌 것(결제 대기, 결제 완료, 혹은 그 이후 스탭)이면 orderSheetList? Query로 받아와도 되지 않을까? 쿼리 결과 확인하고 원하는 결과물이 나오면 해당 결과물 가져오기
  };

  return (
    <Box sx={styles.orderWrapper}>
      <Box sx={styles.container}>
        <Box sx={styles.orderBox}>
          <Box sx={{textAlign: "center"}}>
            <Box component={"h1"}>주문 완료</Box>
            <Box>
              주문이 완료되었습니다.
              <br />
              귀하의 주문 확인 번호는 1234-5678입니다.
              <br />
            </Box>
          </Box>
          <Box>
            <Box>
              <Box sx={styles.orderTitle}>주문상품</Box>
              <Box sx={styles.orderSheetResultProductGridLayout}>
                <Box>
                  <Box>상품명</Box>
                  <Box>옵션</Box>
                  <Box>수량</Box>
                  <Box>가격</Box>
                </Box>
                {productList.map(product => {
                  return <Product key={`${product.productid}-${product.itemid}`} product={product} />;
                })}
              </Box>
              <Box sx={{textAlign: "right", marginTop: "20px"}}>
                {`상품 가격 ${result ? numberFormat(data.payment?.price) : ""} + 배송비 ${result && numberFormat(data.payment?.charge)} = `}
                <Box component={"span"} sx={{fontWeight: "bold", fontSize: "28px"}}>
                  {`${result && numberFormat(data.payment?.total)}`}
                </Box>
              </Box>
              <Box>
                <Box sx={styles.orderTitle}>결제 정보</Box>
                <Box sx={styles.orderSheetResultInfoGridLayout}>
                  <Box>
                    <Box>결제 방법</Box>
                    <Box>{data && data.payment?.type == "pay" ? `페이공제 : 간사번호(간사이름)` : "계좌 이체 : 카카오뱅크 3333-1234456789"}</Box>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Box sx={styles.orderTitle}>주문자 정보</Box>
                <Box sx={styles.orderSheetResultInfoGridLayout}>
                  <Box>
                    <Box>이름</Box>
                    <Box>{data && data.buyer?.buyername}</Box>
                  </Box>
                  <Box>
                    <Box>E-mail</Box>
                    <Box>{data && data.buyer?.email}</Box>
                  </Box>
                  <Box>
                    <Box>연락처</Box>
                    <Box>{data && data.buyer?.phone}</Box>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Box sx={styles.orderTitle}>배송지 정보</Box>
                <Box sx={styles.orderSheetResultInfoGridLayout}>
                  <Box>
                    <Box>이름</Box>
                    <Box>{data && data.delivery?.receiver}</Box>
                  </Box>
                  <Box>
                    <Box>연락처</Box>
                    <Box>{data && data.delivery?.phone}</Box>
                  </Box>
                  <Box>
                    <Box>주소</Box>
                    {data.delivery && <Box>{`(${data.delivery?.postcode}) ${data.delivery?.address1} ${data.delivery?.address2}`}</Box>}
                    {!data.delivery && <Box></Box>}
                  </Box>
                  <Box>
                    <Box>배송 메시지</Box>
                    <Box>{data && data.delivery?.description}</Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Product({product}: any) {
  return (
    <Box>
      <Box sx={{justifyContent: "flex-start !important"}}>
        <Box component={"img"} src={product.product.thumbnail} sx={{width: "80px", margin: "0 20px"}} />
        <Box>{product.product.title}</Box>
      </Box>
      <Box>{product.option ? product.option : "없음"}</Box>
      <Box>{product.count}개</Box>
      <Box>{numberFormat(product.count * product.cost)}</Box>
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
