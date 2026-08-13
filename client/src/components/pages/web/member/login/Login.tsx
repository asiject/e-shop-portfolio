import {Box} from "@mui/material";
import React from "react";
import GoogleLoginButton from "./GoogleLoginButton";

export default function Login() {
  return (
    <Box>
      <Box sx={{width: "240px", margin: "50px auto"}}>
        <GoogleLoginButton />
      </Box>
    </Box>
  );
}
