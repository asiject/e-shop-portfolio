import {useEffect, useState} from "react";
import {useRecoilValue} from "recoil";
import {useNavigate} from "react-router-dom";

import {Box, Button, Checkbox, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";

import {userState} from "@recoils/user/state";
import {useOrderListQuery} from "@recoils/order/query";
import {numberFormat} from "@utils/Numaric";
import {execute} from "@utils/Executor";
import dateFormat from "@utils/DateFormat";
import statusCheck from "@utils/StatusCheck";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {MStyles} from "@styles";
import {OrderListRow} from "@utils/Types";

export default function MOrderList() {
  // const [useOrderListQuery, setOrderListQuery] = useRecoilState(orderListQuery);
  const [orderList, setOrderList] = useState<OrderListRow[]>([]);
  const loginUser = useRecoilValue(userState);
  const navigate = useNavigate();
  const {isLoading, isError, data, error} = useOrderListQuery({userid: loginUser?.userid});
  useEffect(() => {
    if (loginUser) {
      if (data) {
        orderListFunc(data);
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
  const orderListFunc = async (data: any) => {
    setOrderList(data);
  };
  const handleShowDetail = (orderid: string) => {
    navigate(`/m/order/${orderid}`);
  };

  return (
    <Box sx={MStyles.container}>
      <Box sx={MStyles.orderSheet}>
        <Box component={"h1"}>주문목록</Box>
        {/* 클릭하면 /order/:id 로 이동  */}
        {orderList && orderList.map(item => <ListItem key={item.orderid} item={item} handleShowDetail={handleShowDetail} />)}
        <Box sx={MStyles.MOrderListAddButton}>
          <AddIcon />
          더보기
        </Box>
      </Box>
    </Box>
  );
}

function ListItem({item, handleShowDetail}: any) {
  const {createdate, products} = item;
  const orderid = item.orderid;
  const status = statusCheck(item.status);
  return (
    <Box sx={MStyles.MOrderListItemBox}>
      <Box sx={MStyles.MOrderListItemBoxHeader}>
        <Box>주문일 : {dateFormat(createdate)}</Box>
        <Box>
          주문 상태 :{" "}
          <Box component={"span"} sx={{fontWeight: "bold"}}>
            {status}
          </Box>
        </Box>
        {/* <Box>주문번호 : 1234-5678</Box> */}
      </Box>
      {products && products.map((product: any) => <IndividualProduct key={`${product.productid}-${product.itemid}`} product={product} />)}
      <Box sx={{padding: "12px 0"}}>
        <Button
          sx={MStyles.w100per}
          variant={"contained"}
          onClick={() => {
            handleShowDetail(orderid);
          }}>
          주문 상세
        </Button>
      </Box>
    </Box>
  );
}

function IndividualProduct({product}: any) {
  const option = product.option.indexOf("/") ? product.option.split("/") : product.option;
  return (
    <Box sx={MStyles.MOrderListIndividualProduct}>
      <Box>
        <Box component={"img"} sx={{width: 100}} src={product.product.thumbnail} />
      </Box>
      <Box component={"ul"} sx={{marginLeft: "12px"}}>
        <Box component={"li"} sx={MStyles.bold}>
          {product.product.title}
        </Box>
        <Box component={"li"}>수량 : {product.count}개</Box>
        <Box component={"li"}>{option.length > 1 ? `옵션 : ${option[0]}, ${option[1]}` : ""}</Box>
      </Box>
    </Box>
  );
}
