import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useRecoilValue} from "recoil";

import {Box, Button} from "@mui/material";

import {userState} from "@recoils/user/state";
import {execute} from "@utils/Executor";
import {numberFormat} from "@utils/Numaric";
import Options from "./Options";
import Item from "./Item";
import {MStyles} from "@styles";
// import Package from "./Package";

export default function MProductDetail({
  product,
  optLen,
  optionKeys,
  optionList,
  itemList,
  selectList,
  setSelectList,
  packageMethod,
  setPackageMethod,
  totalCost,
  setTotalCost,
  totalStock,
  setTotalStock,
  tabYn,
}: any) {
  const navigate = useNavigate();
  const [selectFair, setSelectFair] = useState([]);
  const user = useRecoilValue(userState);

  const handleAddCart = async (product: any) => {
    console.log("data >>", product);
    await execute(async () => {
      const {data} = await axios.post(`/api/v1/cart/`, product);
      console.log("handleAddCart : ", data);
      if (confirm("장바구니에 상품을 담았습니다.\n장바구니로 이동하시겠습니까?")) {
        navigate("/cart/list");
      }
    });
  };
  const handleTakeOrdered = async (params: any) => {
    await execute(async () => {
      const {data} = await axios.post(`/api/v1/user/${user.userid}/order/`, params);
      navigate(`/m/order/sheet/${data.orderid}`);
    });
  };

  return (
    <Box sx={MStyles.purchasingArea}>
      <Box sx={MStyles.productInfoArea}>
        <Box sx={tabYn ? MStyles.none : {}}>
          <Box>
            <Box component="strong">{product.title}</Box>
          </Box>
          <Box sx={MStyles.productPrice}>
            {/* TODO: 할인율 생성 / 적용 */}
            {/* <Box sx={{ color: "#6b90dc", fontSize: "30px" }}>30%</Box> */}
            <Box>
              <Box>
                <Box component={"strong"}>{numberFormat(product.cost)}</Box>
              </Box>
            </Box>
          </Box>
        </Box>
        {/* <Box>
          <Package packageMethod={packageMethod} setPackageMethod={setPackageMethod} />
        </Box> */}
      </Box>
      <Box sx={optLen > 0 ? MStyles.optionArea : MStyles.noneOption}>
        {optionKeys &&
          optionKeys.map((optkey: any, i: number) => {
            const opt = optionList.filter((opt: any) => opt.key == optkey);
            const optval = opt[0].val.split(",");
            return (
              <Box key={i}>
                <Options
                  key={i}
                  seq={i + 1}
                  optLen={optLen}
                  optkey={optkey}
                  optval={optval}
                  itemList={itemList}
                  selectFair={selectFair}
                  setSelectFair={setSelectFair}
                  selectList={selectList}
                  setSelectList={setSelectList}
                  totalCost={totalCost}
                  setTotalCost={setTotalCost}
                  totalStock={totalStock}
                  setTotalStock={setTotalStock}
                />
              </Box>
            );
          })}
      </Box>
      <Box sx={MStyles.totalInfoArea}>
        <Box component={"ul"}>
          {selectList && optLen > 0 && optionKeys.length > 0 ? (
            selectList.map((selectItem: any, i: number) => {
              const itemInfo = itemList.filter((item: any) => item.val == selectItem.val)[0];
              return (
                <Item
                  key={i}
                  seq={i}
                  optLen={optLen}
                  itemInfo={itemInfo}
                  selectList={selectList}
                  setSelectList={setSelectList}
                  totalCost={totalCost}
                  setTotalCost={setTotalCost}
                  totalStock={totalStock}
                  setTotalStock={setTotalStock}
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
              totalCost={totalCost}
              setTotalCost={setTotalCost}
              totalStock={totalStock}
              setTotalStock={setTotalStock}
            />
          )}
        </Box>
        <Box sx={MStyles.productTotalValues}>
          <Box sx={MStyles.productStock}>
            <Box>
              <Box component={"span"}>총 수량 {totalStock}개</Box>
            </Box>
          </Box>
          <Box sx={MStyles.productCost}>
            <Box component={"strong"}>{numberFormat(totalCost)}</Box>
          </Box>
        </Box>
        <Box sx={MStyles.productBtnArea}>
          <Button variant="contained" sx={MStyles.productOrderBtn} size="large">
            <Box
              onClick={() => {
                if (user) {
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
          <Button variant="outlined" sx={MStyles.productCartBtn} size="large">
            <Box
              onClick={async () => {
                console.log("user >", user, optLen, selectList);
                if (user) {
                  let data = {};
                  if (optLen > 0) {
                    // console.log("장바구니 옵션 있음 : ", product, selectList);
                    selectList?.map(async (item: any) => {
                      data = {
                        userid: user.userid,
                        productid: product.id,
                        pid: product.id,
                        itemid: item.itemid,
                        option: item.val,
                        count: item.stock,
                        cost: item.cost,
                      };
                      await handleAddCart(data);
                    });
                  } else {
                    // console.log("장바구니 옵션 없음 : ", product);
                    data = {
                      userid: user.userid,
                      productid: product.id,
                      pid: product.id,
                      itemid: 0,
                      option: "",
                      count: product.stock,
                      cost: product.cost,
                    };
                    await handleAddCart(data);
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
