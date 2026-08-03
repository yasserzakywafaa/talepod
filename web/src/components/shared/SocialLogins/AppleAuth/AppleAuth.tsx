import { Apple as AppleIcon } from "@mui/icons-material";
import { AuthType } from "src/shared/types/types";
import { Button } from "@mui/material";
import END_POINTS from "src/application/shared/endpoints";
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
import { useRegisterModalContext } from "src/components/Modals/RegisterModal/store/Provider";
import { useTranslation } from "react-i18next";

interface AppleAuthProps {
  authType?: AuthType;
}

const AppleAuth = (props: AppleAuthProps): JSX.Element => {
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

  const handleAppleLogin = () => {
    toggleIsFetching(true);
    window.location.assign(END_POINTS.AUTH.APPLE);
  };

  return (
    <Button
      fullWidth
      variant="contained"
      onClick={handleAppleLogin}
      // Apple's guidelines ask for their own black-on-white / white-on-black
      // treatment rather than the app's primary colour.
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        textTransform: "none",
        gap: 2,
        backgroundColor: "#000000",
        color: "#FFFFFF",
        "&:hover": { backgroundColor: "#1a1a1a" },
      }}
    >
      <AppleIcon />
      {isRegister ? t("registerWithApple") : t("loginWithApple")}
    </Button>
  );
};

export default AppleAuth;
