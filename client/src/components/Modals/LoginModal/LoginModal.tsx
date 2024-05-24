import { Box, Divider, IconButton } from "@mui/material";

import { Close } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import LoginForm from "./features/LoginForm/LoginForm";
import SocialLogin from "./features/SocialLogin/SocialLogin";
import { useLoginModalContext } from "./store/Provider";
import { useApplicationContext } from "src/application/store/Provider";
import LoaderSpinner from "src/components/shared/Loading/LoaderSpinner";

export const LoginModal = () => {
  const { manager: applicationManager } = useApplicationContext();
  const {
    store: { state, handleIsFetching, handleToggleLoginModal },
  } = useLoginModalContext();

  const handleCloseModal = () => {
    handleIsFetching(false);
    handleToggleLoginModal();
    applicationManager.handleIsFetching(false);
  };

  const handleOnFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    console.log("LoginModal:>>> handleOnFormSubmit:>>>", {
      formJson,
    });
    // handleCloseModal();
  };

  return (
    <>
      <Dialog
        scroll="body"
        open={state.isVisible}
        onClose={handleCloseModal}
        PaperProps={{
          component: "form",
          onSubmit: handleOnFormSubmit,
        }}
      >
        {/* <DialogTitle>Log in</DialogTitle> */}
        <IconButton
          aria-label="close"
          onClick={handleCloseModal}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton>

        <DialogContent>
          {state.isFetching && <LoaderSpinner style={{ position: "fixed" }} />}
          
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
                marginY: 4,
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
                marginTop: 4,
              }}
              className="social-login-wrapper"
            >
              <SocialLogin />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          {/* <Button type="submit" variant="contained">
            Log in
          </Button> */}
        </DialogActions>
      </Dialog>
    </>
  );
};
