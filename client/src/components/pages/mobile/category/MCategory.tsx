import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useRecoilState} from "recoil";

import {Box} from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GridViewIcon from "@mui/icons-material/GridView";

import GalleryView from "./GalleryView";
import ListView from "./ListView";
import {getProductListByCategoryidQuery} from "@recoils/product/query";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {MStyles} from "@styles";

export default function MCategory() {
  const [list, setList] = useState([]);
  // const [getProductListByCategoryidQuery, setProductListByCategoryidQuery] = useRecoilState(productListByCategoryidQuery);
  const {id} = useParams();
  const [title, setTitle] = useState("");
  const [listView, setListView] = useState("gallery");
  const [sort, setSort] = useState("1");
  const {isLoading, isError, data, error} = getProductListByCategoryidQuery(Number(id));
  useEffect(() => {
    if (data) {
      productListFunc(data);
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  async function productListFunc(data: any) {
    if (data.length > 0) {
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
      if (data[0].category) {
        setTitle(data[0].category.title);
      } else {
        setTitle("");
      }
    }
  }

  return (
    <Box sx={MStyles.category}>
      <Box sx={MStyles.categoryTitleBox}>
        <Box>{title}</Box>
      </Box>
      {/* <ContentArea listView={listView} data={list} /> */}
      <GalleryView list={list} />
      <Paging />
    </Box>
  );
}

function Paging() {
  return <>paging</>;
}
