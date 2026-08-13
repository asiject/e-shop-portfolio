import {Checkbox, IconButton, List, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import NoData from "@web/common/NoData";
import {useIntl} from "react-intl";
import MenuIcon from "@mui/icons-material/Menu";
import {arrayMove, SortableContainer, SortableContainerProps, SortableElement, SortableElementProps, SortableHandle} from "react-sortable-hoc";
import {useEffect, useState} from "react";
import {putMenuSortno} from "@recoils/admin/menu/axios";

//draggable
export default function CheckedList({list, selected, setSelected}: any) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (items?.length == 0 && list?.length != 0) {
      setItems(list);
    }
  }, [list]);

  const onSortEnd = async ({oldIndex, newIndex}: {oldIndex: number; newIndex: number}) => {
    const sorted = arrayMove(items, oldIndex, newIndex);
    setItems(arrayMove(items, oldIndex, newIndex));
    const menues = sorted?.map((value: any, idx: number) => {
      return {
        id: value?.id,
        sortno: idx + 1,
      };
    });
    await putMenuSortno(menues);
  };
  return <SortableList items={items} selected={selected} setSelected={setSelected} onSortEnd={onSortEnd} useDragHandle={true} />;
}
function Items({list, selected, handleItem}: any) {
  const {formatMessage} = useIntl();

  if (list?.length == 0) {
    return <NoData />;
  }
  return list?.map((item: any) => (
    <ListItemButton key={item?.id} onClick={() => handleItem(item)} selected={item?.useyn == "N"}>
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={selected?.find((obj: any) => obj?.id == item?.id) ? true : false}
          tabIndex={-1}
          disableRipple
          inputProps={{"aria-labelledby": item?.userid}}
        />
      </ListItemIcon>
      <ListItemText primary={formatMessage({id: item?.title})} secondary={item?.url} />
      {/* [SHOP-27] draggable 기능 달아야 순서 정함 */}
      <ListItemIcon>
        <MenuIcon />
      </ListItemIcon>
    </ListItemButton>
  ));
}

const SortableItem: React.ComponentClass<SortableElementProps & {value: any; selected: any; setSelected: any}, any> = SortableElement(
  ({value, selected, setSelected}: {value: any; selected: any; setSelected: any}) => {
    const {formatMessage} = useIntl();

    const DragIcon = SortableHandle(() => (
      <ListItemIcon>
        <IconButton>
          <MenuIcon />
        </IconButton>
      </ListItemIcon>
    ));
    const handelChecked = (e: any) => {
      const idx = selected?.findIndex((item: any) => item?.id == value?.id);
      if (idx > -1) {
        setSelected([...selected.slice(0, idx), ...selected.slice(idx + 1, selected?.length)]);
      } else {
        setSelected([...selected, value]);
      }

      e.stopPropagation();
    };
    return (
      <ListItemButton key={value?.id} selected={value?.useyn == "N"}>
        {/* [SHOP-27] draggable 기능 달아야 순서 정함 */}
        <ListItemIcon onClick={handelChecked}>
          <Checkbox checked={selected?.findIndex((item: any) => item?.id == value?.id) > -1} />
        </ListItemIcon>
        <ListItemText primary={formatMessage({id: value?.title})} secondary={value?.url} />
        <DragIcon />
      </ListItemButton>
    );
  },
);

const SortableList: React.ComponentClass<SortableContainerProps & {items: any[]; selected: any; setSelected: any}, any> = SortableContainer(
  ({items, selected, setSelected}: {items: any[]; selected: any[]; setSelected: any}) => {
    return (
      <List>
        {items.map((value, index) => (
          <SortableItem key={`item-${value?.id}`} index={index} value={value} selected={selected} setSelected={setSelected} />
        ))}
      </List>
    );
  },
);
