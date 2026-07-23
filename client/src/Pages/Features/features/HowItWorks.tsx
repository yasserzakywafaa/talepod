import { AutoAwesome, Create, MenuBook } from "@mui/icons-material";
import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";

import BedtimeStory from "../../../assets/images/landing_pages/wise_owl.webp";
import { routes } from "src/application/routes";
import { useLocalizedPath } from "@yasserzakywafaa/client-core/web/i18n";
import { useApplicationContext } from "src/application/store/Provider";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const stepIcons = [Create, AutoAwesome, MenuBook];

const HowItWorks = () => {
  const { t } = useTranslation("landing");
  const navigate = useNavigate();
  const localizedPath = useLocalizedPath();
  const { isMobile, isTablet, isDesktop } = useDeviceSize();
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

  const steps = t("features.howItWorks.steps", {
    returnObjects: true,
  }) as Array<{ title: string; description: string }>;

  const handleOnButtonClick =
    (route: string) =>
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();

      if (isAuthenticated) {
        navigate(route);
      } else {
        handleToggleLoginModal();
      }
    };

  return (
    <Container sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {isDesktop && (
          <img
            style={{ maxWidth: "400px" }}
            width="100%"
            height="100%"
            src={BedtimeStory}
            alt={t("features.howItWorks.imageAlt")}
            aria-label={t("features.howItWorks.imageAlt")}
          />
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            justifyContent: { md: "center", lg: "flex-start" },
            alignItems: "center",
            width: { xs: "100%", sm: "100%", md: "100%", lg: "50%" },
            mb: "2rem",
          }}
        >
          <Typography variant="h4" align="center" color="primary" gutterBottom>
            {t("features.howItWorks.title")}
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary">
            {t("features.howItWorks.subtitle")}
          </Typography>

          <Grid container wrap="wrap" spacing={1} sx={{ mt: 2 }}>
            {(isMobile || isTablet) && (
              <img
                width="100%"
                height="100%"
                src={BedtimeStory}
                alt={t("features.howItWorks.imageAlt")}
                aria-label={t("features.howItWorks.imageAlt")}
              />
            )}

            {steps.map((step, index) => {
              const Icon = stepIcons[index];
              return (
                <Grid key={step.title} size={{ xs: 12, md: 12 }}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      textAlign: "center",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Icon color="primary" fontSize="large" />
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {step.title}
                    </Typography>
                    <Typography>{step.description}</Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        <Box sx={{ width: "100%", textAlign: "center" }}>
          <Button
            size="large"
            color="primary"
            LinkComponent="a"
            variant="contained"
            sx={{ mt: 4, px: 2 }}
            href={localizedPath(routes.create)}
            onClick={handleOnButtonClick(localizedPath(routes.create))}
          >
            {isAuthenticated
              ? t("features.howItWorks.ctaAuthenticated")
              : t("features.howItWorks.ctaGuest")}
          </Button>
          <Typography variant="body2" color="secondary" sx={{ mt: 1 }}>
            {t("features.howItWorks.noCreditCard")}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default HowItWorks;
