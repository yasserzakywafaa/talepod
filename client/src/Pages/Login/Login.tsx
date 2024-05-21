import { Box, Divider } from "@mui/material";

import LoginForm from "./features/LoginForm/LoginForm";
import React from "react";
import SocialLogin from "./features/SocialLogin/SocialLogin";

const Login: React.FC = () => {
  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: "100%",
        }}
        className="login-form-wrapper"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            margin: 8,
          }}
        >
          <LoginForm />
        </Box>

        <Divider sx={{ width: "50%" }} />

        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            margin: 8,
          }}
          className="social-login-wrapper"
        >
          <SocialLogin />
        </Box>
      </Box>
    </>
  );
};

export default Login;
