import {loginAuthState} from "@recoils/login/state";
import {Navigate, useNavigate} from "react-router";
import {useRecoilValue} from "recoil";
import {Box, Button, TextField} from "@mui/material";
import {useForm} from "react-hook-form";
import {LoginAuth, UserLogin} from "@props";
import {postRegister} from "@recoils/login/axios";

type RegisterForm = UserLogin & {sabun: string};

export default function Register() {
  const loginAuth: LoginAuth = useRecoilValue(loginAuthState);
  const navigate = useNavigate();
  const {register, handleSubmit} = useForm<RegisterForm>();

  const handleRegister = async (formdata: RegisterForm) => {
    const {data} = await postRegister(formdata);
    navigate("/");
  };
  if (loginAuth == null) {
    return <Navigate to="/" />;
  }
  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit(handleRegister)}
      sx={{width: "200px", margin: "0 auto", ".row": {display: "flex"}, ".header": {width: "100px"}}}>
      <input type={"hidden"} defaultValue={loginAuth?.auth?.email} {...register("email")} />
      <input type={"hidden"} defaultValue={loginAuth?.auth?.ssoid} {...register("ssoid")} />
      <input type={"hidden"} defaultValue={loginAuth?.auth?.type} {...register("type")} />
      <input type={"hidden"} defaultValue={loginAuth?.auth?.photo} {...register("photo")} />
      <Box className="row">
        <Box className="header">이름</Box>
        <Box className="value">
          <TextField size="small" defaultValue={loginAuth?.auth?.username || ""} {...register("username", {required: true})} />
        </Box>
      </Box>
      <Box className="row">
        <Box className="header">번호</Box>
        <Box className="value">
          {" "}
          <TextField type={"number"} size="small" {...register("sabun")} />
        </Box>
      </Box>
      <Button type="submit" fullWidth variant="outlined">
        저장
      </Button>
    </Box>
  );
}
