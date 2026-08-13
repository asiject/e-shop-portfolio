import MCard from "@mobile/common/MCard";
import {Box} from "@mui/material";
import {MStyles} from "@styles";
export default function GalleryView({list}: any) {
  return (
    <Box component={"ul"} sx={MStyles.cardList}>
      {list &&
        list.map((data: any) => {
          return <MCard key={data.id} list={data} />;
        })}
    </Box>
  );
}
