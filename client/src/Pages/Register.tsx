import { Box, Container, Typography } from "@mui/material";

import { LockOutlined } from "@mui/icons-material";
import Page from "src/components/shared/Page/Page";
import SocialRegister from "src/components/Modals/RegisterModal/features/SocialRegister/SocialRegister";
import routes from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { consumeReturnUrl } from "src/shared/utils/authReturn";
import { useTranslation } from "react-i18next";

const RegisterPage = () => {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  useEffect(() => {
    if (auth?.user?._id) {
      navigate(consumeReturnUrl() ?? routes.myProfile(auth.user._id), {
        replace: true,
      });
    }
  }, [auth, navigate]);

  if (auth?.user?._id) {
    return null;
  }

  return (
    <Page title={t("registerPageTitle")} noIndex>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          gap: { xs: 4, sm: 6 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <LockOutlined color="primary" sx={{ m: 1 }} />

          <Typography component="h1" variant="h5">
            {t("registerHeading")}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: 400
          }}>
          <SocialRegister authType="register" />
        </Box>
      </Container>
    </Page>
  );
};

export default RegisterPage;
