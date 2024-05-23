import { Box, Divider } from "@mui/material";

import LoaderSpinner from "src/components/shared/Loading/LoaderSpinner";
import Page from "src/components/shared/Page/Page";
import React from "react";
import RegisterForm from "./features/RegisterForm/RegisterForm";
import SocialRegister from "./features/SocialRegister/SocialRegister";
import { useApplicationContext } from "src/application/store/Provider";

const Register: React.FC = () => {
  const {
    store: {
      state: { isFetching },
    },
  } = useApplicationContext();

  return (
    <>
      <Page title="Register" className="register-page">
        {isFetching && <LoaderSpinner style={{ position: "fixed" }} />}

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: "100%",
          }}
          className="register-form-wrapper"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              margin: 8,
            }}
          >
            <RegisterForm />
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
            <SocialRegister />
          </Box>
        </Box>
      </Page>
    </>
  );
};

export default Register;
