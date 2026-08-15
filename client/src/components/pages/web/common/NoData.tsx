import {Box} from "@mui/material";
import {kraft} from "theme/kraft";

export default function NoData() {
  return (
    <Box sx={{textAlign: "center", padding: "28px 0", color: kraft.mute, fontWeight: 700}}>
      진열된 로트가 없습니다.
    </Box>
  );
}
