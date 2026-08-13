import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {Box, TextField} from "@mui/material";

export default function QnaEdit({open, setOpen}: any) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title" sx={{display: "flex"}}>
          <Box>상품 Q&amp;A 작성하기</Box>
          <Box sx={{marginLeft: "auto", cursor: "pointer"}} onClick={() => handleClose()}>
            X
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{
            width: "400px",
            minHeight: "420px",
            borderTop: "1px solid #ddd",
            padding: "0 24px",
          }}>
          <Box sx={{padding: "8px"}}>
            <TextField label="문의하실 내용을 입력하세요" multiline rows="5" sx={{width: "100%", height: "300px"}} />
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
            등록
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
