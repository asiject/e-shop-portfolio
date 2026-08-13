import {Box} from "@mui/material";
import {Styles} from "@styles";
import ProductBag from "components/shop/ProductBag";

export default function Card({item}: {item: any}) {
  const styles = Styles();
  const {id, title, description, thumbnail, cost} = item;
  return (
    <Box component="li" sx={styles.card}>
      <ProductBag id={id} title={title} description={description} thumbnail={thumbnail} cost={cost} to={`/products/${id}`} />
    </Box>
  );
}

export function CardForCategory({item}: {item: any}) {
  const styles = Styles();
  const {productid} = item;
  const {id, title, description, thumbnail, cost} = item.product;
  return (
    <Box component="li" sx={styles.card}>
      <ProductBag
        id={id ?? productid}
        title={title}
        description={description}
        thumbnail={thumbnail}
        cost={cost}
        to={`/products/${productid}`}
      />
    </Box>
  );
}
