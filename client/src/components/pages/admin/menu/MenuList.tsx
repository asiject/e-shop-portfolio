import {useEffect, useState} from "react";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {AppBar, Box, IconButton, Toolbar, Tooltip} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MenuListDialog from "./dialog/AddMenuDialog";
import CheckedList from "./list/CheckedList";
import AdminGnb from "@layout/AdminGnb";
import {getAdminMenuListQuery} from "@recoils/admin/menu/query";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddMenuDialog from "./dialog/AddMenuDialog";
import {putMenuUseYn} from "@recoils/admin/menu/axios";
export default function MenuList() {
  const [selected, setSelected]: any = useState([]);
  const [open, setOpen] = useState(false);
  const [list, setList]: any = useState([]);
  const {isLoading, isError, data, error} = getAdminMenuListQuery();
  useEffect(() => {
    if (data) {
      setList(data);
    }
  }, [data]);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  const handleAddItem = (item: any) => {
    console.log("item >>", item);
    // setList(item);
  };

  const handleRemoveItems = () => {
    let removeItems = list;
    for (const obj of selected) {
      const idx = removeItems?.findIndex((item: any) => item?.id == obj?.id);
      if (idx > -1) {
        removeItems = [...removeItems.slice(0, idx), ...removeItems.slice(idx + 1, list?.length)];
      }
    }
    setList([...removeItems]);
    setSelected([]);
  };

  const handleItemUseYn = async (useyn: string) => {
    console.log("useyn >", useyn);
    // 선택한 놈들 useyn 변경도 같이 해야함.
    let selectItems = list;
    for (const obj of selected) {
      const idx = selectItems?.findIndex((item: any) => item?.id == obj?.id);
      if (idx > -1) {
        const selectItem = selectItems[idx];
        selectItem.useyn = useyn;
        selectItems = [...selectItems.slice(0, idx), selectItem, ...selectItems.slice(idx + 1, list?.length)];
      }
    }
    setList([...selectItems]);
    const menues = selected?.map((item: any) => ({id: item.id, useyn}));
    await putMenuUseYn(menues);

    setSelected([]);
  };
  return (
    <AdminGnb
      RightButtons={<RightButtons selected={selected} setOpen={setOpen} handleRemoveItems={handleRemoveItems} handleItemUseYn={handleItemUseYn} />}>
      <MainPane list={list} selected={selected} setSelected={setSelected} open={open} setOpen={setOpen} handleAddItem={handleAddItem} />
    </AdminGnb>
  );
}
// menu 추가 삭제가 사실상 의미가 없긴해
// [SHOP-28] 메뉴 사용/미사용 처리
function RightButtons({selected, setOpen, handleRemoveItems, handleItemUseYn}: any) {
  const buttonList = [
    selected?.length > 0 && (
      <Tooltip title="사용">
        <IconButton
          edge="end"
          sx={{color: "white"}}
          onClick={() => {
            handleItemUseYn("Y");
          }}>
          <AddCircleOutlineIcon />
        </IconButton>
      </Tooltip>
    ),
    selected?.length > 0 && (
      <Tooltip title="미사용">
        <IconButton
          edge="end"
          sx={{color: "white"}}
          onClick={() => {
            handleItemUseYn("N");
          }}>
          <RemoveCircleOutlineIcon />
        </IconButton>
      </Tooltip>
    ),
  ].filter(Boolean);
  return (
    <Box marginLeft={"auto"}>
      {selected?.length == 0 ? (
        <></>
      ) : (
        <>
          <Tooltip title="사용">
            <IconButton
              edge="end"
              sx={{color: "white"}}
              onClick={() => {
                handleItemUseYn("Y");
              }}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="미사용">
            <IconButton
              edge="end"
              sx={{color: "white"}}
              onClick={() => {
                handleItemUseYn("N");
              }}>
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Box>
  );
}
function MainPane({list, selected, setSelected, open, setOpen, handleAddItem}: any) {
  return (
    <>
      <CheckedList list={list} selected={selected} setSelected={setSelected} />
      <AddMenuDialog open={open} setOpen={setOpen} handleAddItem={handleAddItem} />
    </>
  );
}
