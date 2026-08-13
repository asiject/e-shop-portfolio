import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {Box, TextField} from "@mui/material";
import {MStyles} from "@styles";
export default function QnaEdit({open, setOpen}: any) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{div: {width: "100%", paddingLeft: "0", paddingRight: "0"}, "textarea, fieldset": {width: "95%", padding: "2.5%", borderRadius: 0}}}>
        <DialogTitle id="alert-dialog-title" sx={{display: "flex", justifyContent: "space-between", div: {width: "fit-content"}}}>
          <Box>상품 Q&amp;A 작성하기</Box>
          <Box sx={{marginLeft: "auto", cursor: "pointer"}} onClick={() => handleClose()}>
            X
          </Box>
        </DialogTitle>
        <DialogContent sx={MStyles.qnaContent}>
          <Box sx={MStyles.qnaTextBox}>
            <TextField label="문의하실 내용을 입력하세요" multiline rows="10" />
          </Box>
          <Box component={"ul"} sx={{padding: "8px 12px 0", paddingInlineStart: "28px"}}>
            <Box component={"li"} sx={{color: "#545454", fontSize: "16px"}}>
              상품 Q&amp;A 작성 유의사항
            </Box>
            <Box component={"ul"} sx={{li: {color: "#959595", fontSize: "13px", listStyle: "square", marginBottom: "4px"}}}>
              <Box component={"li"}>상품 Q&amp;A는 상품 및 상품 구매 과정(배송, 반품/취소, 교환/변경)에 대해 판매자에게 문의하는 ​게시판입니다.</Box>
              <Box component={"li"}>
                상품 및 상품 구매 과정과 관련 없는 비방/욕설/명예훼손성 게시글 및 상품과 관련 없는 광고글 등 부적절한 게시글 등록 시 글쓰기 제한 및
                게시글이 삭제 조치 될 수 있습니다.
              </Box>
              <Box component={"li"}>
                전화번호, 이메일 등 개인 정보가 포함된 글 작성이 필요한 경우 E-SHOP 고객센터 연락처로 문의해 주시기 바랍니다.{" "}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Box sx={MStyles.qnaCancel} onClick={() => handleClose()}>
            취소
          </Box>
          <Box sx={MStyles.qnaAdd}>등록</Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
