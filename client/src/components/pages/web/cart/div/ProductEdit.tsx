import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {Box} from "@mui/material";
import {styles} from "@layout/styles";

export default function ProductEdit({open, setOpen}: {open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title" sx={{display: "flex"}}>
          <Box>주문수정</Box>
          <Box sx={{marginLeft: "auto"}}>X</Box>
        </DialogTitle>
        <DialogContent sx={{width: "400px", minHeight: "420px", borderTop: "1px solid #ddd", padding: "0 24px"}}>
          <Box
            sx={{
              height: "inherit",
              minHeight: "400px",
              marginTop: "24px",
              borderBottom: "1px solid #ddd",
            }}>
            <Box sx={{display: "flex", alignItems: "center", borderBottom: "1px solid #ddd", paddingBottom: "10px"}}>
              <Box sx={{margin: "10px", marginLeft: "0"}}>이미지</Box>
              <Box>
                <Box>타이틀</Box>
                <Box>금액</Box>
              </Box>
            </Box>
            <Box sx={{borderBottom: "1px solid #ddd", padding: "10px 0"}}>
              <Box sx={{display: "flex"}}>
                <Box sx={{width: "120px"}}>배송방법</Box>
                <Box>택배 selectbox</Box>
              </Box>
              <Box sx={{display: "flex"}}>
                <Box sx={{width: "120px"}}>배송비</Box>
                <Box>3,000원</Box>
              </Box>
            </Box>
            <Box sx={{borderBottom: "1px solid #ddd", padding: "10px 0"}}>
              주문상품수량
              <Box sx={{display: "flex"}}>
                <Box>증감</Box>
                <Box sx={styles.mlAuto}>18,000원</Box>
              </Box>
            </Box>
          </Box>
          <Box sx={{margin: "12px 0"}}>
            <Box sx={{display: "flex"}}>
              <Box>상품금액</Box>
              <Box sx={{marginLeft: "auto"}}>18,000원</Box>
            </Box>
            <Box sx={{display: "flex"}}>
              <Box>배송비 </Box>
              <Box sx={{marginLeft: "auto"}}>3000원 </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{padding: "0 24px 24px 24px"}}>
          <Box
            sx={{
              width: "100%",
              textAlign: "center",
              height: "40px",
              lineHeight: "40px",
              border: "1px solid #ddd",
            }}>
            취소
          </Box>
          <Box
            sx={{
              width: "100%",
              textAlign: "center",
              height: "40px",
              lineHeight: "40px",
              backgroundColor: "primary.main",
            }}>
            확인
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
