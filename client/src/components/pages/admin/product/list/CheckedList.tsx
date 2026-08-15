import {Box, Checkbox, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import NoData from "@web/common/NoData";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {numberFormat} from "@utils/Numaric";
import {useNavigate} from "react-router";

export default function CheckedList({list, selected, setSelected}: any) {
  const handleItem = (product: any) => {
    const idx = selected?.findIndex((item: any) => item?.id == product?.id);
    if (idx > -1) {
      setSelected([...selected.slice(0, idx), ...selected.slice(idx + 1, selected?.length)]);
    } else {
      setSelected([...selected, product]);
    }
  };

  return (
    <List>
      <Items list={list} selected={selected} handleItem={handleItem} />
    </List>
  );
}
function Items({list, selected, handleItem}: any) {
  const navigate = useNavigate();
  if (list?.length == 0) {
    return <NoData />;
  }
  const handleView = (id: number) => {
    navigate(id);
  };

  const handleChecked = (e: any, item: any) => {
    handleItem(item);
    e.stopPropagation();
  };

  return list?.map((item: any) => (
    <ListItemButton key={item?.id} onClick={() => handleView(item?.id)} selected={item?.showyn == "N"}>
      {/* [SHOP-27] draggable 기능 달아야 순서 정함 */}
      {/* [SHOP-29] 상품 정렬 순서? */}
      {/* [SHOP-30] 한줄만 출력 */}
      {/* [SHOP-31] 상품 전체선택 및 추가/삭제 */}
      <ListItemIcon onClick={(e: any) => handleChecked(e, item)}>
        <Checkbox
          edge="start"
          checked={selected?.find((obj: any) => obj?.id == item?.id) ? true : false}
          tabIndex={-1}
          disableRipple
          inputProps={{"aria-labelledby": item?.id}}
        />
      </ListItemIcon>

      <ListItemText
        primary={"[" + numberFormat(item?.cost) + "] " + item?.title}
        secondary={"[" + numberFormat(item?.capacity, "개") + "] " + item?.description}
      />
      <ListItemIcon>
        <IconButton edge="end">
          <ChevronRightIcon />
        </IconButton>
      </ListItemIcon>
    </ListItemButton>
  ));
}
