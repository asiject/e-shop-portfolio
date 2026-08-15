import React, {useEffect, useState} from "react";
import Error from "@layout/Error";
import Loading from "@layout/Loading";
import {AppBar, Button, Dialog, IconButton, Slide, Toolbar, Typography} from "@mui/material";
import {TransitionProps} from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import {useProductListQuery} from "@recoils/product/query";
import ProductList from "../list/ProductList";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProductListDialog({initItems, open, setOpen, handleAddItems}: any) {
  const [selected, setSelected]: any = useState(initItems);
  const {isLoading, isError, data, error} = useProductListQuery();
  useEffect(() => {
    setSelected(initItems);
  }, [open, initItems]);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }

  const handleClose = () => {
    setOpen(false);
  };
  const handleSave = () => {
    if (selected?.length == 0) {
      alert("아이템을 선택해주세요");
      return false;
    }
    setOpen(false);
    handleAddItems(selected);
  };
  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar sx={{position: "relative"}}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div"></Typography>
          <Button autoFocus color="inherit" onClick={handleSave}>
            추가
          </Button>
        </Toolbar>
      </AppBar>
      <ProductList list={data} selected={selected} setSelected={setSelected} />
    </Dialog>
  );
}
