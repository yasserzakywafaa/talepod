import { Box, Button, Container, Typography } from "@mui/material";

import { ArrowForward } from "@mui/icons-material";
import routes from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "src/shared/utils/ga4";

const CallToAction = () => {
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
          textAlign: "center"
        }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Ready to Create Magical Bedtime Stories?
        </Typography>
        <Typography variant="body1" gutterBottom>
          Join TalePod today and start crafting personalized stories that your
          children will cherish forever.
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
          {isAuthenticated ? "Start Creating Now!" : "Get Started for FREE!"}
          <ArrowForward sx={{ ml: 1 }} />
        </Button>
        <Typography
          variant="body2"
          sx={{
            color: "inherit",
            mt: 1
          }}>
          **No Credit Card Required
        </Typography>
      </Box>
    </Container>
  );
};

export default CallToAction;
