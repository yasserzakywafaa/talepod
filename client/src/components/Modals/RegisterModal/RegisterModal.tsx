import { Avatar, Box, Button, Typography } from "@mui/material";
import { Close, LockOutlined } from "@mui/icons-material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import LoaderSpinner from "src/components/shared/Loader/LoaderSpinner";
import SocialRegister from "./features/SocialRegister/SocialRegister";
import { useApplicationContext } from "src/application/store/Provider";
import { useEffect } from "react";
import { useRegisterModalContext } from "./store/Provider";
import { useTranslation } from "react-i18next";

export const RegisterModal = () => {
  const { t } = useTranslation("auth");
  const { t: tCommon } = useTranslation("common");
  const {
    store: { state, handleIsFetching, handleToggleRegisterModal },
  } = useRegisterModalContext();
  const {
    store: {
      state: {
        auth: { isAuthenticated },
      },
    },
  } = useApplicationContext();

  // Close once the user authenticates in place (e.g. phone OTP). Google auth
  // full-page-redirects, so this is a no-op there.
  useEffect(() => {
    if (isAuthenticated && state.isVisible) {
      handleIsFetching(false);
      handleToggleRegisterModal();
    }
  }, [isAuthenticated]);

  const onCloseModal = (
    event: {},
    reason: "backdropClick" | "escapeKeyDown",
  ) => {
    if (reason && reason === "backdropClick") return;

    handleCloseModal();
  };

  const handleCloseModal = () => {
    handleIsFetching(false);
    handleToggleRegisterModal();
  };

  return (
    <>
      <Dialog
        maxWidth="sm"
        scroll="paper"
        fullWidth={true}
        open={state.isVisible}
        onClose={onCloseModal}
      >
        <DialogContent sx={{ position: "relative" }}>
          {state.isFetching && <LoaderSpinner position="absolute" />}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                m: 1,
                bgcolor: "transparent",
                border: " 1px solid #000",
                borderColor: "primary.main",
              }}
            >
              <LockOutlined color="primary" />
            </Avatar>
            <Typography component="h1" variant="h5">
              {t("modalRegisterHeading")}
            </Typography>
          </Box>

          <Box
            className="login-form-wrapper"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%"
            }}>
            <Box
              className="social-login-wrapper"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 4
              }}>
              <SocialRegister authType="register" />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            size="small"
            type="button"
            color="primary"
            aria-label="close"
            variant="contained"
            startIcon={<Close />}
            onClick={handleCloseModal}
          >
            {tCommon("close")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
