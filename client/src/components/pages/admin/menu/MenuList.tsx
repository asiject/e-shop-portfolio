import {useEffect, useState} from "react";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {Box, IconButton, Tooltip} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckedList from "./list/CheckedList";
import AdminGnb from "@layout/AdminGnb";
import {useAdminMenuListQuery} from "@recoils/admin/menu/query";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddMenuDialog from "./dialog/AddMenuDialog";
import {deleteAdminMenu, postAdminMenu, putMenuUseYn} from "@recoils/admin/menu/axios";
import {useQueryClient} from "react-query";

export default function MenuList() {
  const queryClient = useQueryClient();
  const [selected, setSelected]: any = useState([]);
  const [open, setOpen] = useState(false);
  const [list, setList]: any = useState([]);
  const {isLoading, isError, data, error} = useAdminMenuListQuery();

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

  const handleAddItem = async (item: {title: string; url: string}) => {
    const sortno = (list?.length || 0) + 1;
    const {data: created} = await postAdminMenu({title: item.title, url: item.url, useyn: "Y", sortno});
    setList((prev: any[]) => [...prev, created]);
    queryClient.invalidateQueries("getAdminMenuList");
  };

  const handleRemoveItems = async () => {
    if (!selected?.length) return;
    if (!confirm(`선택한 ${selected.length}개 메뉴를 삭제할까요?`)) return;
    try {
      await Promise.all(selected.map((item: any) => deleteAdminMenu(Number(item.id))));
      const ids = new Set(selected.map((item: any) => item.id));
      setList((prev: any[]) => prev.filter(item => !ids.has(item.id)));
      setSelected([]);
      queryClient.invalidateQueries("getAdminMenuList");
    } catch (err) {
      console.error(err);
      alert("메뉴 삭제에 실패했습니다");
    }
  };

  const handleItemUseYn = async (useyn: string) => {
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
    queryClient.invalidateQueries("getAdminMenuList");
  };

  return (
    <AdminGnb
      RightButtons={<RightButtons selected={selected} setOpen={setOpen} handleRemoveItems={handleRemoveItems} handleItemUseYn={handleItemUseYn} />}>
      <MainPane list={list} selected={selected} setSelected={setSelected} open={open} setOpen={setOpen} handleAddItem={handleAddItem} />
    </AdminGnb>
  );
}

function RightButtons({selected, setOpen, handleRemoveItems, handleItemUseYn}: any) {
  return (
    <Box marginLeft={"auto"} sx={{display: "flex"}}>
      {selected?.length === 0 ? (
        <Tooltip title="추가">
          <IconButton edge="end" sx={{color: "inherit"}} onClick={() => setOpen(true)}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          <Tooltip title="삭제">
            <IconButton edge="end" sx={{color: "inherit"}} onClick={handleRemoveItems}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="사용">
            <IconButton edge="end" sx={{color: "inherit"}} onClick={() => handleItemUseYn("Y")}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="미사용">
            <IconButton edge="end" sx={{color: "inherit"}} onClick={() => handleItemUseYn("N")}>
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
      <CheckedList key={(list ?? []).map((i: any) => i?.id).join("-") || "empty"} list={list} selected={selected} setSelected={setSelected} />
      <AddMenuDialog open={open} setOpen={setOpen} handleAddItem={handleAddItem} />
    </>
  );
}
