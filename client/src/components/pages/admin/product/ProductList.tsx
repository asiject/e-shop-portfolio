import {useEffect, useState} from "react";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {IconButton, Tooltip} from "@mui/material";
import CheckedList from "./list/CheckedList";
import AdminGnb from "@layout/AdminGnb";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {getProductListQuery} from "@recoils/product/query";
import AddIcon from "@mui/icons-material/Add";
import {useNavigate} from "react-router";
import {putProductSortno} from "@recoils/admin/product/axios";

export default function ProductList() {
  const [selected, setSelected]: any = useState([]);
  const [open, setOpen] = useState(false);
  const [list, setList]: any = useState([]);
  const {isLoading, isError, data, error} = getProductListQuery();
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
  const handleAddItems = (item: any) => {
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

  const handleItemUseYn = async (showyn: string) => {
    const products = selected?.map((item: any) => {
      return {id: item?.id, showyn};
    });
    console.log("products >", products);
    await putProductSortno(products);

    // 선택한 놈들 useyn 변경도 같이 해야함.
    let selectItems = list;
    for (const obj of selected) {
      const idx = selectItems?.findIndex((item: any) => item?.id == obj?.id);
      if (idx > -1) {
        const selectItem = selectItems[idx];
        selectItem.showyn = showyn;
        selectItems = [...selectItems.slice(0, idx), selectItem, ...selectItems.slice(idx + 1, list?.length)];
      }
    }
    setList([...selectItems]);
    setSelected([]);
  };
  return (
    <AdminGnb
      RightButtons={<RightButtons selected={selected} setOpen={setOpen} handleRemoveItems={handleRemoveItems} handleItemUseYn={handleItemUseYn} />}>
      <MainPane list={list} selected={selected} setSelected={setSelected} open={open} setOpen={setOpen} handleAddItems={handleAddItems} />
    </AdminGnb>
  );
}
//미선택 > 카테고리 추가...
/*
  > 카테고리 수정/삭제(상세)
            미사용/사용
            카테고리에 상품 추가
*/
function RightButtons({selected, setOpen, handleRemoveItems, handleItemUseYn}: any) {
  const navigate = useNavigate();
  const onMovePage = () => {
    console.log("ss");
    // Dialog로 처리??
    navigate("/admin/product/write");
  };
  const buttonList = [
    selected?.length == 0 && (
      <Tooltip key="add" title="추가">
        <IconButton edge="end" sx={{color: "white"}} onClick={onMovePage}>
          <AddIcon />
        </IconButton>
      </Tooltip>
    ),
    selected?.length > 0 && (
      <Tooltip key="usey" title="사용">
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
      <Tooltip key="usen" title="미사용">
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
  return (
    <>
      <CheckedList list={list} selected={selected} setSelected={setSelected} />
    </>
  );
}
