import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CreateStoryFormMini from "src/components/StoryCreator/features/CreateStoryFormMini";
import MainCharacter from "../../../assets/images/sleeping_bunny_with_a_moon.webp";
import ProductHuntBadge from "src/components/shared/ProductHunt/ProductHuntBadge";
import Typography from "@mui/material/Typography";
import useDeviceSize from "src/shared/hooks/useDeviceSize";

const Hero = () => {
  const { isMobile, isTablet } = useDeviceSize();

  return (
    <Box id="hero" sx={{ mt: { xs: 1, sm: 4 }, mb: { xs: 2, sm: 8 } }}>
      <Container
        className="hero-container"
        sx={{
          pt: { xs: 2, sm: 4 },
          position: "relative",
        }}
      >
        {!isMobile && !isTablet && (
          <Box display="flex" justifyContent="center" marginBottom="2rem">
            <ProductHuntBadge />
          </Box>
        )}

        <Box
          sx={{
            display: { xs: "flex", sm: "flex" },
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "center", sm: "start" },
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: { xs: "100%", sm: "80%" },
            }}
          >
            <Box
              sx={{
                display: { xs: "flex", sm: "flex" },
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h1"
                color="text.primary"
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignSelf: "center",
                  textAlign: "center",
                  fontSize: { xs: "2rem", sm: "2.75rem" },
                  textWrap: "nowrap",
                }}
              >
                <Typography component="span" sx={{ fontSize: "inherit" }}>
                  Generate Custom&nbsp;
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontSize: "inherit",
                    color: (theme) =>
                      theme.palette.mode === "light"
                        ? "secondary.main"
                        : "primary.light",
                  }}
                >
                  Bedtime Stories
                </Typography>
              </Typography>

              <Typography
                variant="h2"
                textAlign="center"
                color="text.secondary"
                sx={{
                  my: 2,
                  alignSelf: "center",
                  fontSize: { xs: "1.5rem", sm: "2rem" },
                }}
              >
                Craft AI-powered personalized bedtime stories tailored to your
                child's dreams.
              </Typography>
            </Box>

            <CreateStoryFormMini />

            <Typography variant="body2" color="secondary">
              **No Credit Card Required
            </Typography>
          </Box>

          <Box
            className={isMobile ? "hero-image-mobile" : "hero-image"}
            sx={{
              maxWidth: { xs: "300px", sm: "100%" },
            }}
          >
            <picture>
              <source srcSet={MainCharacter} type="image/webp" />
              <img
                width="100%"
                height="100%"
                src={MainCharacter}
                alt="home-page-image"
                aria-label="rabbit-sleeping-on-a-pillow"
              />
            </picture>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
