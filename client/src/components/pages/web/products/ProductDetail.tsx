import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useRecoilValue} from "recoil";

import {Box, Button} from "@mui/material";

import {userState} from "@recoils/user/state";
import {Styles} from "@styles";
import {execute} from "@utils/Executor";
import {numberFormat} from "@utils/Numaric";
import Options from "./Options";
import Item from "./Item";
import Package from "./Package";
import {api} from "@recoils/common";

export default function ProductDetail({
  product,
  optLen,
  optionKeys,
  optionList,
  itemList,
  selectList,
  setSelectList,
  packageMethod,
  setPackageMethod,
  tabYn,
}: any) {
  const navigate = useNavigate();
  const [selectFair, setSelectFair] = useState([]);
  const user = useRecoilValue(userState);

  const styles = Styles();
  // selectList 기준 총액/총수량 (옵션 없으면 product 기본값)
  const totalStock =
    selectList.length > 0 ? selectList.reduce((sum: number, item: any) => sum + item.stock, 0) : optLen > 0 ? 0 : product.stock || 1;
  const totalCost =
    selectList.length > 0
      ? selectList.reduce((sum: number, item: any) => sum + item.cost * item.stock, 0)
      : optLen > 0
        ? 0
        : product.cost * (product.stock || 1);

  const handleAddCart = async (product: any) => {
    await execute(async () => {
      const {data} = await api.post(`/cart/`, product);
      // console.log("handleAddCart : ", data);
      if (confirm("장바구니에 상품을 담았습니다.\n장바구니로 이동하시겠습니까?")) {
        navigate("/cart/list");
      }
    });
  };
  const handleTakeOrdered = async (params: any) => {
    await execute(async () => {
      const {data} = await api.post(`/user/${user.userid}/order/`, params);
      navigate(`/order/sheet/${data.orderid}`);
    });
  };

  return (
    <Box sx={tabYn ? styles.tabProduct : styles.productRight}>
      <Box sx={styles.productInfoArea}>
        <Box sx={tabYn ? styles.none : {}}>
          <Box>
            <Box component="strong">{product.title}</Box>
          </Box>
          <Box sx={styles.productPrice}>
            {/* TODO: 할인율 생성 / 적용 */}
            {/* <Box sx={{ color: "#6b90dc", fontSize: "30px" }}>30%</Box> */}
            <Box>
              <Box>
                <Box component={"strong"}>{numberFormat(product.cost)}</Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box>
          {/* TODO: 배송 방식을 주문할 때 정하는 게 낫지 않을까?
          장바구니 담을 때 정하려면 Cart DB에 delviery 방식에 대한 column 추가가 필요함 */}
          {/* 고민해봤을 때, 장바구니에 담을 때보다 주문할 때 배송지 적거나 직접수령으로 선택해서 결제하는 게 나을듯, 어차피 카드 계산 같은 거 안하니까. */}
          {/* <Package packageMethod={packageMethod} setPackageMethod={setPackageMethod} /> */}
        </Box>
      </Box>
      <Box sx={optLen > 0 ? styles.optionArea : styles.noneOption}>
        {optionKeys &&
          optionKeys.map((optkey: any, i: number) => {
            const opt = optionList.filter((opt: any) => opt.key == optkey);
            // console.log("opt >>>", opt);
            const optval = opt[0].val.split(",");
            return (
              <Box key={optkey}>
                <Options
                  seq={i + 1}
                  optLen={optLen}
                  optkey={optkey}
                  optval={optval}
                  itemList={itemList}
                  selectFair={selectFair}
                  setSelectFair={setSelectFair}
                  selectList={selectList}
                  setSelectList={setSelectList}
                />
              </Box>
            );
          })}
      </Box>
      <Box sx={styles.totalInfoArea}>
        <Box component={"ul"}>
          {selectList && optLen > 0 && optionKeys.length > 0 ? (
            selectList.map((selectItem: any, i: number) => {
              const itemInfo = itemList.filter((item: any) => item.val == selectItem.val)[0];
              return (
                <Item
                  key={selectItem.itemid ?? selectItem.val}
                  seq={i}
                  optLen={optLen}
                  itemInfo={itemInfo}
                  selectList={selectList}
                  setSelectList={setSelectList}
                />
              );
            })
          ) : (
            <Item
              seq={0}
              optLen={optLen}
              itemInfo={product}
              selectList={selectList}
              setSelectList={setSelectList}
            />
          )}
        </Box>
        <Box sx={styles.productTotalValues}>
          <Box sx={styles.productStock}>
            <Box>
              <Box component={"span"}>총 수량 {totalStock}개</Box>
            </Box>
          </Box>
          <Box sx={styles.productCost}>
            <Box component={"strong"}>{numberFormat(totalCost)}</Box>
          </Box>
        </Box>
        <Box sx={styles.productBtnArea}>
          <Button variant="contained" sx={styles.productOrderBtn} size="large">
            <Box
              onClick={() => {
                if (user) {
                  // console.log("selectList check ? >>> ", selectList);
                  let params =
                    optLen > 0
                      ? {
                          user: user.userid,
                          status: "TEMP",
                          products: selectList.map((item: any) => ({
                            productid: product.id,
                            itemid: item.itemid,
                            option: item.val,
                            count: item.stock,
                            cost: item.cost,
                          })),
                        }
                      : {
                          user: user.userid,
                          status: "TEMP",
                          products: [
                            {
                              productid: product.id,
                              itemid: 0,
                              option: "",
                              count: product.stock,
                              cost: product.cost,
                            },
                          ],
                        };
                  handleTakeOrdered(params);
                } else if (confirm("로그인 후 이용이 가능합니다.\n로그인하시겠습니까?")) {
                  navigate("/login");
                }
              }}>
              구매하기
            </Box>
          </Button>
          <Button variant="outlined" sx={styles.productCartBtn} size="large">
            <Box
              onClick={async () => {
                if (user) {
                  if (optLen > 0) {
                    // console.log("장바구니 옵션 있음 : ", product, selectList);
                    await Promise.all(
                      selectList.map((item: any) =>
                        handleAddCart({
                          userid: user.userid,
                          productid: product.id,
                          pid: product.id,
                          itemid: item.itemid,
                          option: item.val,
                          count: item.stock,
                          cost: item.cost,
                        }),
                      ),
                    );
                  } else {
                    // console.log("장바구니 옵션 없음 : ", product);
                    await handleAddCart({
                      userid: user.userid,
                      productid: product.id,
                      pid: product.id,
                      itemid: 0,
                      option: "",
                      count: product.stock,
                      cost: product.cost,
                    });
                    // userid, productid, itemid, option(itemval), count, cost
                    // EX) "abc@gmail.com", 1, 0, "", 1, "8000"
                  }
                } else if (confirm("로그인 후 이용이 가능합니다.\n로그인하시겠습니까?")) {
                  navigate("/login");
                }
              }}>
              장바구니
            </Box>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
