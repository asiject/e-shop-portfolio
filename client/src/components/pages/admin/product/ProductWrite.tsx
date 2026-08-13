import {Box, MenuItem, Select, TextField} from "@mui/material";
import {AppBar, Toolbar, IconButton, Tooltip, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";

//기존 상품 정보 추가페이지 참고
export default function ProductWrite() {
  const navigate = useNavigate();
  const handlePrev = () => {
    navigate("/admin/product");
  };
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton sx={{color: "white"}} edge="start" onClick={handlePrev}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
            상품추가
          </Typography>
          <RightButtons />
        </Toolbar>
      </AppBar>

      <MainPane />
    </>
  );
}
function RightButtons() {
  const {id} = useParams();
  const buttonList = [
    id == undefined && (
      <Tooltip key={"save"} title="save">
        <IconButton edge="end" sx={{color: "white"}}>
          <CheckIcon />
        </IconButton>
      </Tooltip>
    ),
    id != undefined && (
      <Tooltip key={"edit"} title="edit">
        <IconButton edge="end" sx={{color: "white"}}>
          <EditIcon />
        </IconButton>
      </Tooltip>
    ),
  ].filter(Boolean);
  return <>{buttonList}</>;
}

const handleCategory = (e: any) => {
  console.log(
    "handleCategory > ",
    [...e.target.options]?.filter((option: any) => option.selected),
  );
};
function MainPane() {
  return (
    <Box
      sx={{
        p: 3,
        ".rows": {display: "flex"},
        ".header": {width: "100px", padding: "20px 0"},
        ".value": {width: "calc(100% - 100px)", display: "flex", alignItems: "center"},
      }}>
      <Box className="rows">
        <Box className="header">카테고리</Box>
        <Box className="value" sx={{height: "200px"}}>
          <Select multiple rows={5} native onChange={handleCategory} sx={{height: "150px"}}>
            {["전체상품", "휴대폰악세사리", "문구&팬시", "CCC굿즈", "전도도구"].map((value: any) => (
              <option key={value}>{value}</option>
            ))}
          </Select>
        </Box>
      </Box>
      <Box className="rows">
        <Box className="header">상품명</Box>
        <Box className="value">
          <TextField size="small" fullWidth />
        </Box>
      </Box>
      <Box className="rows">
        <Box className="header">판매가</Box>
        <Box className="value">
          <TextField size="small" fullWidth />
        </Box>
      </Box>
      <Box className="rows">
        <Box className="header">재고수량</Box>
        <Box className="value">
          <TextField size="small" fullWidth />
        </Box>
      </Box>
      <Box className="rows">
        <Box className="header">옵션</Box>
        <Box className="value">옵션입력 테이블</Box>
      </Box>
      <Box className="rows">
        <Box className="header">상품 이미지</Box>
        <Box className="value">대표이미지</Box>
      </Box>
      <Box className="rows">
        <Box className="value">대표이미지</Box>
      </Box>
      <Box className="rows">
        <Box>에디터</Box>
      </Box>
      {/* 
        배송비 
        배송비 조건
        반품 배송비
        교환 배송비
        반품/교환지
        AS 전화번호
      */}
    </Box>
  );
}
