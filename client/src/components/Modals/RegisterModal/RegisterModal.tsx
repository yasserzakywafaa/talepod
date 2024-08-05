import { Box, Divider, IconButton } from "@mui/material";

import { Close } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import LoaderSpinner from "src/components/shared/Loader/LoaderSpinner";
import RegisterForm from "./features/RegisterForm/RegisterForm";
import SocialRegister from "./features/SocialRegister/SocialRegister";
import { useApplicationContext } from "src/application/store/Provider";
import { useRegisterModalContext } from "./store/Provider";

export const RegisterModal = () => {
  const { manager: applicationManager } = useApplicationContext();
  const {
    store: { state, handleIsFetching, handleToggleRegisterModal },
  } = useRegisterModalContext();

  const handleCloseModal = () => {
    handleIsFetching(false);
    handleToggleRegisterModal();
    applicationManager.handleIsFetching(false);
  };

  const handleOnFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    console.log("RegisterModal:>>> handleOnFormSubmit:>>>", {
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
              <RegisterForm />
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
              <SocialRegister />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          {/* <Button type="submit" variant="contained">
            Register
          </Button> */}
        </DialogActions>
      </Dialog>
    </>
  );
};
