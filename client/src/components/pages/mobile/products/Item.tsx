import React, {useEffect} from "react";
import {Box, Button, TextField} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {numberFormat} from "@utils/Numaric";

export default function Item({seq, optLen, itemInfo, selectList, setSelectList, totalCost, setTotalCost, totalStock, setTotalStock}: any) {
  const selectItem = selectList.length > 0 ? selectList[seq] : itemInfo;
  // console.log("itemInfo >> ", itemInfo);
  useEffect(() => {
    if (selectList && selectList[seq]) {
      let TCost = selectList.map((s: any) => s.cost * s.stock).reduce((prevCost: number, nextCost: number) => prevCost + nextCost);
      let TStock = selectList.map((s: any) => s.stock).reduce((prevStock: number, nextStock: number) => prevStock + nextStock);
      // console.log("T Cost, Stock : ", TCost, TStock);
      setTotalCost(TCost);
      setTotalStock(TStock);
    }
    // }, [totalStock]);
  }, [selectItem.stock]);
  useEffect(() => {
    if (optLen == 0 && selectItem) {
      setTotalStock(selectItem.stock);
      setTotalCost(selectItem.cost);
    }
  }, []);
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
                  setTotalStock(totalStock - 1);
                  setTotalCost(totalCost - itemInfo.cost);
                  selectItem.stock--;
                }
                if (selectItem.stock > 10000) {
                  alert("1만개 이하만 주문할 수 있습니다");
                  selectItem.stock = 10000;
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
                // setValue(text?.replaceAll(/a-zA-Z/gi, ""));
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
                  setTotalStock(totalStock + 1);
                  setTotalCost(totalCost + itemInfo.cost);
                  selectItem.stock++;
                }
                if (selectItem.stock > 10000) {
                  alert("1만개 이하만 주문할 수 있습니다");
                  selectItem.stock = 10000;
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
                  setTotalCost(totalCost - selectItem.stock * itemInfo.cost);
                  setTotalStock(totalStock - selectItem.stock);
                  setSelectList(selectList?.filter((s: any) => s.key != itemInfo.key));
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
