import Error from "@layout/Error";
import Loading from "@layout/Loading";
import {Box} from "@mui/material";
import {getProductListQuery} from "@recoils/product/query";
import {Styles} from "@styles";
import Card from "./common/Card";
export default function Main() {
  const styles = Styles();
  const {isLoading, isError, data, error} = getProductListQuery();
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error error={error} />;
  }
  console.log("data >", data);
  return (
    <>
      <Box sx={styles.container}>
        <Box sx={styles.newGoodsHeader}>
          <Box>신상품</Box>
        </Box>
        <Box component={"ul"} sx={styles.newGoods}>
          {data?.map((item: any) => {
            return <Card key={item.id} item={item} />;
          })}
        </Box>
      </Box>
    </>
  );
}
