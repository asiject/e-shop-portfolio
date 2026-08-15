import {Box} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {useNavigate} from "react-router";
import {getSafeBackPath} from "@utils/safeBack";
import DemoLoginButtons from "./DemoLoginButtons";
import {kraft} from "theme/kraft";
import Logo from "components/shop/Logo";

export default function Login() {
  const navigate = useNavigate();

  const handleSafeBack = () => {
    navigate(getSafeBackPath(), {replace: true});
  };

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
      }}>
      <Box sx={{width: 280, display: "flex", flexDirection: "column"}}>
        <Box
          component="button"
          type="button"
          onClick={handleSafeBack}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.25,
            alignSelf: "flex-start",
            mb: 1.5,
            ml: "-6px",
            padding: "4px 8px 4px 2px",
            background: "none",
            border: 0,
            cursor: "pointer",
            color: kraft.ink,
            fontFamily: kraft.display,
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: "0.04em",
            "&:hover": {
              backgroundColor: "rgba(26, 18, 11, 0.08)",
            },
          }}>
          <ChevronLeftIcon sx={{fontSize: 22}} aria-hidden="true" />
          돌아가기
        </Box>
        <Box
          sx={{
            width: 280,
            backgroundColor: kraft.sticker,
            border: `2px solid ${kraft.ink}`,
            boxShadow: kraft.shadow,
            padding: "28px 24px",
          }}>
          <Box
            component="h1"
            sx={{
              margin: "0 0 8px",
              display: "flex",
              justifyContent: "center",
            }}>
            <Logo size="lg" />
          </Box>
          <Box sx={{textAlign: "center", color: kraft.mute, fontSize: 14, mb: 1}}>로트 테이블에 입장</Box>
          <DemoLoginButtons />
        </Box>
      </Box>
    </Box>
  );
}
