import MCard from "@mobile/common/MCard";
import {Box} from "@mui/material";

export default function ListView({list}: any) {
  return (
    <Box component={"ul"} sx={{display: "flex", flexDirection: "column"}}>
      {list.map((data: any) => {
        return <MCard key={data.id} list={data} />;
      })}
    </Box>
  );
}
