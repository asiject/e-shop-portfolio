import {Box} from "@mui/material";
import {useEffect, useState} from "react";
import {useProductListQuery} from "@recoils/product/query";
import MCard from "@mobile/common/MCard";
import Error from "@layout/Error";
import ProductListSkeleton from "@layout/ProductListSkeleton";
import NoData from "@web/common/NoData";
import {MStyles} from "@styles";

const SKELETON_COUNT = 4;

export default function MMain() {
  const [list, setList] = useState([]);
  const {isLoading, isError, data, error} = useProductListQuery();

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

  if (isError) {
    return <Error error={error} />;
  }

  // list state는 effect 이후에 채워지므로 빈 여부는 data 기준으로 판별
  const isEmpty = !isLoading && (!data || data.length === 0);

  return (
    <>
      <Box sx={MStyles.container}>
        <Box component="h1" sx={MStyles.newGoodsHeader}>
          신상품
        </Box>
        {isLoading ? (
          <ProductListSkeleton count={SKELETON_COUNT} variant="mobile" />
        ) : isEmpty ? (
          <NoData />
        ) : (
          <Box component={"ul"} sx={MStyles.cardList}>
            {list.map((item: any) => {
              return <MCard key={item.id} list={item} />;
            })}
          </Box>
        )}
      </Box>
    </>
  );
}
