import {useEffect, useState} from "react";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {IconButton, Tooltip} from "@mui/material";
import CheckedList from "./list/CheckedList";
import AdminGnb from "@layout/AdminGnb";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import {useProductListQuery} from "@recoils/product/query";
import AddIcon from "@mui/icons-material/Add";
import {useNavigate} from "react-router";
import {deleteAdminProduct, putProductSortno} from "@recoils/admin/product/axios";
import {useQueryClient} from "react-query";

export default function ProductList() {
  const queryClient = useQueryClient();
  const [selected, setSelected]: any = useState([]);
  const [list, setList]: any = useState([]);
  const {isLoading, isError, data, error} = useProductListQuery();

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

  const handleRemoveItems = async () => {
    if (!selected?.length) return;
    if (!confirm(`선택한 ${selected.length}개 상품을 삭제할까요?`)) return;
    try {
      await Promise.all(selected.map((item: any) => deleteAdminProduct(Number(item.id))));
      const selectedIds = new Set(selected.map((item: any) => item.id));
      setList((prev: any[]) => prev.filter(item => !selectedIds.has(item.id)));
      setSelected([]);
      queryClient.invalidateQueries("getProductList");
    } catch (err) {
      console.error(err);
      alert("상품 삭제에 실패했습니다");
    }
  };

  const handleItemUseYn = async (showyn: string) => {
    const products = selected?.map((item: any) => {
      return {id: item?.id, showyn};
    });
    await putProductSortno(products);

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
    <AdminGnb RightButtons={<RightButtons selected={selected} handleRemoveItems={handleRemoveItems} handleItemUseYn={handleItemUseYn} />}>
      <MainPane list={list} selected={selected} setSelected={setSelected} />
    </AdminGnb>
  );
}

function RightButtons({selected, handleRemoveItems, handleItemUseYn}: any) {
  const navigate = useNavigate();
  const onMovePage = () => {
    navigate("/admin/product/write");
  };
  const buttonList = [
    selected?.length == 0 && (
      <Tooltip key="add" title="추가">
        <IconButton edge="end" sx={{color: "inherit"}} onClick={onMovePage}>
          <AddIcon />
        </IconButton>
      </Tooltip>
    ),
    selected?.length > 0 && (
      <Tooltip key="delete" title="삭제">
        <IconButton edge="end" sx={{color: "inherit"}} onClick={handleRemoveItems}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    ),
    selected?.length > 0 && (
      <Tooltip key="usey" title="사용">
        <IconButton
          edge="end"
          sx={{color: "inherit"}}
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
          sx={{color: "inherit"}}
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
