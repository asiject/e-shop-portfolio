import {Box} from "@mui/material";
import DemoLoginButtons from "./DemoLoginButtons";
import {kraft} from "theme/kraft";

export default function Login() {
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
        }}>
        <Box
          component="h1"
          sx={{
            margin: "0 0 8px",
            fontFamily: kraft.display,
            fontSize: 28,
            letterSpacing: "0.04em",
            textAlign: "center",
          }}>
          1958SHOP
        </Box>
        <Box sx={{textAlign: "center", color: kraft.mute, fontSize: 14, mb: 1}}>로트 테이블에 입장</Box>
        <DemoLoginButtons />
      </Box>
    </Box>
  );
}
