import {useEffect, useState} from "react";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {IconButton, Tooltip} from "@mui/material";
import CheckedList from "./list/CheckedList";
import AdminGnb from "@layout/AdminGnb";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {getCategoryListQuery} from "@recoils/category/query";
import AddIcon from "@mui/icons-material/Add";
import AddCategoryDialog from "./dialog/AddCategoryDialog";
import {putCategoryUseYn} from "@recoils/category/axios";

export default function CategoryList() {
  const [selected, setSelected]: any = useState([]);
  const [open, setOpen] = useState(false);
  const [list, setList]: any = useState([]);
  const {isLoading, isError, data, error} = getCategoryListQuery();
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

  const handleItemUseYn = async (useyn: string) => {
    const categories = selected?.map((item: any) => {
      return {id: item?.id, useyn};
    });
    await putCategoryUseYn(categories);
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
    setSelected([]);
  };
  return (
    <AdminGnb RightButtons={<RightButtons selected={selected} setOpen={setOpen} handleItemUseYn={handleItemUseYn} />}>
      <MainPane list={list} selected={selected} setSelected={setSelected} />
      <AddCategoryDialog open={open} setOpen={setOpen} handleAddItem={handleAddItem} />
    </AdminGnb>
  );
}
//미선택 > 카테고리 추가...
/*
  > 카테고리 수정/삭제(상세)
            미사용/사용
            카테고리에 상품 추가
*/
function RightButtons({selected, setOpen, handleItemUseYn}: any) {
  console.log("selected >", selected);
  const buttonList = [
    selected?.length == 0 && (
      <Tooltip key={"add"} title="추가">
        <IconButton edge="end" sx={{color: "white"}} onClick={() => setOpen(true)}>
          <AddIcon />
        </IconButton>
      </Tooltip>
    ),
    selected?.length > 0 && (
      <Tooltip key={"usey"} title="사용">
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
      <Tooltip key={"usen"} title="미사용">
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

  return <>{buttonList}</>;
}
function MainPane({list, selected, setSelected}: any) {
  return <CheckedList list={list} selected={selected} setSelected={setSelected} />;
}
