import React, {useState, useEffect} from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {numberFormat} from "@utils/Numaric";
import {MStyles} from "@styles";

export default function Options({
  seq,
  optLen,
  optkey,
  optval,
  itemList,
  selectFair,
  setSelectFair,
  selectList,
  setSelectList,
  totalCost,
  setTotalCost,
  totalStock,
  setTotalStock,
}: any) {
  const [title, setTitle] = useState("");
  useEffect(() => {
    if (selectFair.length == 0) {
      setTitle("");
    }
  }, [selectFair]);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const handleChange = (e: any) => {
    // TODO: blur()
    if (selectFair.length == 0 || selectFair[0].key == optkey) {
      setSelectFair([{key: optkey, value: e.target.value}]);
    } else if (selectFair[0].key != optkey) {
      setSelectFair([...selectFair, {key: optkey, value: e.target.value}]);
    }
    setTitle(e.target.value);
    // 마지막번째 옵션과 seq이 같은 경우
    if (seq == optLen) {
      const item = itemList.filter((item: any) => item.itemkey == selectFair[0].value && item.itemval == e.target.value)[0];
      // console.log("item : ", item);
      if (item.capacity == 0) {
        alert("품절인 옵션은 구매하실 수 없습니다.");
      } else if (selectList.filter((s: any) => s.val === item.val).length > 0) {
        alert("이미 선택한 옵션입니다.");
      } else {
        // 선택 상품 리스트에 추가, 전체 수량, 전체 가격 증가, 선택상품 Fair 초기화
        setSelectList([...selectList, {itemid: item.itemid, val: item.val, cost: item.cost, stock: 1}]);
        // setSelectList([...selectList, {key: item.key, cost: item.cost, stock: 1}]);
        setTotalCost(totalCost + item.cost);
        setTotalStock(totalStock + 1);
        setSelectFair([]);
      }
      setTitle("");
    }
  };
  return (
    <FormControl sx={MStyles.optionFormBox} size="small">
      <InputLabel id={optkey}>{optkey}</InputLabel>
      <Select
        label={optkey}
        onChange={handleChange}
        value={title}
        MenuProps={{
          disableScrollLock: true,
          PaperProps: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
              width: 250,
            },
          },
        }}>
        {optval &&
          optval.map((val: any, i: number) => {
            let text = `${val}`;
            // 마지막 seq가 아니면
            if (seq != optLen) {
              return (
                <MenuItem key={i} value={val}>
                  {val}
                </MenuItem>
              );
            } else if (seq == optLen && selectFair.length > 0) {
              const item = itemList.filter((item: any) => item.itemkey == selectFair[0].value && item.itemval == val);
              if (item.length > 0 && item[0].price != 0) {
                if (item[0].price > 0) {
                  text += ` (+${numberFormat(item[0].price)})`;
                } else {
                  text += ` (${numberFormat(item[0].price)})`;
                }
              }
              if (item.length > 0 && item[0].capacity < 1) {
                text += ` (품절)`;
              }
              return (
                <MenuItem key={i} value={val}>
                  {text}
                </MenuItem>
              );
            }
          })}
      </Select>
    </FormControl>
  );
}
