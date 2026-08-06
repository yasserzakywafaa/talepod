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

/**
 * Apple's HIG allows a custom button — this one matches the layout of
 * `GoogleAuth` — but fixes the title to one of Apple's approved strings and the
 * mark and title to black or white, never a brand colour. "Continue with Apple"
 * is the approved title that suits both the login and register modals.
 */
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
      sx={(theme) => {
        // Inverts with the theme so the button never disappears into the page:
        // black on the light parchment background, white on the dark plum one.
        const isLight = theme.palette.mode === "light";
        const background = isLight ? "#000000" : "#FFFFFF";
        const content = isLight ? "#FFFFFF" : "#000000";

        return {
          display: "flex",
          justifyContent: "flex-start",
          textTransform: "none",
          gap: 2,
          backgroundColor: background,
          color: content,
          "&:hover": {
            backgroundColor: isLight ? "#1a1a1a" : "#e6e6e6",
          },
        };
      }}
    >
      <AppleIcon />
      {t("continueWithApple")}
    </Button>
  );
};

export default AppleAuth;
