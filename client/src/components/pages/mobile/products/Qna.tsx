import React, {useState} from "react";
import {Box, Button, TableContainer, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import QnaEdit from "./div/QnaEdit";
import {MStyles} from "@styles";
export default function Qna({id}: {id: string}) {
  const [open, setOpen] = useState(false);
  return (
    <Box id={id} sx={{height: "500px"}}>
      <Box>상품문의</Box>
      <Box>구매하시려는 상품에 대해 궁금한 점이 있으신 경우 문의해주세요.</Box>
      <Box>
        <Button variant={"outlined"} onClick={() => setOpen(true)} sx={{marginRight: "10px"}}>
          상품 Q&amp;A 작성하기
        </Button>
        <Button variant={"outlined"}>나의 Q&amp;A 조희 &gt;</Button>
      </Box>
      <Box>
        <TableContainer>
          <Table sx={MStyles.w100per}>
            <TableHead>
              <TableRow>
                <TableCell>답변 상태</TableCell>
                <TableCell>제목</TableCell>
                <TableCell>작성자</TableCell>
                <TableCell>작성일</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>답변 완료</TableCell>
                <TableCell>심볼의 의미가 무엇인지 궁금합니다</TableCell>
                <TableCell>김상덕</TableCell>
                <TableCell>2022.05.10</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <QnaEdit open={open} setOpen={setOpen} />
    </Box>
  );
}
