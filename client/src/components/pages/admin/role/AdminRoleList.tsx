import {useEffect, useState} from "react";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {useAdminRoleUserListQuery} from "@recoils/admin/role/query";
import {AppBar, Box, IconButton, Toolbar, Tooltip} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import UserListDialog from "./dialog/UserListDialog";
import CheckedList from "./list/CheckedList";
import AdminGnb from "@layout/AdminGnb";
import {api} from "@recoils/common";
import {deleteAdminRoleUser, postAdminRoleUser} from "@recoils/admin/role/axios";
const roleid = "ADMIN";
export default function AdminRoleList() {
  const [selected, setSelected]: any = useState([]);
  const [open, setOpen] = useState(false);
  const [list, setList]: any = useState([]);
  const {isLoading, isError, data, error} = useAdminRoleUserListQuery();
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
  const handleAddItems = async (items: any) => {
    const uids = items?.map((user: any) => user?.userid);
    await postAdminRoleUser(roleid, {uids});
    setList(items);
  };

  const handleRemoveItems = async () => {
    await Promise.all(selected.map((obj: any) => deleteAdminRoleUser(roleid, obj?.userid)));
    const selectedIds = new Set(selected.map((obj: any) => obj?.userid));
    setList(list.filter((item: any) => !selectedIds.has(item?.userid)));
    setSelected([]);
  };

  return (
    <AdminGnb RightButtons={<RightButtons selected={selected} setOpen={setOpen} handleRemoveItems={handleRemoveItems} />}>
      <MainPane list={list} selected={selected} setSelected={setSelected} open={open} setOpen={setOpen} handleAddItems={handleAddItems} />
    </AdminGnb>
  );
}
function RightButtons({selected, setOpen, handleRemoveItems}: any) {
  const buttonList = [
    selected?.length == 0 && (
      <Tooltip key={"add"} title="추가">
        <IconButton edge="end" sx={{color: "inherit"}} onClick={() => setOpen(true)}>
          <AddIcon />
        </IconButton>
      </Tooltip>
    ),
    selected?.length > 0 && (
      <Tooltip key={"del"} title="삭제">
        <IconButton edge="end" sx={{color: "inherit"}} onClick={handleRemoveItems}>
          <RemoveIcon />
        </IconButton>
      </Tooltip>
    ),
  ].filter(Boolean);
  return <> {buttonList}</>;
}
function MainPane({list, selected, setSelected, open, setOpen, handleAddItems}: any) {
  return (
    <>
      <CheckedList list={list} selected={selected} setSelected={setSelected} />
      <UserListDialog initItems={list} open={open} setOpen={setOpen} handleAddItems={handleAddItems} />
    </>
  );
}
