import {Box, IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {numberFormat} from "@utils/Numaric";
import QuantityStepper from "components/shop/QuantityStepper";
import {kraft} from "theme/kraft";

export default function Item({seq, optLen, itemInfo, selectList, setSelectList}: any) {
  const selectItem = selectList.length > 0 ? selectList[seq] : itemInfo;
  const stock = selectItem ? selectItem.stock : 0;
  const max = Math.min(Math.max(Number(itemInfo.capacity) || 1, 1), 10000);
  const labelId = `qty-${seq}`;

  const updateStock = (nextStock: number) => {
    if (optLen > 0) {
      setSelectList(selectList.map((s: any, i: number) => (i === seq ? {...s, stock: nextStock} : s)));
      return;
    }
    setSelectList([{itemid: 0, val: "", cost: itemInfo.cost, stock: nextStock}]);
    itemInfo.stock = nextStock;
  };

  return (
    <Box
      component="li"
      sx={{
        borderBottom: `1px solid ${kraft.ink}`,
        padding: "12px 0",
        "&:last-of-type": {borderBottom: 0},
      }}>
      {itemInfo.val && (
        <Box id={labelId} sx={{mb: 1, fontSize: 14, fontWeight: 700}}>
          {itemInfo.val}
        </Box>
      )}
      <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
        <QuantityStepper value={stock} min={1} max={max} onChange={updateStock} labelledBy={itemInfo.val ? labelId : undefined} />
        <Box
          sx={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontFamily: kraft.mono,
            fontVariantNumeric: "tabular-nums",
            fontWeight: 600,
          }}>
          <Box>{selectItem && numberFormat(itemInfo.cost * stock)}</Box>
          {optLen > 0 && (
            <IconButton
              aria-label="선택 옵션 삭제"
              size="small"
              onClick={() => setSelectList(selectList?.filter((s: any) => s.val != itemInfo.val))}
              sx={{color: kraft.ink}}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
}
