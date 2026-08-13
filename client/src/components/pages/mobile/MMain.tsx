import {Box} from "@mui/material";
import React, {useEffect, useState} from "react";
// import MCategory from "../category/MCategory";
import {getProductListQuery} from "@recoils/product/query";
import MCard from "@mobile/common/MCard";
import Loading from "@layout/Loading";
import Error from "@layout/Error";
import {MStyles} from "@styles";
export default function MMain() {
  const [list, setList] = useState([]);
  const {isLoading, isError, data, error} = getProductListQuery();
  useEffect(() => {
    if (data) {
      setList(
        data?.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          thumbnail: p.thumbnail,
          cost: p.cost,
          discountType: p.discountType,
          discountValue: p.discountvalue,
          capacity: p.capacity,
          option: p.option,
        })),
      );
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  return (
    <>
      <Box sx={MStyles.container}>
        <Box>신상품 카테고리별 상품이 아니라 카테고리별 버튼이 들어갈 예정인 거 같기도 하고 일단 문장으로 적어둠</Box>
        <Box component={"ul"} sx={MStyles.cardList}>
          {list &&
            list.map((data: any) => {
              return <MCard key={data.id} list={data} />;
            })}
        </Box>
      </Box>
    </>
  );
}
