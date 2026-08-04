import { AuthType } from "src/shared/types/types";
import { Button } from "@mui/material";
import END_POINTS from "src/application/shared/endpoints";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
import { useRegisterModalContext } from "src/components/Modals/RegisterModal/store/Provider";
import { useTranslation } from "react-i18next";

interface GoogleAuthProps {
  authType?: AuthType;
}

const GoogleAuth = (props: GoogleAuthProps): JSX.Element => {
  const { t } = useTranslation("auth");
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
      {/* One label on both modals — social auth has no login/register split, so
          "Continue" is what actually happens. `isRegister` still picks the
          fetching store above. */}
      {t("continueWithGoogle")}
    </Button>
  );
};

export default GoogleAuth;
