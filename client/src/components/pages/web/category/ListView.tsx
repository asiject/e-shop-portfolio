import {Box} from "@mui/material";
import {CardForCategory} from "@web/common/Card";
import {Styles} from "@styles";

export default function ListView({list}: {list: any}) {
  const styles = Styles();
  return (
    <Box component={"ul"} sx={styles.listViewBox}>
      {list.map((item: any) => {
        return <CardForCategory key={item.id} item={item} />;
      })}
    </Box>
  );
}
