import {Box, Button, Typography} from "@mui/material"
import {Navigate, useNavigate} from "react-router"
import {useRecoilValue, useSetRecoilState} from "recoil"
import {postDemoLogin} from "@recoils/login/axios"
import {userState} from "@recoils/user/state"
import {wb} from "theme/adminWorkbench"
// FIXME: Google OAuth 설정 후 복구
// import GoogleLoginButton from "@web/member/login/GoogleLoginButton"

function isDemoLoginVisible() {
  if (import.meta.env.VITE_ENABLE_DEMO_LOGIN === "false") return false
  if (import.meta.env.VITE_ENABLE_DEMO_LOGIN === "true") return true
  return import.meta.env.DEV
}

export default function AdminLogin() {
  const loginUser = useRecoilValue(userState)
  const setUser = useSetRecoilState(userState)
  const navigate = useNavigate()

  if (loginUser?.isAdmin) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleDemoAdmin = async () => {
    try {
      const {data} = await postDemoLogin("ADMIN")
      if (!data?.user) {
        alert("데모 로그인에 실패했습니다")
        return
      }
      setUser(data.user)
      navigate("/admin/dashboard")
    } catch (err) {
      console.error(err)
      alert("데모 로그인을 사용할 수 없습니다")
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateRows: `${wb.top}px 1fr`,
        bgcolor: wb.bg,
        color: wb.ink,
        fontFamily: '"Noto Sans KR", sans-serif',
      }}>
      <Box
        component="header"
        sx={{
          display: "flex",
          alignItems: "center",
          px: 2,
          bgcolor: wb.rail,
          color: wb.railText,
          fontWeight: 700,
          letterSpacing: "-0.03em",
        }}>
        E샵 작업대
      </Box>
      <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", p: 3}}>
        <Box
          component="main"
          sx={{
            width: "min(360px, 100%)",
            bgcolor: wb.paper,
            border: `1px solid ${wb.line}`,
            p: 3,
          }}>
          <Typography component="h1" sx={{m: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em"}}>
            관리자 로그인
          </Typography>
          <Typography sx={{m: 0, mt: 0.75, mb: 2.5, fontSize: 13, color: wb.mute}}>
            주문 큐를 처리하려면 관리자 권한이 필요합니다.
          </Typography>
          {isDemoLoginVisible() && (
            <Button
              type="button"
              variant="contained"
              fullWidth
              onClick={handleDemoAdmin}
              sx={{mb: 1.5, bgcolor: wb.action, "&:hover": {bgcolor: "#7c2d12"}}}>
              관리자로 둘러보기
            </Button>
          )}
          {/* FIXME: Google OAuth 설정 후 복구
          <Box sx={{"& > div": {display: "flex", justifyContent: "center"}}}>
            <GoogleLoginButton
              afterLogin={user => {
                if (!user?.isAdmin) {
                  alert("관리자 권한이 없습니다")
                  return
                }
                navigate("/admin/dashboard")
              }}
            />
          </Box>
          */}
        </Box>
      </Box>
    </Box>
  )
}
