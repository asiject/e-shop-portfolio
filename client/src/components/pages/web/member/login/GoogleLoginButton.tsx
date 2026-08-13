import {Box} from "@mui/material";
import GoogleButton from "react-google-button";
import {useGoogleLogin} from "@react-oauth/google";
import {useRecoilState, useSetRecoilState} from "recoil";
import {loginAuthState} from "@recoils/login/state";
import {userState} from "@recoils/user/state";
import {useNavigate} from "react-router";
import {getGoogleInfoAxios, getToken} from "@recoils/login/axios";

const handleLoginError = (errorResponse: any) => {
  console.error(errorResponse);
};

export default function GoogleLoginButton() {
  const setLoginAuth = useSetRecoilState(loginAuthState);
  const setUser = useSetRecoilState(userState);
  const navigate = useNavigate();
  const handleLoginSuccess = async (code: string) => {
    const {
      data,
      data: {status, auth, user},
    } = await getGoogleInfoAxios(code);
    console.log("data >", data);
    if (status == "REGISTER") {
      setLoginAuth(data); //구글 sso 로그인 등록을 하기 위한, 정보를 state에 저장함
      navigate("/register");
    } else {
      // console.log("로그인 process 진행하시죠", auth);
      const {ssoid} = auth;
      const {userid} = user;
      const result = await getToken({ssoid, userid}); //로그인 하고, 토큰을 가져온다
      console.log("result : ", result?.data);
      setUser(user); // loginUser, #user 통채로 저장하지 않고, access_token으로 가져오도록 수정
      setLoginAuth(null); //혹시나 유저 정보가 들어있을지 모르니까 비운다
      navigate("/");
    }
  };
  /*
    1. header - x_auth Bearer
    2. storage  access_token, refresh_token
    3. cookie access_token, refresh_token
  */

  const googleSocialLogin = useGoogleLogin({
    scope: "email profile",
    onSuccess: async ({code}) => {
      handleLoginSuccess(code);
    },
    onError: errorResponse => {
      handleLoginError(errorResponse);
    },
    flow: "auth-code",
  });

  return (
    <Box>
      <GoogleButton onClick={googleSocialLogin} />
    </Box>
  );
}
