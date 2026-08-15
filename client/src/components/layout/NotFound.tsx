import {Box, Button} from "@mui/material";
import {useLocation, useNavigate} from "react-router";
import {getShopHomePath} from "@utils/safeBack";
import {kraft} from "theme/kraft";
import {wb} from "theme/adminWorkbench";

export default function NotFound() {
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const isAdmin = pathname.startsWith("/admin");
  const home = isAdmin ? "/admin/dashboard" : getShopHomePath();

  if (isAdmin) {
    return (
      <Box
        sx={{
          bgcolor: wb.paper,
          border: `1px solid ${wb.line}`,
          p: 3,
          maxWidth: 420,
        }}>
        <Box component="h1" sx={{m: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em"}}>
          404 Not Found
        </Box>
        <Box sx={{mt: 0.75, mb: 2, fontSize: 13, color: wb.mute}}>요청한 페이지가 없습니다.</Box>
        <Button type="button" variant="contained" onClick={() => navigate(home)} sx={{bgcolor: wb.action, "&:hover": {bgcolor: "#7c2d12"}}}>
          작업대로
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
      }}>
      <Box
        sx={{
          width: 280,
          backgroundColor: kraft.sticker,
          border: `2px solid ${kraft.ink}`,
          boxShadow: kraft.shadow,
          padding: "28px 24px",
          textAlign: "center",
        }}>
        <Box
          component="h1"
          sx={{
            margin: "0 0 8px",
            fontFamily: kraft.display,
            fontSize: 28,
            letterSpacing: "0.04em",
          }}>
          404 Not Found
        </Box>
        <Box sx={{color: kraft.mute, fontSize: 14, mb: 2}}>요청한 페이지가 없습니다.</Box>
        <Button type="button" variant="contained" fullWidth onClick={() => navigate(home)}>
          매장으로
        </Button>
      </Box>
    </Box>
  );
}
