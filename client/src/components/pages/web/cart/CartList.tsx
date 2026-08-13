import React, {useState, useEffect} from "react";
import {useRecoilValue, useRecoilState} from "recoil";
import {useNavigate} from "react-router-dom";
import axios from "axios";

import {Box, Button, Checkbox, Table, TableBody, TableCell, TableFooter, TableHead, TableRow} from "@mui/material";

import {userState} from "@recoils/user/state";
import {getCartListQuery} from "@recoils/cart/query";
import {execute} from "@utils/Executor";
import {numberFormat} from "@utils/Numaric";
import {Styles} from "@styles";
export default function CartList() {
  const [itemList, setItemList] = useState<Array<any>>([]);
  const [selectItems, setSelectItems] = useState<Array<any>>([]); // 선택한 주문 품목 목록
  const [totalCost, setTotalCost] = useState(0); // 총 결제 금액
  const loginUser = useRecoilValue(userState);
  const navigate = useNavigate();
  const host = window.location.port
    ? window.location.protocol + "//" + window.location.hostname + ":" + window.location.port
    : window.location.protocol + "//" + window.location.hostname;

  const styles = Styles();
  const {isLoading, isError, data, error} = getCartListQuery(loginUser?.userid);

  console.log("data >", data);
  // 장바구니 목록 가져오기, userid 받아오기
  useEffect(() => {
    // 새로고침시 userState 가 null이 되었다가 webStorage에서 데이터를 받아와서 null일 경우 webStorage에서 받아오는 데이터로 검증
    if (loginUser) {
      // cartListFunc(loginUser);
      if (data) {
        setItemList(
          data?.map((item: any) => {
            // console.log("item data : ", item);
            return {
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
            };
          }),
        );
      }
    } else {
      navigate("/login");
    }
  }, [data]);
  useEffect(() => {
    if (itemList?.length > 0) {
      changeAllCheckBox(true);
    }
  }, [itemList]);

  const changeCheckbox = (checked: Boolean, item: any, cost: number) => {
    if (checked) {
      setSelectItems([...selectItems, item]);
      setTotalCost(totalCost + cost);
    } else {
      setSelectItems(selectItems.filter((selectItem: any) => selectItem.id !== item.id));
      setTotalCost(totalCost - cost);
    }
  };
  const changeAllCheckBox = (checked: Boolean) => {
    if (checked) {
      // console.log("itemList >>", itemList);
      const itemArray: Array<any> = [];
      let tempCost = 0;
      itemList.map(item => {
        itemArray.push(item);
        tempCost += item.count * item.cost;
        setTotalCost(tempCost);
      });
      setSelectItems(itemArray);
    } else {
      setSelectItems([]);
      setTotalCost(0);
    }
  };

  const handleRemoveCart = async (ids: any) => {
    await execute(async () => {
      const {result} = await ids.map((id: number) => axios.delete(`/api/v1/cart/${id}`));
      alert("장바구니에서 삭제했습니다");
      setItemList(itemList?.filter(item => ids.every((id: number) => id !== item.id)));
      if (selectItems?.length == ids?.length) {
        setTotalCost(0);
      }
    });
  };

  const handleEditCart = async (userid: number, data: any) => {
    await execute(async () => {
      const result = await axios.put(`/api/v1/cart/${userid}`, data);
      console.log("수정 result >> ", result);
      // 수량 수정 후 선택된 상품의 총 금액만 다시 계산하여 반영함
      setTotalCost(selectItems.map((item: any) => item.count * item.cost).reduce((prevCost: number, nextCost: number) => prevCost + nextCost));
    });
  };

  const handleTakeOrdered = async (params: any) => {
    await execute(async () => {
      // console.log("params :", params);
      const {data} = await axios.post(`/api/v1/user/${loginUser?.userid}/order/`, params);
      // console.log("result :", data);
      navigate(`/order/sheet/${data.orderid}`);
    });
  };

  return (
    <Box sx={styles.orderWrapper}>
      <Box sx={styles.container}>
        <Box sx={styles.orderBox}>
          <Box sx={styles.flex}>
            <Box sx={styles.cartTitle}>장바구니</Box>
          </Box>
          <Table sx={styles.mt20}>
            <TableHead>
              <TableRow sx={styles.orderTableHeader}>
                <TableCell colSpan={2} sx={[styles.w200]}>
                  <Box sx={{textAlign: "left"}}>
                    <Checkbox
                      color="primary"
                      edge="start"
                      checked={selectItems?.length === itemList?.length ? true : false}
                      onChange={e => changeAllCheckBox(e.target.checked)}></Checkbox>
                  </Box>
                </TableCell>
                <TableCell sx={styles.w500c}>
                  <Box sx={{textAlign: "center"}}>상품정보</Box>
                </TableCell>
                <TableCell sx={styles.w68c}>
                  <Box sx={{textAlign: "center"}}>수량</Box>
                </TableCell>
                <TableCell sx={styles.w68c}>
                  <Box sx={{textAlign: "center"}}>상품금액</Box>
                </TableCell>
                <TableCell sx={styles.w68c}>
                  {" "}
                  <Box sx={{textAlign: "center"}}>총금액</Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {itemList?.length > 0 &&
                itemList.map((item, i) => {
                  return <ItemList key={i} item={item} selectItems={selectItems} changeCheckbox={changeCheckbox} handleEditCart={handleEditCart} />;
                })}

              <TableRow>
                <TableCell colSpan={6} sx={styles.cartListFooterBox}>
                  <Box sx={styles.cartListFooterGuide}>
                    <Box sx={styles.w100per}>
                      <Box>
                        1958샵 제품은 로젠 택배로 배송됩니다.
                        <br />
                        장바구니에 담은 상품은 30일동안 보관됩니다.
                        <br />
                        실결제 금액 7만원 이상 구매시 무료 배송이 적용됩니다.
                      </Box>
                      <Box component="ul" sx={styles.cartListFooterCostBox}>
                        <Box component="li">
                          {/* <Box>결제 예정 금액</Box> */}
                          <Box>선택 상품 총 금액</Box>
                          <Box sx={styles.font20}>{numberFormat(totalCost)}</Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6} sx={styles.cartListFooterBox}>
                  <Box sx={styles.cartListFooterBtnBox}>
                    <Box sx={styles.cartListFooterBtnLeft}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          const ids = selectItems.map((item: any) => item.id);
                          handleRemoveCart(ids);
                        }}>
                        선택 삭제
                      </Button>
                      <Button
                        variant="outlined"
                        sx={styles.orderBtn}
                        onClick={() => {
                          const ids = itemList.map(item => item.id);
                          handleRemoveCart(ids);
                        }}>
                        장바구니 비우기
                      </Button>
                    </Box>
                    <Box sx={styles.cartListFooterBtnRight}>
                      {/* FIXME: [SHOP-16] 쇼핑하기 액션 */}
                      <Button variant="outlined">쇼핑하기</Button>
                      <Button
                        variant="contained"
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
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}

function ItemList({
  item,
  selectItems,
  changeCheckbox,
  handleEditCart,
}: {
  item: any;
  selectItems: any;
  changeCheckbox: Function;
  handleEditCart: Function;
}) {
  const [count, setCount] = useState(item.count);
  const styles = Styles();

  return (
    <TableRow>
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={selectItems.includes(item) ? true : false}
          onChange={e => changeCheckbox(e.target.checked, item, item.count * item.cost)}></Checkbox>
      </TableCell>
      <TableCell>
        <Box sx={styles.cartListTableAlignment}>
          <Box sx={styles.cartListTableImageSize} component={"img"} src={item.thumbnail} />
        </Box>
      </TableCell>
      <TableCell>
        <Box>{item.title}</Box>
        <Box>{item.option ? "선택 옵션 : " + item.option : ""}</Box>
      </TableCell>
      <TableCell>
        <Box sx={styles.flex}>
          <Button
            onClick={e => {
              if (count > 1) {
                item.count--;
                setCount(count - 1);
              }
            }}>
            &lt;
          </Button>
          {/* FIXME: [SHOP-15] 숫자 변경하면, 장바구니에 넣기 */}
          <Box sx={styles.cartListTableStockPadding}>{count}</Box>
          <Button
            onClick={e => {
              if (count < item.maxCapacity) {
                item.count++;
                setCount(count + 1);
              }
              if (item.count > 10000) {
                alert("1만개 이하만 주문할 수 있습니다");
                item.count = 10000;
              }
            }}>
            &gt;
          </Button>
        </Box>
        <Box sx={styles.cartListTableModifyBtn}>
          <Button
            variant="outlined"
            size="small"
            color="info"
            onClick={e => {
              const data = {userid: item.userid, pid: item.pid, itemid: item.itemid, count: item.count};
              handleEditCart(item.userid, data);
            }}>
            수정
          </Button>
        </Box>
      </TableCell>
      <TableCell sx={styles.textCenter}>
        <Box>{numberFormat(item.cost)}</Box>
      </TableCell>
      <TableCell sx={styles.textCenter}>
        <Box>{numberFormat(item.count * item.cost)}</Box>
      </TableCell>
    </TableRow>
  );
}
