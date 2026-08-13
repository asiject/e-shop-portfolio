import {Link} from "react-router-dom";

import {Box} from "@mui/material";

import {Styles} from "@styles";
import {numberFormat} from "@utils/Numaric";

export default function Card({item}: {item: any}) {
  const styles = Styles();

  const {id, title, description, thumbnail, cost} = item;
  return (
    <Box component={"li"} sx={styles.card}>
      <Link to={`/products/${id}`}>
        <Box sx={styles.cardContent}>
          <Box sx={{width: "226px", margin: "0 auto"}}>
            <Box component={"img"} src={thumbnail} />
            <Box sx={styles.cardTitle}>{title}</Box>
            <Box>
              <strong>{numberFormat(cost)}</strong>
            </Box>
            <Box>{description}</Box>
          </Box>
        </Box>
      </Link>
    </Box>
  );
}

export function CardForCategory({item}: {item: any}) {
  const styles = Styles();

  const {productid} = item;
  const {title, description, thumbnail, cost} = item.product;
  return (
    <Box component={"li"} sx={styles.card}>
      <Link to={`/products/${productid}`}>
        <Box sx={styles.cardContent}>
          <Box component={"img"} src={thumbnail} />
          <Box sx={styles.cardTitle}>{title}</Box>
          <Box>
            <strong>{numberFormat(cost)}</strong>
          </Box>
          <Box>{description}</Box>
        </Box>
      </Link>
    </Box>
  );
}
