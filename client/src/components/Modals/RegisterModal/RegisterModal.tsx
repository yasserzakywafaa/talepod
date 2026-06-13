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

export const RegisterModal = () => {
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
              Create a new account
            </Typography>
          </Box>

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
                marginTop: 4,
              }}
              className="social-login-wrapper"
            >
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
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
