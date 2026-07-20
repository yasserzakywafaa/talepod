import { Box, Button, Container, Typography } from "@mui/material";

import { ArrowForward } from "@mui/icons-material";
import routes from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "src/shared/utils/ga4";
import { useTranslation } from "react-i18next";

const CallToAction = () => {
  const { t } = useTranslation("landing");
  const navigate = useNavigate();
  const {
    store: {
      state: {
        auth: { isAuthenticated },
      },
    },
  } = useApplicationContext();

  const {
    store: { handleToggleLoginModal },
  } = useLoginModalContext();

  const handleOnButtonClick =
    (route: string) =>
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();

      trackEvent("cta_click", {
        cta_name: isAuthenticated ? "start_creating" : "get_started_free",
        destination: route,
        is_authenticated: isAuthenticated,
      });

      if (isAuthenticated) {
        navigate(route);
      } else {
        handleToggleLoginModal();
      }
    };

  return (
    <Container sx={{ py: 4 }}>
      <Box
        className="call-to-action"
        sx={{
          bgcolor: "secondary.main",
          color: "secondary.contrastText",
          p: 4,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          {t("features.callToAction.title")}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {t("features.callToAction.body")}
        </Typography>
        <Button
          size="large"
          color="primary"
          LinkComponent="a"
          variant="contained"
          sx={{ mt: 4, px: 2 }}
          href={routes.create}
          onClick={handleOnButtonClick(routes.create)}
        >
          {isAuthenticated
            ? t("features.callToAction.ctaAuthenticated")
            : t("features.callToAction.ctaGuest")}
          <ArrowForward sx={{ ml: 1 }} />
        </Button>
        <Typography variant="body2" sx={{ color: "inherit", mt: 1 }}>
          {t("features.callToAction.noCreditCard")}
        </Typography>
      </Box>
    </Container>
  );
};

export default CallToAction;
