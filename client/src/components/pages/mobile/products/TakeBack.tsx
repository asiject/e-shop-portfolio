import {Box, TableContainer, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {MStyles} from "@styles";
export default function Takeback({id}: {id: string}) {
  return (
    <TableContainer id={id} sx={MStyles.takeBack}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={4} sx={{textAlign: "center"}}>
              <Box>1958샵 반품/교환 안내</Box>
              <Box component={"span"}>
                반품 시 먼저 판매자와 연락하셔서 반품 사유, 택배사, 반품지 주소 등을 협의하신 후 반품상품을 발송해 주시기 바랍니다.
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>판매자 지정 택배사</TableCell>
            <TableCell colSpan={3}>로젠택배</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>반품 배송비</TableCell>
            <TableCell>편도 3,000원 (최소 배송비 무료인 경우 6,000원 부과)</TableCell>
            <TableCell>교환 배송비</TableCell>
            <TableCell>6,000원</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>보내실 곳</TableCell>
            <TableCell colSpan={3}>서울특별시 종로구 백석동1길 11 부암동 1층 (우: 03020)</TableCell>
          </TableRow>
          <TableRow>
            <TableCell rowSpan={2}>반품/교환 사유에 따른 요청 가능 기간</TableCell>
            <TableCell colSpan={3}>
              구매자 단순 변심은 상품 수령 후 7일 이내 <Box component={"span"}>(구매자 반품배송비 부담)</Box>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={3}>
              표시/광고와 상이, 계약 내용과 다르게 이행된 경우 상품 수령 후 3개월 이내 혹은 표시/광고와 다른 사실을 안 날로부터 30일 이내{" "}
              <Box component={"span"}>(판매자 반품 배송비 부담)</Box>
              <br />둘 중 하나 경과 시 반품/교환 불가
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>반품/교환 불가능 사유</TableCell>
            <TableCell colSpan={3}>
              <Box component={"ol"} sx={{li: {listStyle: "number"}}}>
                <Box component={"li"}>반품 요청 기간이 지난 경우</Box>
                <Box component={"li"}>
                  구매자의 책임 있는 사유로 상품 등이 멸실 또는 훼손된 경우<Box component={"span"}></Box>단, 상품의 내용을 확인하기 위하여 포장 등을
                  훼손한 경우는 제외
                </Box>
                <Box component={"li"}>
                  구매자의 책임있는 사유로 포장이 훼손되어 상품 가치가 현저시 상실된 경우
                  <Box component={"span"}>(예 : 식품, 화장품, 향수류, 음반 등)</Box>
                </Box>
                <Box component={"li"}>
                  구매자의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히 감소한 경우
                  <Box component={"span"}>(라벨이 떨어진 의류 또는 태그가 떨어진 명품관 상품인 경우)</Box>
                </Box>
                <Box component={"li"}>시간의 경과에 의하여 재판매가 곤란할 정도로 상품 등의 가치가 현저히 감소한 경우</Box>
                <Box component={"li"}>
                  고객의 요청사항에 맞춰 제작에 들어가는 맞춤제작상품의 경우
                  <Box component={"span"}>
                    (판매자에게 회복불가능한 손해가 예상되고, 그러한 예정으로 청약철회권 행사가 불가하다는 사실을 서면 동의 받은 경우
                  </Box>
                </Box>
                <Box component={"li"}>
                  복제가 가능한 상품 등의 포장을 훼손한 경우
                  <Box component={"span"}>(CD/DVD/GAME/도서의 경우 포장 개봉시)</Box>
                </Box>
              </Box>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
