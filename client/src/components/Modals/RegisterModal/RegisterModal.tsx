import { Box, Divider, IconButton } from "@mui/material";

import { Close } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import RegisterForm from "./features/RegisterForm/RegisterForm";
import SocialRegister from "./features/SocialRegister/SocialRegister";
import { useEffect } from "react";
import { useRegisterModalContext } from "./store/Provider";

export const RegisterModal = () => {
  const {
    store: { state, handleToggleRegisterModal },
  } = useRegisterModalContext();

  const handleCloseModal = () => {
    handleToggleRegisterModal();
  };

  const handleOnFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const email = formJson.email;
    console.log(email);
    handleCloseModal();
  };

  useEffect(() => {
    console.log("RegisterModal.tsx:>>> state:>>>", state);
  }, [state]);

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
