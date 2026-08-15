import {Box, Table, TableBody, TableCell, TableContainer, TableRow} from "@mui/material";
import {kraft} from "theme/kraft";

type ProductTakeBackProps = {
  id: string;
};

const cell = {
  border: `1px solid ${kraft.ink}`,
  color: kraft.ink,
  fontSize: 14,
  backgroundColor: kraft.sticker,
  verticalAlign: "top",
} as const;

const labelCell = {
  ...cell,
  width: 140,
  fontWeight: 700,
  backgroundColor: "#E8D7B4",
} as const;

export default function ProductTakeBack({id}: ProductTakeBackProps) {
  return (
    <Box
      id={id}
      sx={{
        backgroundColor: kraft.sticker,
        border: `2px solid ${kraft.ink}`,
        padding: "28px 24px",
      }}>
      <Box
        component="h2"
        sx={{
          m: 0,
          mb: 1,
          fontFamily: kraft.display,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.03em",
        }}>
        교환/환불
      </Box>
      <Box sx={{mb: 2, color: kraft.mute, fontSize: 14, lineHeight: 1.45}}>
        반품 전 판매자와 사유·택배·반품지를 맞춘 뒤 발송해 주세요.
      </Box>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={labelCell}>지정 택배</TableCell>
              <TableCell sx={cell} colSpan={3}>
                로젠택배
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={labelCell}>반품 배송비</TableCell>
              <TableCell sx={cell}>편도 3,000원 (무료 배송 상품은 6,000원)</TableCell>
              <TableCell sx={labelCell}>교환 배송비</TableCell>
              <TableCell sx={cell}>6,000원</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={labelCell}>보내실 곳</TableCell>
              <TableCell sx={cell} colSpan={3}>
                서울특별시 종로구 백석동1길 11 부암동 1층 (우: 03020)
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={labelCell}>요청 기간</TableCell>
              <TableCell sx={cell} colSpan={3}>
                <Box>단순 변심: 수령 후 7일 이내 (구매자 배송비)</Box>
                <Box sx={{mt: 1}}>
                  표시·계약과 다른 경우: 수령 후 3개월 이내, 또는 안 날부터 30일 이내 (판매자 배송비). 둘 중 하나가 지나면 불가.
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={labelCell}>불가 사유</TableCell>
              <TableCell sx={{...cell, color: kraft.mute}} colSpan={3}>
                <Box component="ol" sx={{m: 0, pl: 2, li: {mb: 0.5}}}>
                  <li>요청 기간이 지난 경우</li>
                  <li>구매자 책임으로 상품이 멸실·훼손된 경우 (내용 확인을 위한 포장 개봉은 제외)</li>
                  <li>포장 훼손으로 가치가 현저히 감소한 경우</li>
                  <li>사용·일부 소비로 가치가 현저히 감소한 경우</li>
                  <li>시간 경과로 재판매가 곤란한 경우</li>
                  <li>맞춤 제작으로 회복 불가능한 손해가 예정된 경우</li>
                  <li>복제 가능 상품의 포장을 훼손한 경우</li>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
