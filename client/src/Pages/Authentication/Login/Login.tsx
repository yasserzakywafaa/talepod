import { Box, Divider } from "@mui/material";

import LoginForm from "./features/LoginForm/LoginForm";
import React from "react";
import SocialLogin from "./features/SocialLogin/SocialLogin";
import Page from "src/components/shared/Page/Page";
import { useApplicationContext } from "src/application/domain/Provider";
import LoaderSpinner from "src/components/shared/Loading/LoaderSpinner";

const Login: React.FC = () => {
  const {
    store: {
      state: { isFetching },
    },
  } = useApplicationContext();

  return (
    <>
      <Page title="Log in" className="login-page">
        {isFetching && <LoaderSpinner style={{ position: "fixed" }} />}

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
      </Page>
    </>
  );
};

export default Login;
