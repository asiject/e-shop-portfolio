import {useEffect, useState} from "react";
import {AppBar, Toolbar, IconButton, Box} from "@mui/material";
import {getCategoryInfoQuery} from "@recoils/category/query";
import {useNavigate, useParams} from "react-router";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import ProductList from "./list/ProductList";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ProductListDialog from "./dialog/ProductListDialog";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {deleteCategoryProduct, postCategoryProduct} from "@recoils/category/axios";
export default function CategoryProductList() {
  const navigate = useNavigate();
  const {id} = useParams();
  const [open, setOpen] = useState(false);
  const [list, setList]: any = useState([]);
  const [selected, setSelected]: any = useState([]);
  const {isLoading, isError, data, error} = getCategoryInfoQuery(Number(id));
  useEffect(() => {
    if (data?.products) {
      setList(data.products?.map((item: any) => item?.product));
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  //[SHOP-32] 전체 선택 일단 기능만..
  const handleAllCheck = (e: any) => {
    if (e.target.checked) {
      setSelected([...list]);
    } else {
      setSelected([]);
    }
  };
  const handleAddItems = async (items: any) => {
    console.log("items >", items);
    const formData = {
      pids: items?.map((v: any) => v.id),
    };
    await postCategoryProduct(Number(id), formData);
    setList([...items]);
    setSelected([]);
  };
  const handleRemoveItems = async () => {
    let removeItems = [...list];
    for (const item of selected) {
      await deleteCategoryProduct(Number(id), item?.id);
      const idx = removeItems?.findIndex((obj: any) => obj?.id == item?.id);
      if (idx > -1) {
        removeItems = [...removeItems.slice(0, idx), ...removeItems.slice(idx + 1, removeItems?.length)];
      }
    }
    setList([...removeItems]);

    setSelected([]);
  };

  const handlePrev = () => {
    navigate(-1);
  };
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" onClick={handlePrev}>
            <ChevronLeftIcon />
          </IconButton>
          <Box sx={{flexGrow: 1}}></Box>
          <RightButtons selected={selected} setSelected={setSelected} setOpen={setOpen} handleRemoveItems={handleRemoveItems} />
        </Toolbar>
      </AppBar>
      <MainPane list={list} selected={selected} setSelected={setSelected} />
      <ProductListDialog initItems={list} open={open} setOpen={setOpen} handleAddItems={handleAddItems} />
    </>
  );
}
function RightButtons({selected, setSelected, setOpen, handleRemoveItems}: any) {
  const {id} = useParams();

  const buttonList = [
    selected?.length == 0 && (
      <IconButton key={"add"} onClick={() => setOpen(true)}>
        <AddIcon />
      </IconButton>
    ),
    selected?.length > 0 && (
      <IconButton key={"remove"} onClick={handleRemoveItems}>
        <RemoveIcon />
      </IconButton>
    ),
  ].filter(Boolean);
  return <>{buttonList} </>;
}
function MainPane({list, selected, setSelected}: any) {
  return <ProductList list={list} selected={selected} setSelected={setSelected} />;
}
