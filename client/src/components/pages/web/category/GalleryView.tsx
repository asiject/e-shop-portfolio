import {Box} from "@mui/material";
import {CardForCategory} from "@web/common/Card";

export default function GalleryView({list}: {list: any}) {
  return (
    <Box
      component={"ul"}
      sx={{
        display: "flex",
        overflow: "auto",
        flexWrap: "wrap",
        marginLeft: "-5px",
        marginRight: "-5px",
      }}>
      {list?.map((item: any) => {
        return <CardForCategory key={item.productid} item={item} />;
      })}
    </Box>
  );
}
