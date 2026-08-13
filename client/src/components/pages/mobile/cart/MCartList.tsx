import React, {useState, useEffect} from "react";
import {useRecoilValue, useRecoilState} from "recoil";
import {useNavigate} from "react-router-dom";
import axios from "axios";

import {Box, Button, Checkbox, TextField, FormControl, FormControlLabel} from "@mui/material";

import {userState} from "@recoils/user/state";
import {useCartListQuery} from "@recoils/cart/query";
import {execute} from "@utils/Executor";
import {numberFormat} from "@utils/Numaric";
import {MStyles} from "@styles";

export default function MCartList() {
  // const [open, setOpen] = useState(false);
  // const [listid, setListid] = useState(false);
  // const [checkedList, setCheckedList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [selectItems, setSelectItems] = useState<Array<any>>([]); // 선택한 주문 품목 목록
  const [totalCost, setTotalCost] = useState(0); // 총 결제 금액
  const navigate = useNavigate();
  const host = window.location.port
    ? window.location.protocol + "//" + window.location.hostname + ":" + window.location.port
    : window.location.protocol + "//" + window.location.hostname;
  const loginUser = useRecoilValue(userState);
  const {isLoading, isError, data, error} = useCartListQuery(loginUser?.userid);

  useEffect(() => {
    if (!loginUser) {
      navigate("/m/login");
      return;
    }
    if (!data) return;
    const mapped = data.map((item: any) => ({
      id: item.id,
      userid: item.userid,
      productid: item.product.id,
      pid: item.pid,
      itemid: item.itemid,
      thumbnail: String(host + item.product.thumbnail),
      maxCapacity: Number(item.product.capacity),
      title: item.product.title,
      option: item.option,
      count: Number(item.count),
      cost: Number(item.cost),
      isChecked: true,
    }));
    setItemList(mapped);
    setSelectItems(mapped);
    setTotalCost(mapped.reduce((sum: number, item: any) => sum + item.count * item.cost, 0));
  }, [data, host, loginUser, navigate]);

  const changeCheckbox = (checked: boolean, item: any, cost: number) => {
    if (checked) {
      setSelectItems(prev => [...prev, item]);
      setTotalCost(prev => prev + cost);
    } else {
      setSelectItems(prev => prev.filter((selectItem: any) => selectItem.id !== item.id));
      setTotalCost(prev => prev - cost);
    }
  };
  const changeAllCheckBox = (checked: boolean) => {
    if (checked) {
      // console.log("itemList >>", itemList);
      const itemArray: Array<any> = [];
      let tempCost = 0;
      itemList.map((item: any) => {
        itemArray.push(item);
        tempCost += item.count * item.cost;
      });
      setTotalCost(tempCost);
      setSelectItems(itemArray);
    } else {
      setSelectItems([]);
      setTotalCost(0);
    }
  };

  const handleRemoveCart = async (ids: any) => {
    await execute(async () => {
      const {result} = await ids.map((id: string) => axios.delete(`/api/v1/cart/${id}`));
      alert("장바구니에서 삭제했습니다");
      setItemList(itemList.filter((item: any) => ids.every((id: string) => id !== item.id)));
      if (selectItems.length == ids.length) {
        setTotalCost(0);
      }
    });
  };

  const handleEditCart = async (userid: number, data: any) => {
    await execute(async () => {
      const result = await axios.put(`/api/v1/cart/${userid}`, data);
      console.log("Edit Cart result >> ", result);
      // 수량 수정 후 선택된 상품의 총 금액만 다시 계산하여 반영함
      setTotalCost(selectItems.map((item: any) => item.count * item.cost).reduce((prevCost: number, nextCost: number) => prevCost + nextCost));
    });
  };

  const handleTakeOrdered = async (params: any) => {
    await execute(async () => {
      // console.log("params :", params);
      const {data} = await axios.post(`/api/v1/user/${loginUser.userid}/order/`, params);
      // console.log("result :", data);
      navigate(`/m/order/sheet/${data.orderid}`);
    });
  };
  return (
    <Box sx={MStyles.MCartContainer}>
      <FormControl sx={{width: "100%"}}>
        <Box sx={MStyles.MCartFormBox}>
          <Box sx={MStyles.MCartBox}>
            <Box sx={MStyles.MCartTitle}>장바구니</Box>
            <Box sx={MStyles.MCartHeader}>
              <Box>
                <Checkbox
                  color="primary"
                  checked={selectItems.length === itemList.length ? true : false}
                  onChange={e => changeAllCheckBox(e.target.checked)}></Checkbox>
                전체선택
              </Box>
              <Box sx={MStyles.MCartHeaderButtonBox}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    const ids = selectItems.map(item => item.id);
                    handleRemoveCart(ids);
                  }}>
                  선택 삭제
                </Button>
                <Button
                  variant="outlined"
                  sx={MStyles.orderBtn}
                  onClick={() => {
                    const ids = itemList.map((item: any) => item.id);
                    handleRemoveCart(ids);
                  }}>
                  장바구니 비우기
                </Button>
              </Box>
            </Box>
            {itemList &&
              itemList.map((item: any) => {
                return (
                  <ListItem
                    key={item.id}
                    item={item}
                    selectItems={selectItems}
                    changeCheckbox={changeCheckbox}
                    handleEditCart={handleEditCart}
                  />
                );
              })}
            <Box sx={MStyles.w100per}>
              <Box sx={MStyles.MCartTotalCost}>
                <Box>총 주문 금액 {numberFormat(totalCost)}</Box>
              </Box>
              {/* 주문하기 누르면 /order/sheet/:id 로 선택한 데이터만 담아서 이동 */}
              <Button
                variant="outlined"
                sx={MStyles.w100per}
                onClick={() => {
                  // console.log("주문하기 Click", selectItems);
                  // const params = {
                  //   userid: user.userid,
                  //   status: "temp",
                  //   productid: selectItems[0].pid,
                  //   option: selectItems[0].option,
                  //   count: selectItems[0].count,
                  //   cost: selectItems[0].cost,
                  // };

                  const params = {
                    userid: loginUser?.userid,
                    status: "TEMP",
                    products: selectItems.map(item => ({
                      productid: item.pid,
                      itemid: item.itemid,
                      option: item.option,
                      count: item.count,
                      cost: item.cost,
                    })),
                  };
                  handleTakeOrdered(params);
                }}>
                주문하기
              </Button>
            </Box>
          </Box>
        </Box>
      </FormControl>
    </Box>
  );
}

function ListItem({item, selectItems, changeCheckbox, handleEditCart}: any) {
  // 한글 주석: item.count를 단일 소스로 두고, 리렌더만 tick으로 유도
  const [, setTick] = useState(0);
  const count = item.count;
  const {cost, itemid, option, prouctid, thumbnail, title} = item;
  return (
    <Box sx={MStyles.MCartCardBox}>
      <Box sx={MStyles.MCartCardProductLeft}>
        <Box component={"img"} src={thumbnail} />
      </Box>
      <Box sx={MStyles.MCartCardProductRight}>
        <Box sx={MStyles.MCartCardTitle}>
          <Box>{title}</Box>
          <Box sx={MStyles.MCartSimpleCheckBox}>
            <Checkbox
              color="primary"
              checked={selectItems.includes(item) ? true : false}
              onChange={e => changeCheckbox(e.target.checked, item, item.count * item.cost)}></Checkbox>
          </Box>
        </Box>
        {/* <Box sx={MStyles.MCartCardSale}>29,000원</Box> */}
        <Box sx={MStyles.MCartCardFinal}>{numberFormat(cost)}</Box>
        <Box sx={MStyles.MCartCardStockBox}>
          <Box>
            <Box sx={MStyles.flex}>
              <Box sx={MStyles.MCartStockButtonBox}>
                <Button
                  sx={MStyles.MCartStockButton}
                  onClick={() => {
                    if (item.count > 1) {
                      item.count--;
                      setTick(t => t + 1);
                    }
                  }}>
                  -
                </Button>
                <Box sx={MStyles.MCartListTableStockPadding}>{count}</Box>
                <Button
                  sx={MStyles.MCartStockButton}
                  onClick={() => {
                    if (item.count < item.maxCapacity) {
                      item.count++;
                      setTick(t => t + 1);
                    }
                    if (item.count > 10000) {
                      alert("1만개 이하만 주문할 수 있습니다");
                      item.count = 10000;
                      setTick(t => t + 1);
                    }
                  }}>
                  +
                </Button>
              </Box>
            </Box>
          </Box>
          <Box>
            <Button
              variant="outlined"
              size="small"
              color="info"
              onClick={e => {
                const data = {userid: item.userid, pid: item.pid, itemid: item.itemid, count: item.count};
                handleEditCart(item.userid, data);
              }}>
              수량 변경
            </Button>
          </Box>
        </Box>
        <Box>
          <strong>합계 : {numberFormat(cost * item.count)}</strong>
        </Box>
      </Box>
      <Box sx={MStyles.MCartCardProductSelectInfo}>
        <Box sx={MStyles.MCartCardInfoLeft}>
          <Box>{option}</Box>
        </Box>
        {/* <Box sx={MStyles.MCartCardInfoRight}>
          <Button variant={"outlined"}>삭제</Button>
        </Box> */}
      </Box>
    </Box>
  );
}
