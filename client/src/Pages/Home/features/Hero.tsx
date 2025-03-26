import { AutoFixHighOutlined, SearchOutlined } from "@mui/icons-material";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import MainCharacter from "../../../assets/images/sleeping_bunny_with_a_moon.webp";
import { ParticlesComponent } from "src/components/shared/ParticlesComponent";
import Typography from "@mui/material/Typography";
import routes from "src/application/routes";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const handleCallToActionClick =
    (name: string) =>
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();

      switch (name) {
        case "create":
          navigate(routes.create);
          break;

        case "explore":
          navigate(routes.explore);
          break;
      }
    };

  return (
    <Box id="hero">
      <Container
        className="hero-container"
        sx={{
          pt: { xs: 2, sm: 4 },
          pb: { xs: 6, sm: 6 },
        }}
      >
        <div style={{ position: "absolute", zIndex: "-1" }}>
          <ParticlesComponent />
        </div>

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
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignSelf: "center",
                textAlign: "center",
                fontSize: { xs: "2rem", sm: "3rem" },
                color: (theme) => theme.palette.text.primary,
              }}
            >
              Create Custom&nbsp;
              <Typography
                component="span"
                variant="h1"
                sx={{
                  fontSize: { xs: "2rem", sm: "3rem" },
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
              Craft personalized bedtime stories tailored to your child's dreams
              and imagination.
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Button
                size="medium"
                color="primary"
                LinkComponent="a"
                variant="contained"
                href={routes.create}
                sx={{ my: 2, px: 2 }}
                endIcon={<AutoFixHighOutlined />}
                onClick={handleCallToActionClick("create")}
              >
                Create for free
              </Button>

              <Button
                size="medium"
                color="secondary"
                LinkComponent="a"
                variant="outlined"
                href={routes.create}
                sx={{ my: 2, ml: 1, px: 2 }}
                endIcon={<SearchOutlined />}
                onClick={handleCallToActionClick("explore")}
              >
                Bedtime Stories
              </Button>
            </Box>
          </Box>

          <Box
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
}
