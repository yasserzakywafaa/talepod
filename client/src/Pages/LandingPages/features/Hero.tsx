import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CreateStoryFormMini from "src/components/StoryCreator/features/CreateStoryFormMini";
import useDeviceSize from "src/shared/hooks/useDeviceSize";

interface HeroProps {
  heroImage: string;
  pageTitleWhite: string;
  pageTitleColored: string;
  pageHeader: string;
}

const Hero = (props: HeroProps) => {
  const { isMobile } = useDeviceSize();

  return (
    <Box id="hero" sx={{ mt: { xs: 1, sm: 4 }, mb: { xs: 2, sm: 8 } }}>
      <Container
        className="hero-container"
        sx={{
          pt: { xs: 2, sm: 4 },
          position: "relative",
        }}
      >
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
            <Typography
              variant="h1"
              color="text.primary"
              sx={{
                flexDirection: { xs: "column", md: "row" },
                alignSelf: "center",
                textAlign: "center",
                fontSize: { xs: "2rem", sm: "2.75rem" },
                textWrap: "nowrap",
              }}
            >
              <Typography component="span" sx={{ fontSize: "inherit" }}>
                {props.pageTitleWhite}&nbsp; <br />
              </Typography>
              <Typography
                component="span"
                variant="h1"
                sx={{
                  fontSize: "inherit",
                  color: (theme) =>
                    theme.palette.mode === "light"
                      ? "secondary.main"
                      : "primary.light",
                }}
              >
                {props.pageTitleColored}
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
              {props.pageHeader}
            </Typography>

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
              <source srcSet={props.heroImage} type="image/webp" />
              <img
                width="100%"
                height="100%"
                src={props.heroImage}
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
