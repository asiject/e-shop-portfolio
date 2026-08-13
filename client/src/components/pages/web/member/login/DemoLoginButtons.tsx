import {Box, Button, Stack, Typography} from "@mui/material";
import {useNavigate} from "react-router";
import {useSetRecoilState} from "recoil";
import {postDemoLogin} from "@recoils/login/axios";
import {userState} from "@recoils/user/state";

type DemoRole = "USER" | "ADMIN";

function isDemoLoginVisible() {
  if (import.meta.env.VITE_ENABLE_DEMO_LOGIN === "false") return false;
  if (import.meta.env.VITE_ENABLE_DEMO_LOGIN === "true") return true;
  return import.meta.env.DEV;
}

export default function DemoLoginButtons() {
  const setUser = useSetRecoilState(userState);
  const navigate = useNavigate();

  if (!isDemoLoginVisible()) {
    return null;
  }

  const handleDemoLogin = async (role: DemoRole) => {
    try {
      const {data} = await postDemoLogin(role);
      if (!data?.user) {
        alert("데모 로그인에 실패했습니다");
        return;
      }
      setUser(data.user);
      navigate(role === "ADMIN" ? "/admin/dashboard" : "/");
    } catch (err) {
      console.error(err);
      alert("데모 로그인을 사용할 수 없습니다");
    }
  };

  return (
    <Box sx={{mt: 3}}>
      <Typography variant="body2" color="text.secondary" align="center" sx={{mb: 1}}>
        소개용 데모 로그인
      </Typography>
      <Stack spacing={1}>
        <Button variant="outlined" fullWidth onClick={() => handleDemoLogin("USER")}>
          일반 유저로 둘러보기
        </Button>
        <Button variant="contained" fullWidth onClick={() => handleDemoLogin("ADMIN")}>
          관리자로 둘러보기
        </Button>
      </Stack>
    </Box>
  );
}
