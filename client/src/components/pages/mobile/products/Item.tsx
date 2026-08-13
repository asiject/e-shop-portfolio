import React from "react";
import {Box, Button, TextField} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {numberFormat} from "@utils/Numaric";

export default function Item({seq, optLen, itemInfo, selectList, setSelectList}: any) {
  const selectItem = selectList.length > 0 ? selectList[seq] : itemInfo;

  const updateStock = (nextStock: number) => {
    if (optLen > 0) {
      setSelectList(selectList.map((s: any, i: number) => (i === seq ? {...s, stock: nextStock} : s)));
      return;
    }
    // 옵션 없는 상품: selectList에 단일 항목으로 동기화 (부모에서 totals 도출)
    setSelectList([{itemid: 0, val: "", cost: itemInfo.cost, stock: nextStock}]);
    itemInfo.stock = nextStock;
  };

  return (
    <Box component={"li"} sx={{borderBottom: "1px solid #ccc", padding: "10px 0"}}>
      <Box>{itemInfo.val}</Box>
      <Box>
        <Box sx={{display: "flex"}}>
          <Box sx={{border: "1px solid #e2e2e2"}}>
            <Button
              style={{
                border: "none",
                width: "30px",
                height: "30px",
                minWidth: "0",
                fontSize: "20px",
              }}
              onClick={() => {
                if (selectItem.stock > 1) {
                  updateStock(selectItem.stock - 1);
                }
              }}>
              -
            </Button>
            <TextField
              sx={{
                border: "none",
                width: "50px",
                height: "30px",
                input: {padding: "4px 0 4px 0", textAlign: "center"},
              }}
              value={selectItem ? selectItem.stock : 0}
              //TODO: 숫자 입력 처리 ?
              // onChange={e => {
              //   const text = e.target.value;
              //   selectList[seq].stock = text?.replaceAll(/a-zA-Z/gi, "");
              // }}
            />
            {/* <Box
              component={"input"}
              sx={{
                border: "none",
                width: "30px",
                height: "30px",
                padding: "0",
                textAlign: "center",
              }}
              value={selectList[seq].stock}
              onChange={e => {
                const text = e.target.value;
                selectList[seq].stock = text?.replaceAll(/a-zA-Z/gi, "");
                // const check = /^[0-9]+$/;
                // selectList[seq].stock = !check.test(text);
                // selectList[seq].stock = text?.replaceAll(/a-zA-Z/gi, "");
                // setValue(text?.replaceAll(/a-zA-Z/gi, "");
              }}></Box> */}
            <Button
              style={{
                border: "none",
                width: "30px",
                height: "30px",
                minWidth: "0",
                fontSize: "20px",
              }}
              onClick={() => {
                if (selectItem.stock < itemInfo.capacity) {
                  let next = selectItem.stock + 1;
                  if (next > 10000) {
                    alert("1만개 이하만 주문할 수 있습니다");
                    next = 10000;
                  }
                  updateStock(next);
                }
              }}>
              +
            </Button>
          </Box>
          <Box
            sx={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              "div + svg": {marginLeft: "10px"},
            }}>
            <Box>{selectItem && numberFormat(itemInfo.cost * selectItem.stock)}</Box>
            {optLen > 0 && (
              <CloseIcon
                sx={{
                  fontSize: "16px",
                  cursor: "pointer",
                  "&.hover": {cursor: "pointer"},
                }}
                onClick={() => {
                  setSelectList(selectList?.filter((s: any) => s.val != itemInfo.val));
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
