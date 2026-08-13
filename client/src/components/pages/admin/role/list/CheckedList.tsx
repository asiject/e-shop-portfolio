import {Checkbox, List, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import NoData from "@web/common/NoData";

export default function CheckedList({list, selected, setSelected}: any) {
  const handleItem = (user: any) => {
    const idx = selected?.findIndex((item: any) => item?.userid == user?.userid);
    if (idx > -1) {
      setSelected([...selected.slice(0, idx), ...selected.slice(idx + 1, selected?.length)]);
    } else {
      setSelected([...selected, user]);
    }
  };

  return (
    <List>
      <Items list={list} selected={selected} handleItem={handleItem} />
    </List>
  );
}
function Items({list, selected, handleItem}: any) {
  if (list?.length == 0) {
    return <NoData />;
  }
  return list?.map((item: any) => (
    <ListItemButton key={item?.userid} onClick={() => handleItem(item)}>
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={selected?.find((obj: any) => obj?.userid == item?.userid) ? true : false}
          tabIndex={-1}
          disableRipple
          inputProps={{"aria-labelledby": item?.userid}}
        />
      </ListItemIcon>
      <ListItemText primary={item?.username} secondary={item?.logins?.map((login: any) => login?.email)} />
    </ListItemButton>
  ));
}
