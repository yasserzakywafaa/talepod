import { Box, Button, Container, Typography } from "@mui/material";

import { VerifiedUser } from "@mui/icons-material";
import { routes } from "src/application/routes";
import { useLocalizedPath } from "@yasserzakywafaa/client-core/web/i18n";
import { useApplicationContext } from "src/application/store/Provider";
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "src/shared/utils/ga4";
import { useTranslation } from "react-i18next";

const Guarantee = () => {
  const { t } = useTranslation("landing");
  const navigate = useNavigate();
  const localizedPath = useLocalizedPath();
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
        cta_name: isAuthenticated
          ? "guarantee_start_creating"
          : "guarantee_try_risk_free",
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
        className="guarantee"
        sx={{
          bgcolor: "primary.light",
          color: "primary.contrastText",
          p: 4,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <VerifiedUser sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" component="h2" gutterBottom>
          {t("features.guarantee.title")}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {t("features.guarantee.body1")}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {t("features.guarantee.body2")}
        </Typography>
        <Button
          size="large"
          color="inherit"
          LinkComponent="a"
          variant="contained"
          sx={{ mt: 4, px: 2 }}
          href={localizedPath(routes.create)}
          onClick={handleOnButtonClick(localizedPath(routes.create))}
        >
          {isAuthenticated
            ? t("features.guarantee.ctaAuthenticated")
            : t("features.guarantee.ctaGuest")}
        </Button>
      </Box>
    </Container>
  );
};

export default Guarantee;
