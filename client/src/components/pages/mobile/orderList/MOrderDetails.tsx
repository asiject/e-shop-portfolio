import React, {useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";

import {Box, Button, Table, TableHead, TableBody, TableCell, TableRow, TextField, Checkbox} from "@mui/material";

import {userState} from "@recoils/user/state";
import {useOrderDetailQuery} from "@recoils/order/query";
import {numberFormat} from "@utils/Numaric";
import {execute} from "@utils/Executor";
import dateFormat from "@utils/DateFormat";
import statusCheck from "@utils/StatusCheck";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {MStyles} from "@styles";

export default function MOrderDetails() {
  const {id} = useParams();
  const user = useRecoilValue(userState);
  // const [useOrderDetailQuery, setOrderDetailQuery] = useRecoilState(orderDetailQuery);
  const [detailInfo, setDetailInfo] = useState<any>();
  const [detailList, setDetailList] = useState<any>();
  const loginUser = user;
  const navigate = useNavigate();
  const {isLoading, isError, data, error} = useOrderDetailQuery({userid: user.userid, orderid: id || ""});
  useEffect(() => {
    if (loginUser) {
      if (data) {
        setDetailInfo(data);
        setDetailList(
          data.products.map((item: any) => ({
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

  const handleRepurchase = async (params: any) => {
    await execute(async () => {
      params = Object.assign(params, {userid: loginUser?.userid});
      const {data} = await axios.post(`/api/v1/user/${user.userid}/order/`, params);
      console.log("result :", data);
      navigate(`/order/sheet/${data.orderid}`);
    });
  };

  return (
    <Box sx={MStyles.container}>
      <Box>
        <Box sx={MStyles.MOrderDetailBox}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2} sx={MStyles.MOrderDetailTableHeader}>
                  주문 정보
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* <TableRow>
              <TableCell sx={MStyles.leftCellSize}>주문번호</TableCell>
              <TableCell>1234-5678</TableCell>
            </TableRow> */}
              <TableRow>
                <TableCell>주문일자</TableCell>
                <TableCell>{detailInfo && dateFormat(detailInfo?.updatedate)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>주문자</TableCell>
                <TableCell>{detailInfo && detailInfo?.buyer?.buyername}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>입금현황</TableCell>
                <TableCell>{detailInfo && statusCheck(detailInfo?.status)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
        {/*  */}

        <Box sx={MStyles.MOrderDetailBox}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2} sx={MStyles.MOrderDetailTableHeader}>
                  주문 내역
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell colSpan={2}>
                  {detailList &&
                    detailList.map((item: any) => {
                      return <ListItem key={`${item.productid}-${item.itemid}`} item={item} />;
                    })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={MStyles.leftCellSize}>물품금액</TableCell>
                <TableCell>
                  {detailInfo && detailList && console.log("data >> ", detailInfo, detailList)}
                  {detailInfo && numberFormat(detailInfo?.payment?.total)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>처리 상태</TableCell>
                <TableCell>{detailInfo && statusCheck(detailInfo?.status)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
        {/*  */}
        <Box sx={MStyles.MOrderDetailBox}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2} sx={MStyles.MOrderDetailTableHeader}>
                  배송지 정보
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* <TableRow>
                <TableCell sx={MStyles.leftCellSize}>배송번호</TableCell>
                <TableCell>1234-5678</TableCell>
              </TableRow> */}
              <TableRow>
                <TableCell sx={MStyles.oneLine}>받는 분 성함</TableCell>
                <TableCell>{detailInfo && detailInfo?.delivery?.receiver}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={MStyles.oneLine}>받는 분 연락처</TableCell>
                <TableCell>{detailInfo && detailInfo?.delivery?.phone}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>우편 번호</TableCell>
                <TableCell>{detailInfo && detailInfo?.delivery?.postcode}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>배송 주소</TableCell>
                <TableCell>{detailInfo?.delivery && detailInfo?.delivery?.address1 + "" + detailInfo?.delivery?.address2}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={MStyles.oneLine}>배송 메시지</TableCell>
                <TableCell>{detailInfo && detailInfo?.delivery?.description}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
        <Box>
          {/* /order/list 로 이동 */}
          <Button
            variant={"contained"}
            sx={MStyles.w100per}
            onClick={() => {
              navigate(`/m/order/list`);
            }}>
            목록
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
function ListItem({item}: {item: any}) {
  const {thumbnail, title, count, cost} = item;
  const option = item.option.indexOf("/") ? item.option.split("/") : item.option;
  return (
    <Box sx={MStyles.MOrderDetailItemBox}>
      <Box>
        <Box component={"img"} src={thumbnail} sx={{height: 100, maxWidth: 100}} />
      </Box>
      <Box sx={{marginLeft: "8px"}}>
        <Box component={"ul"}>
          <Box component={"li"} sx={MStyles.bold}>
            {title}
          </Box>
          <Box component={"li"}>{option.length > 1 ? `옵션 : ${option[0]}, ${option[1]}` : ""}</Box>
          <Box component={"li"}>수량 : {count}개</Box>
          <Box component={"li"}>가격 : {numberFormat(cost * count)}</Box>
        </Box>
      </Box>
    </Box>
  );
}
