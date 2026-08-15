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
import {kraft, lotLabel} from "theme/kraft";

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
  tabYn,
}: any) {
  const navigate = useNavigate();
  const [selectFair, setSelectFair] = useState([]);
  const user = useRecoilValue(userState);

  const totalStock =
    selectList.length > 0 ? selectList.reduce((sum: number, item: any) => sum + item.stock, 0) : optLen > 0 ? 0 : product.stock || 1;
  const totalCost =
    selectList.length > 0
      ? selectList.reduce((sum: number, item: any) => sum + item.cost * item.stock, 0)
      : optLen > 0
        ? 0
        : product.cost * (product.stock || 1);

  const requireLogin = () => {
    if (user) return true;
    if (confirm("로그인 후 이용이 가능합니다.\n로그인하시겠습니까?")) {
      navigate("/login");
    }
    return false;
  };

  const requireOption = () => {
    if (optLen > 0 && selectList.length === 0) {
      alert("옵션을 선택하세요");
      return false;
    }
    return true;
  };

  const handleAddCart = async (payload: any) => {
    await execute(async () => {
      await axios.post(`/api/v1/cart/`, payload);
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

  const handleBuy = () => {
    if (!requireLogin() || !requireOption()) return;
    const params =
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
  };

  const handleCart = async () => {
    if (!requireLogin() || !requireOption()) return;
    if (optLen > 0) {
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
      return;
    }
    await handleAddCart({
      userid: user.userid,
      productid: product.id,
      pid: product.id,
      itemid: 0,
      option: "",
      count: product.stock,
      cost: product.cost,
    });
  };

  return (
    <Box sx={MStyles.purchasingArea}>
      <Box sx={MStyles.productInfoArea}>
        <Box sx={tabYn ? MStyles.none : {}}>
          <Box
            sx={{
              fontFamily: kraft.mono,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
            }}>
            {lotLabel(product.id)}
          </Box>
          <Box
            component="h1"
            sx={{
              m: "8px 0 0",
              fontFamily: kraft.display,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.25,
            }}>
            {product.title}
          </Box>
          {product.description && (
            <Box sx={{mt: 1, color: kraft.mute, fontSize: 14, lineHeight: 1.45}}>{product.description}</Box>
          )}
          <Box sx={MStyles.productPrice}>{numberFormat(product.cost)}</Box>
        </Box>
      </Box>
      <Box sx={optLen > 0 ? MStyles.optionArea : MStyles.noneOption}>
        {optionKeys &&
          optionKeys.map((optkey: any, i: number) => {
            const opt = optionList.filter((opt: any) => opt.key == optkey);
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
      <Box sx={MStyles.totalInfoArea}>
        <Box component={"ul"} sx={{m: 0, p: 0, listStyle: "none"}}>
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
            <Item seq={0} optLen={optLen} itemInfo={product} selectList={selectList} setSelectList={setSelectList} />
          )}
        </Box>
        <Box sx={MStyles.productTotalValues}>
          <Box sx={MStyles.productStock}>총 {totalStock}개</Box>
          <Box sx={MStyles.productCost}>{numberFormat(totalCost)}</Box>
        </Box>
        <Box sx={MStyles.productBtnArea}>
          <Button variant="contained" sx={MStyles.productOrderBtn} size="large" onClick={handleBuy}>
            구매하기
          </Button>
          <Button variant="outlined" sx={MStyles.productCartBtn} size="large" onClick={handleCart}>
            장바구니
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
