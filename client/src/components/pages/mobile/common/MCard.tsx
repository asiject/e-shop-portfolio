import {Box} from "@mui/material";
import {MStyles} from "@styles";
import ProductBag from "components/shop/ProductBag";

export default function MCard({list}: any) {
  const {id, title, description, thumbnail, cost} = list;
  return (
    <Box component="li" sx={MStyles.card}>
      <ProductBag id={id} title={title} description={description} thumbnail={thumbnail} cost={cost} to={`/m/products/${id}`} />
    </Box>
  );
}
