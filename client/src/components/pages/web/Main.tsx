import Error from "@layout/Error";
import ProductListSkeleton from "@layout/ProductListSkeleton";
import {Box} from "@mui/material";
import {useProductListQuery} from "@recoils/product/query";
import {Styles} from "@styles";
import Card from "./common/Card";
import NoData from "./common/NoData";

const SKELETON_COUNT = 4;

export default function Main() {
  const styles = Styles();
  const {isLoading, isError, data, error} = useProductListQuery();

  if (isError) {
    return <Error error={error} />;
  }

  const isEmpty = !isLoading && (!data || data.length === 0);

  return (
    <>
      <Box sx={styles.container}>
        <Box component="h1" sx={styles.newGoodsHeader}>
          신상품
        </Box>
        {isLoading ? (
          <ProductListSkeleton count={SKELETON_COUNT} variant="web" />
        ) : isEmpty ? (
          <>
            <ProductListSkeleton count={SKELETON_COUNT} variant="web" />
            <NoData />
          </>
        ) : (
          <Box component={"ul"} sx={styles.newGoods}>
            {data.map((item: any) => {
              return <Card key={item.id} item={item} />;
            })}
          </Box>
        )}
      </Box>
    </>
  );
}
