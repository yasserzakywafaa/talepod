import { AuthType } from "src/shared/types/types";
import { Button } from "@mui/material";
import END_POINTS from "src/application/shared/endpoints";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
import { useRegisterModalContext } from "src/components/Modals/RegisterModal/store/Provider";

interface GoogleAuthProps {
  authType?: AuthType;
}

const GoogleAuth = (props: GoogleAuthProps): JSX.Element => {
  const { authType } = props;
  const isRegister = authType === "register";
  const { store: registerStore } = useRegisterModalContext();
  const { store: loginStore } = useLoginModalContext();

  const toggleIsFetching = (isFetching: boolean) => {
    if (isRegister) {
      registerStore.handleIsFetching(isFetching);
    } else {
      loginStore.handleIsFetching(isFetching);
    }
  };

  const handleGoogleLogin = () => {
    toggleIsFetching(true);
    window.location.assign(END_POINTS.AUTH.GOOGLE);
  };

  return (
    <Button
      fullWidth
      variant="contained"
      onClick={handleGoogleLogin}
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        textTransform: "none",
        gap: 2,
      }}
    >
      <GoogleIcon />
      {isRegister ? "Register with Google" : "Login with Google"}
    </Button>
  );
};

export default GoogleAuth;
