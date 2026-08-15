import {Box, Button} from "@mui/material";
import {Styles} from "@styles";

const onMove = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const offsetPosition = el.getBoundingClientRect().top + window.pageYOffset - 56;
  window.scrollTo({top: offsetPosition, behavior: "smooth"});
};

export default function ContentMenubar() {
  const styles = Styles();
  return (
    <Box component="nav" aria-label="상품 본문">
      <Box component="ul" sx={styles.contentMenubar}>
        <Box component="li">
          <Button onClick={() => onMove("info")}>상세</Button>
        </Box>
        <Box component="li">
          <Button onClick={() => onMove("qna")}>문의</Button>
        </Box>
        <Box component="li">
          <Button onClick={() => onMove("takeback")}>교환/환불</Button>
        </Box>
      </Box>
    </Box>
  );
}
