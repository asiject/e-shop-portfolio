import {Box, Button} from "@mui/material";
import {MStyles} from "@styles";

const onMove = (id: string) => {
  document.getElementById(id)!.scrollIntoView({behavior: "smooth"});
};

export default function ContentMenubar() {
  return (
    <Box component={"ul"} sx={MStyles.contentMenubar}>
      <Box component={"li"}>
        <Button onClick={() => onMove("info")}>상세 정보</Button>
      </Box>
      <Box component={"li"}>
        <Button onClick={() => onMove("qna")}>상품 문의</Button>
      </Box>
      <Box component={"li"}>
        <Button onClick={() => onMove("takeback")}>교환/환불 정보</Button>
      </Box>
    </Box>
  );
}
