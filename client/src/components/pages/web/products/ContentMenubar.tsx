import {Box, Button} from "@mui/material";
import {Styles} from "@styles";

const onMove = (id: string) => {
  let offsetPosition = document.getElementById(id)!.getBoundingClientRect().top + window.pageYOffset - 115;
  // 115 = offset(height) = contentMenubar + (scrolled) productDetail
  window.scrollTo({top: offsetPosition, behavior: "smooth"});
};

export default function ContentMenubar() {
  const styles = Styles();
  return (
    <Box component={"ul"} sx={styles.contentMenubar}>
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
