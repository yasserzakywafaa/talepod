import "./Unauthorized.scss";

import { Alert, Box, Button, Typography } from "@mui/material";
import { LockOpenOutlined, VpnKeyOutlined } from "@mui/icons-material";

import BunnySurprised from "../../assets/images/unauthorized_401/surprised_bunny.webp";
import Page from "src/components/shared/Page/Page";
import { useApplicationContext } from "src/application/store/Provider";
import { useEffect } from "react";
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
import { useRegisterModalContext } from "src/components/Modals/RegisterModal/store/Provider";
import { useTranslation } from "react-i18next";

const Unauthorized = () => {
  const { t } = useTranslation("page");
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();
  const {
    store: { handleToggleLoginModal },
  } = useLoginModalContext();
  const {
    store: { handleToggleRegisterModal },
  } = useRegisterModalContext();

  useEffect(() => {
    if (auth.isAuthenticated) {
      window.history.back();
    }
  }, [auth.isAuthenticated]);

  return (
    <Page title={t("unauthorized.pageTitle")} className="unauthorized-page">
      <Box
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center"
        }}>
        <Box component="div" className="unauthorized-image">
          <img src={BunnySurprised} alt="unauthorized-image" width="100%" />
        </Box>

        <Box
          component="div"
          className="unauthorized-card-wrapper"
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center"
          }}>
          <Typography variant="h4">{t("unauthorized.title")}</Typography>

          <Alert severity="error" component="h5">
            {t("unauthorized.message")}
          </Alert>

          <Box sx={{
            display: "flex"
          }}>
            <Button
              size="small"
              type="button"
              variant="contained"
              sx={{ margin: "0.5rem" }}
              startIcon={<LockOpenOutlined />}
              onClick={handleToggleRegisterModal}
            >
              {t("unauthorized.createFreeAccount")}
            </Button>

            <Button
              size="small"
              type="button"
              color="secondary"
              variant="outlined"
              sx={{ margin: "0.5rem" }}
              startIcon={<VpnKeyOutlined />}
              onClick={handleToggleLoginModal}
            >
              {t("unauthorized.loginToAccount")}
            </Button>
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default Unauthorized;
