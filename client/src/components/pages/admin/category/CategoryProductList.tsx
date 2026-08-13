import {useEffect, useState} from "react";
import {AppBar, Toolbar, IconButton, Box} from "@mui/material";
import {useCategoryInfoQuery} from "@recoils/category/query";
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
  const {isLoading, isError, data, error} = useCategoryInfoQuery(Number(id));
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
    const formData = {
      pids: items?.map((v: any) => v.id),
    };
    await postCategoryProduct(Number(id), formData);
    // 다이얼로그 선택 결과(전체)를 목록으로 반영
    setList([...(items || [])]);
    setSelected([]);
  };
  const handleRemoveItems = async () => {
    await Promise.all(selected.map((item: any) => deleteCategoryProduct(Number(id), item?.id)));
    const selectedIds = new Set(selected.map((item: any) => item?.id));
    setList(list.filter((item: any) => !selectedIds.has(item?.id)));
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
