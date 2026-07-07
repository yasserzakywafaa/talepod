import { AutoAwesome, Create, MenuBook } from "@mui/icons-material";
import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";

import BedtimeStory from "../../../assets/images/landing_pages/wise_owl.webp";
import routes from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const navigate = useNavigate();
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
          alignItems: "center"
        }}>
        {isDesktop && (
          <img
            style={{
              maxWidth: "400px",
            }}
            width="100%"
            height="100%"
            src={BedtimeStory}
            alt="bedtime-story"
            aria-label="bedtime-story"
          />
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",

            justifyContent: {
              md: "center",
              lg: "flex-start",
            },

            alignItems: "center",
            width: { xs: "100%", sm: "100%", md: "100%", lg: "50%" },
            mb: "2rem"
          }}>
          <Typography variant="h4" align="center" color="primary" gutterBottom>
            Create Magical Bedtime Stories in 3 Easy Steps
          </Typography>
          <Typography variant="subtitle1" align="center" color="textSecondary">
            Bring your child's imagination to life with TalePod's simple story
            creation process.
          </Typography>

          <Grid container wrap="wrap" spacing={1} sx={{ mt: 2 }}>
            {(isMobile || isTablet) && (
              <img
                width="100%"
                height="100%"
                src={BedtimeStory}
                alt="bedtime-story"
                aria-label="bedtime-story"
              />
            )}

            <Grid size={{ xs: 12, md: 12 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  textAlign: "center",
                  backgroundColor: "transparent",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center"
                  }}>
                  <Create color="primary" fontSize="large" />
                </Box>
                <Typography variant="h6" gutterBottom>
                  1. Imagine the Adventure
                </Typography>
                <Typography>
                  Start with a character, setting, or theme - let your
                  imagination run wild!
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  textAlign: "center",
                  backgroundColor: "transparent",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center"
                  }}>
                  <AutoAwesome color="primary" fontSize="large" />
                </Box>
                <Typography variant="h6" gutterBottom>
                  2. Customize Your Story
                </Typography>
                <Typography>
                  Add details, choose the tone, and tailor the story to your
                  child's preferences.
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  textAlign: "center",
                  backgroundColor: "transparent",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center"
                  }}>
                  <MenuBook color="primary" fontSize="large" />
                </Box>
                <Typography variant="h6" gutterBottom>
                  3. Share the Magic
                </Typography>
                <Typography>
                  Read your personalized story aloud and create a magical
                  bedtime experience.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            width: "100%",
            textAlign: "center"
          }}>
          <Button
            size="large"
            color="primary"
            LinkComponent="a"
            variant="contained"
            sx={{ mt: 4, px: 2 }}
            href={routes.create}
            onClick={handleOnButtonClick(routes.create)}
          >
            {isAuthenticated ? "Start Creating Now!" : "Start Your Free Trial!"}
          </Button>
          <Typography variant="body2" color="secondary" sx={{ mt: 1 }}>
            **No Credit Card Required
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default HowItWorks;
