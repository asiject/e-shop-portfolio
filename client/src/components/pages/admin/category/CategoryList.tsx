import {useEffect, useState} from "react";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {IconButton, Tooltip} from "@mui/material";
import CheckedList from "./list/CheckedList";
import AdminGnb from "@layout/AdminGnb";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {useCategoryListQuery} from "@recoils/category/query";
import AddIcon from "@mui/icons-material/Add";
import AddCategoryDialog from "./dialog/AddCategoryDialog";
import {postCategory, putCategoryUseYn} from "@recoils/category/axios";
import {useQueryClient} from "react-query";

export default function CategoryList() {
  const queryClient = useQueryClient();
  const [selected, setSelected]: any = useState([]);
  const [open, setOpen] = useState(false);
  const [list, setList]: any = useState([]);
  const {isLoading, isError, data, error} = useCategoryListQuery();

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

  const handleAddItem = async (item: {title: string; type: string; link: string}) => {
    const sortno = (list?.length || 0) + 1;
    const {data: created} = await postCategory({
      title: item.title,
      type: item.type,
      link: item.link || "",
      sortno,
      useyn: "Y",
    });
    setList((prev: any[]) => [...prev, created]);
    queryClient.invalidateQueries("getCategoryList");
  };

  const handleItemUseYn = async (useyn: string) => {
    const categories = selected?.map((item: any) => {
      return {id: item?.id, useyn};
    });
    await putCategoryUseYn(categories);
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

function RightButtons({selected, setOpen, handleItemUseYn}: any) {
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
  return <CheckedList key={(list ?? []).map((i: any) => i?.id).join("-") || "empty"} list={list} selected={selected} setSelected={setSelected} />;
}
