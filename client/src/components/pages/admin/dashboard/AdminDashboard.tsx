import {Box, Grid} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AdminGnb from "@layout/AdminGnb";

export default function AdminDashboard() {
  return (
    <>
      <AdminGnb>
        <MainPane />
      </AdminGnb>
    </>
  );
}
function MainPane() {
  return (
    <Box sx={{p: 3}}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              ".box": {
                width: "160px",
                height: "150px",
                border: "1px solid black",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "40px",
              },
              height: "100%",
              border: "1px solid black",
            }}>
            <Box sx={{display: "flex", padding: "10px 20px"}}>
              <Box>주문/배송(최근 1주일)</Box>
              <Box sx={{marginLeft: "auto", display: "flex", gap: "5px", alignItems: "center"}}>
                <Box>11:29</Box>
                <RefreshIcon />
              </Box>
            </Box>
            <Box sx={{display: "flex", gap: "20px", padding: "10px", justifyContent: "center"}}>
              <Box className="box">
                <Box>무통장입금</Box>
                <Box>0건</Box>
              </Box>
              <Box className="box">
                <Box>신규주문</Box>
                <Box>0건</Box>
              </Box>
              <Box className="box">
                <Box>배송준비</Box>
                <Box>0건</Box>
              </Box>
              <Box className="box">
                <Box>발송완료</Box>
                <Box>0건</Box>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              height: "100%",
              border: "1px solid black",
            }}>
            <Box sx={{display: "flex", padding: "10px 20px"}}>
              <Box>클레임</Box>
              <Box sx={{marginLeft: "auto", display: "flex", gap: "5px", alignItems: "center"}}>
                <Box>11:29</Box>
                <RefreshIcon />
              </Box>
            </Box>
            <Box sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  width: "350px",
                  padding: "0 20px",
                  marginTop: "10px",
                  ".line": {display: "flex", alignItems: "center", border: "1px solid black", height: "40px", padding: "0 10px"},
                }}>
                <Box className="line">
                  <Box>취소요청</Box>
                  <Box sx={{marginLeft: "auto"}}>0건</Box>
                </Box>
                <Box className="line">
                  <Box>반품요청</Box>
                  <Box sx={{marginLeft: "auto"}}>0건</Box>
                </Box>
                <Box className="line">
                  <Box>교환요청</Box>
                  <Box sx={{marginLeft: "auto"}}>0건</Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={3}>
          <Box
            sx={{
              height: "100%",
              border: "1px solid black",
            }}>
            <Box sx={{display: "flex", padding: "10px 20px"}}>
              <Box>정산</Box>
              <Box sx={{marginLeft: "auto", display: "flex", gap: "5px", alignItems: "center"}}>
                <Box>11:29</Box>
                <RefreshIcon />
              </Box>
            </Box>
            <Box sx={{padding: "10px 20px"}}>
              <Box
                sx={{
                  display: "flex",
                  gap: "10px",
                  ".box": {
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid black",
                    width: "100%",
                    height: "100px",
                    padding: "20px",
                    alignItems: "center",
                    gap: "10px",
                  },
                }}>
                <Box className="box">
                  <Box>페이공제</Box>
                  <Box>0건</Box>
                </Box>
                <Box className="box">
                  <Box>무통장</Box>
                  <Box>0건</Box>
                </Box>
              </Box>
              <Box sx={{marginTop: "10px", ".line": {display: "flex"}}}>
                <Box className="line">
                  <Box>총 매출</Box>
                  <Box sx={{marginLeft: "auto"}}>0원</Box>
                </Box>
                <Box className="line">
                  <Box>장부</Box>
                  <Box sx={{marginLeft: "auto"}}>0원</Box>
                </Box>
                <Box className="line">
                  <Box>무통장</Box>
                  <Box sx={{marginLeft: "auto"}}>0원</Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid>
            <Box sx={{border: "1px solid black", height: "400px"}}>공지사항</Box>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{border: "1px solid black", height: "400px"}}>문의사항</Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{border: "1px solid black", height: "400px"}}>자유게시판</Box>
        </Grid>
      </Grid>
    </Box>
  );
}
