import { Box, Button, Container, Typography } from "@mui/material";

import { VerifiedUser } from "@mui/icons-material";
import routes from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
import { useNavigate } from "react-router-dom";
import { trackGtmEvent } from "src/shared/utils/gtm";

const Guarantee = () => {
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

      trackGtmEvent("cta_click", {
        cta_name: isAuthenticated ? "guarantee_start_creating" : "guarantee_try_risk_free",
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
        bgcolor="primary.light"
        color="primary.contrastText"
        p={4}
        borderRadius={2}
        textAlign="center"
      >
        <VerifiedUser sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" component="h2" gutterBottom>
          Our Ironclad Guarantee
        </Typography>
        <Typography variant="body1" gutterBottom>
          We're so confident that you and your children will love TalePod that
          we're offering a 100% satisfaction guarantee.
        </Typography>
        <Typography variant="body1" gutterBottom>
          If you're not completely happy, we'll make it right. No questions
          asked.
        </Typography>
        <Button
          size="large"
          color="inherit"
          LinkComponent="a"
          variant="contained"
          sx={{ mt: 4, px: 2 }}
          href={routes.create}
          onClick={handleOnButtonClick(routes.create)}
        >
          {isAuthenticated ? "Start Creating Now!" : "Try it Risk-Free!"}
        </Button>
      </Box>
    </Container>
  );
};

export default Guarantee;
