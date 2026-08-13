import React, {useEffect, useState} from "react";
import {useRecoilValue} from "recoil";
import {useNavigate} from "react-router-dom";
import axios from "axios";

import {Box, Button, Checkbox, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";

import {Styles} from "@styles";
import {userState} from "@recoils/user/state";
import {getOrderListQuery} from "@recoils/order/query";
import {numberFormat} from "@utils/Numaric";
import {execute} from "@utils/Executor";
import dateFormat from "@utils/DateFormat";
import statusCheck from "@utils/StatusCheck";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {User} from "@utils/Types";

export default function OrderList() {
  const [orderList, setOrderList] = useState<Array<any>>([]);
  const loginUser = useRecoilValue(userState);
  const navigate = useNavigate();
  const styles = Styles();
  const {isLoading, isError, data, error} = getOrderListQuery({userid: loginUser?.userid});

  console.log("data >", data);
  useEffect(() => {
    if (loginUser) {
      setOrderList(data);
    } else {
      navigate("/login");
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }

  return (
    <Box sx={styles.container}>
      <Box sx={{width: 880, margin: "0 auto", marginTop: "40px"}}>
        <Box sx={{fontWeight: "bold", fontSize: "18px"}}>주문목록</Box>
        <Box sx={{display: "flex", alignItems: "center"}}>
          <Box sx={{width: 530, margin: "10px 0"}}>
            <TextField
              sx={{width: "100%"}}
              size="small"
              InputProps={{
                endAdornment: <SearchIcon sx={{cursor: "pointer", color: "#9ac66d"}} />,
              }}
            />
          </Box>
          <Box sx={{display: "flex", marginLeft: "auto", "div + div": {marginLeft: "10px"}}}>
            <Button variant="outlined" sx={{color: "#AAA"}}>
              선택 상품 모아보기
            </Button>
          </Box>
        </Box>
        {orderList?.map((list, index) => {
          return <OrderedList key={index} list={list} />;
        })}
        <Box
          sx={{
            backgroundColor: "#ddd",
            margin: "20px 0",
            padding: "15px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <AddIcon />
          더보기
        </Box>
        {/* <Box
          sx={{ display: "flex", justifyContent: "center", margin: "40px", "button + button": { marginLeft: "10px" } }}
        >
          <Button variant="outlined" sx={{ height: "38px", color: "#AAA" }}>
            이전
          </Button>
          <Button variant="outlined" sx={{ height: "38px", color: "#AAA" }}>
            다음
          </Button>
        </Box> */}
      </Box>
    </Box>
  );
}

function OrderedList({list}: {list: any}) {
  const navigate = useNavigate();
  // 네이버 : 썸네일 이미지, 타이틀, 가격, 구매 날짜, 상태, 안내 메시지, 연락처, 재구매, 리뷰 쓰기(한달 사용 리뷰)
  // 주문 날짜, 처리 날짜, 썸네일 이미지, 타이틀, 옵션, 가격, 갯수 // 장바구니 담기, 교환&반품 신청
  const status = statusCheck(list.status);
  const handleAllAddCart = async (params: any) => {
    await execute(async () => {
      await params.map((item: any) => axios.post(`/api/v1/cart/`, item));
      if (confirm("장바구니에 상품을 모두 담았습니다.\n장바구니로 이동하시겠습니까?")) {
        navigate("/cart/list");
      }
    });
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        border: "1px solid #e0e0e0",
        padding: "20px",
        borderRadius: "10px",
        margin: "20px 0",
        boxShadow: " rgb(0 0 0 / 8%) 0px 2px 4px 0px, rgb(0 0 0 / 16%) 0px 0px 1px 0px",
      }}>
      <Box sx={{display: "flex"}}>
        <Box sx={{fontSize: "18px", fontWeight: "bold", display: "flex", alignItems: "center"}}>
          <Box sx={{".MuiCheckbox-root": {margin: 0, padding: 0}}}>
            <Checkbox></Checkbox>
          </Box>
          <Box sx={{display: "flex", alignItems: "center", marginLeft: "5px"}}>{dateFormat(list.createdate)} 주문</Box>
        </Box>
        <Box sx={{marginLeft: "auto", display: "flex", alignItems: "center", cursor: "pointer"}} onClick={() => navigate(`/order/${list.orderid}`)}>
          주문상세보기
          <ChevronRightIcon />
        </Box>
      </Box>
      <Box sx={{display: "flex"}}>
        <Box
          sx={{
            backgroundColor: "#ffffff",
            border: "1px solid #e0e0e0",
            padding: "20px",
            borderRadius: "10px 0 0 10px",
            width: "630px",
            marginTop: "20px",
          }}>
          {dateFormat(list.updatedate)}{" "}
          <Box component={"span"} sx={{fontWeight: "bold"}}>
            {status}
          </Box>
          {list &&
            list.products.map((item: any, index: number) => {
              return <ListItem key={index} item={item} />;
            })}
        </Box>
        <Box
          sx={{
            backgroundColor: "#ffffff",
            border: "1px solid #e0e0e0",
            borderLeft: "0px",
            padding: "20px",
            borderRadius: "0 10px 10px 0",
            width: "208px",
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
                const params = list.products.map((item: any) => {
                  return {
                    userid: list.userid,
                    productid: item.productid,
                    pid: item.productid,
                    itemid: item.itemid,
                    option: item.option,
                    count: item.count,
                    cost: item.cost,
                  };
                });
                handleAllAddCart(params);
              }}>
              장바구니 담기
            </Button>
          </Box>
          <Box className="btn-box">
            <Button
              variant="outlined"
              size="small"
              sx={{width: "100%", height: "38px", color: "#AAA"}}
              onClick={() => {
                console.log("교환 반품 신청");
              }}>
              {/* TODO: 교환 반품 신청 */}
              교환, 반품 신청
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function ListItem({item}: {item: any}) {
  console.log("item >", item);
  return (
    <Box sx={{display: "flex", marginTop: "20px"}}>
      <Box sx={{margin: "20px 20px 20px 0"}}>
        <Box component="img" src={item.product.thumbnail} sx={{width: "100px", height: "100px"}} />
      </Box>
      <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", height: "144px"}}>
        <Box sx={{fontSize: "14px"}}>{`${item.product.title}${item.option && ", " + item.option}`}</Box>
        <Box sx={{display: "flex", marginTop: "10px"}}>
          <Box sx={{fontSize: "14px"}}>{`${numberFormat(item.cost)} / ${item.count}개`}</Box>
        </Box>
      </Box>
    </Box>
  );
}
