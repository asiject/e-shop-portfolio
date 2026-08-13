import {Link} from "react-router-dom";
import {Box} from "@mui/material";
import {numberFormat} from "@utils/Numaric";
import {MStyles} from "@styles";
export default function MCard({list}: any) {
  const {id, title, description, thumbnail, cost, capacity, option} = list;
  return (
    <Box component={"li"} sx={MStyles.card}>
      <Link to={`/m/products/${id}`}>
        <Box sx={MStyles.cardContent}>
          <Box component={"img"} src={thumbnail} />
          <Box sx={MStyles.cardInfo}>
            <Box sx={MStyles.cardTitle}>{title}</Box>
            <Box>
              <strong>{numberFormat(cost)}</strong>
            </Box>
            <Box sx={MStyles.cardDesc}>{description}</Box>
          </Box>
        </Box>
      </Link>
    </Box>
  );
}
