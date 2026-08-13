import React, {useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";

import {Box, Button} from "@mui/material";

import {userState} from "@recoils/user/state";
import {getOrderDetailQuery} from "@recoils/order/query";
import {execute} from "@utils/Executor";
import dateFormat from "@utils/DateFormat";
import statusCheck from "@utils/StatusCheck";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {Styles} from "@styles";
import {numberFormat} from "@utils/Numaric";

const primaryColor = "#9ac66d";

export default function OrderDetails() {
  const {id} = useParams();
  const user = useRecoilValue(userState);
  const [detailInfo, setDetailInfo]: any = useState();
  const [detailList, setDetailList] = useState<Array<any>>();
  const loginUser = user;
  const navigate = useNavigate();
  const styles = Styles();

  const {isLoading, isError, data, error} = getOrderDetailQuery({userid: loginUser?.userid, orderid: id || ""});
  console.log("data >", data);
  useEffect(() => {
    setDetailInfo(data);
    const products = data?.products;
    if (products?.length > 0) {
      setDetailList(
        products?.map((item: any) => ({
          updatedate: dateFormat(data.updatedate),
          status: statusCheck(data.status),
          title: item.product.title,
          productid: item.productid,
          thumbnail: item.product.thumbnail,
          itemid: item.itemid,
          option: item.option ? item.option : "",
          cost: item.cost,
          count: item.count,
        })),
      );
    }
  }, [data]);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  const handleRepurchase = async (params: any) => {
    await execute(async () => {
      params = Object.assign(params, {userid: loginUser.userid});
      const {data} = await axios.post(`/api/v1/user/${user.userid}/order/`, params);
      console.log("result :", data);
      navigate(`/order/sheet/${data.orderid}`);
    });
  };

  return (
    <Box sx={styles.container}>
      <Box sx={{width: 880, margin: "0 auto", marginTop: "40px", marginBottom: "40px"}}>
        <Box sx={{fontWeight: "bold", fontSize: "18px"}}>주문상세정보</Box>
        <Box
          sx={{
            display: "flex",
            border: "1px solid #ccc",
            padding: "4px 4px 3px 4px",
            margin: "10px 0",
            borderRadius: "5px",
          }}>
          <Box sx={{fontSize: "16px", display: "flex", margin: "0 10px", alignItems: "center"}}>
            <Box sx={{fontWeight: "bold"}}>주문일자</Box>
            <Box sx={{marginLeft: "10px"}}>{detailInfo && dateFormat(detailInfo.updatedate)}</Box>
          </Box>
          <Box sx={{fontSize: "16px", display: "flex", margin: "0 10px", alignItems: "center"}}>
            <Box sx={{fontWeight: "bold"}}>주문번호</Box>
            <Box sx={{marginLeft: "10px"}}>{detailInfo?.orderid}</Box>
          </Box>
          <Box sx={{fontSize: "16px", display: "flex"}}>
            <Button
              variant="outlined"
              size="small"
              sx={{color: "#AAA"}}
              onClick={() => {
                handleRepurchase(detailList);
              }}>
              재구매
            </Button>
          </Box>
        </Box>
        {detailList &&
          detailList.map((item: any, index: number) => {
            return <DetailList key={index} item={item} userid={loginUser.userid} />;
          })}

        <Box sx={{margin: "25px 0 9px"}}>주문 정보</Box>
        <Box sx={{display: "flex", borderTop: "1px solid black", borderBottom: "1px solid #ccc"}}>
          <Box>
            <Box sx={{display: "flex"}}>
              <Box sx={{width: "100px", backgroundColor: "#eee", padding: "10px 0 0 10px"}}>상품금액</Box>
              <Box sx={{padding: "10px"}}>{detailInfo && numberFormat(detailInfo.payment?.price)}</Box>
            </Box>
            <Box sx={{display: "flex"}}>
              <Box sx={{width: "100px", backgroundColor: "#eee", padding: "10px 0 0 10px"}}>배송비</Box>
              <Box sx={{padding: "10px"}}>{detailInfo && numberFormat(detailInfo.payment?.charge)}</Box>
            </Box>
            <Box sx={{display: "flex"}}>
              <Box sx={{width: "100px", backgroundColor: "#eee", padding: "10px 0 0 10px"}}>할인</Box>
              {/* TODO: 할인 들어가면 수정해야함 */}
              <Box sx={{padding: "10px"}}>{detailInfo ? "0원" : "0원"}</Box>
            </Box>
          </Box>
          <Box sx={{marginLeft: "auto"}}>
            <Box
              sx={{
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                height: "calc(100% - 10px)",
                width: "200px",
                padding: "10px 10px 0 10px",
                display: "flex",
              }}>
              <Box>주문금액</Box>
              <Box sx={{marginLeft: "auto", fontWeight: "bold"}}>{detailInfo && numberFormat(detailInfo.payment?.total)}</Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{margin: "25px 0 9px"}}>수신자 정보</Box>
        <Box sx={{display: "flex", borderTop: "1px solid black", borderBottom: "1px solid #ccc"}}>
          <Box
            sx={{
              width: "400px",
              ".header": {
                width: "100px",
                backgroundColor: "#eee",
                padding: "10px 0 0 10px",
              },
            }}>
            <Box sx={{display: "flex"}}>
              <Box className="header">받는사람</Box>
              <Box sx={{padding: "10px"}}>{detailInfo && detailInfo.delivery?.receiver}</Box>
            </Box>
            <Box sx={{display: "flex"}}>
              <Box className="header">휴대폰</Box>
              <Box sx={{padding: "10px"}}>{detailInfo && detailInfo.delivery?.phone}</Box>
            </Box>
            <Box sx={{display: "flex"}}>
              <Box className="header">기타메모</Box>
              <Box sx={{padding: "10px"}}>{detailInfo && detailInfo.delivery?.description}</Box>
            </Box>
          </Box>
          <Box sx={{marginLeft: "auto", width: "220px"}}>
            <Box sx={{borderBottom: "1px solid #ddd"}}>주문자정보</Box>
            <Box>{detailInfo && detailInfo.buyer?.buyername}</Box>
            <Box>{detailInfo && detailInfo.buyer?.phone}</Box>
            <Box>{detailInfo && detailInfo.buyer?.email}</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function DetailList({item, userid}: {item: any; userid: number}) {
  console.log("item :", item);
  const navigate = useNavigate();

  const handleAddCart = async (params: any) => {
    await execute(async () => {
      console.log("params : ", params);
      const {data} = await axios.post(`/api/v1/cart/`, params);
      // console.log("handleAddCart : ", data);
      if (confirm("장바구니에 상품을 담았습니다.\n장바구니로 이동하시겠습니까?")) {
        navigate("/cart/list");
      }
    });
  };

  return (
    <Box sx={{display: "flex", width: "100%"}}>
      <Box
        sx={{
          backgroundColor: "#ffffff",
          border: "1px solid #e0e0e0",
          padding: "20px",
          borderRadius: "10px 0 0 10px",
          boxShadow: " rgb(0 0 0 / 8%) 0px 2px 4px 0px, rgb(0 0 0 / 16%) 0px 0px 1px 0px",

          width: "618px",
          marginTop: "20px",
        }}>
        <Box component={"span"} sx={{fontWeight: "bold"}}>
          {`${item.status}`}
        </Box>{" "}
        {`${item.updatedate}`}
        <Box sx={{display: "flex", marginTop: "20px"}}>
          <Box sx={{margin: "20px 20px 20px 0"}}>
            <Box component="img" src={item.thumbnail} sx={{width: "100px", height: "100px"}} />
          </Box>
          <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", height: "144px"}}>
            <Box sx={{fontSize: "14px"}}>{`${item.title}${item.option && ", " + item.option}`}</Box>
            <Box sx={{display: "flex", marginTop: "10px"}}>
              <Box>{`${numberFormat(item.cost)} / ${item.count}개`}</Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: "#ffffff",
          border: "1px solid #e0e0e0",
          borderLeft: "0px",
          padding: "20px",
          borderRadius: "0 10px 10px 0",
          width: "179px",
          marginTop: "20px",
          ".btn-box + .btn-box": {
            marginTop: "10px",
          },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>
        <Box className="btn-box">
          <Button
            variant="outlined"
            size="small"
            sx={{width: "100%", height: "38px", color: "#AAA"}}
            onClick={() => {
              const params = {
                userid: userid,
                productid: item.productid,
                pid: item.productid,
                itemid: item.itemid,
                option: item.option,
                cost: item.cost,
                count: item.count,
              };
              handleAddCart(params);
            }}>
            장바구니 담기
          </Button>
        </Box>
        <Box className="btn-box">
          <Button variant="outlined" size="small" sx={{width: "100%", height: "38px", color: "#AAA"}}>
            교환, 반품 신청
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
