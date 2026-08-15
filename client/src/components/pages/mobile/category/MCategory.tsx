import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import {Box} from "@mui/material";

import GalleryView from "./GalleryView";
import {useProductListByCategoryidQuery} from "@recoils/product/query";
import Error from "@layout/Error";
import ProductListSkeleton from "@layout/ProductListSkeleton";
import NoData from "@web/common/NoData";
import {MStyles} from "@styles";

const SKELETON_COUNT = 4;

export default function MCategory() {
  const [list, setList] = useState([]);
  const {id} = useParams();
  const [title, setTitle] = useState("");
  const {isLoading, isError, data, error} = useProductListByCategoryidQuery(Number(id));

  useEffect(() => {
    if (!data) {
      return;
    }
    if (data.length === 0) {
      setList([]);
      setTitle("");
      return;
    }
    setList(
      data.map(({product}: any) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        thumbnail: product.thumbnail,
        cost: product.cost,
        capacity: product.capacity,
        option: product.option,
      })),
    );
    setTitle(data[0].category ? data[0].category.title : "");
  }, [data]);

  if (isError) {
    return <Error error={error} />;
  }

  // list state는 effect 이후에 채워지므로 빈 여부는 data 기준으로 판별
  const isEmpty = !isLoading && (!data || data.length === 0);

  return (
    <Box sx={MStyles.category}>
      <Box sx={MStyles.categoryTitleBox}>
        <Box component="h1" sx={{margin: 0}}>
          {title}
        </Box>
      </Box>
      {isLoading ? (
        <ProductListSkeleton count={SKELETON_COUNT} variant="mobile" />
      ) : isEmpty ? (
        <NoData />
      ) : (
        <>
          <GalleryView list={list} />
          <Paging />
        </>
      )}
    </Box>
  );
}

function Paging() {
  return <>paging</>;
}
