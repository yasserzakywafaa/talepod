import { AutoFixHighOutlined } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import MainCharacter from "../../../assets/images/sleeping_bunny_with_a_moon.png";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const handleStartNowClick = () => {
    navigate("/create");
  };

  return (
    <Box id="hero">
      <Container
        className="hero-container"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 2, sm: 4 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Box sx={{ maxWidth: "300px" }}>
          <img src={MainCharacter} width="100%" />
        </Box>

        <Typography
          variant="h1"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignSelf: "center",
            textAlign: "center",
            fontSize: { xs: "3rem", sm: "3.5rem" },
            color: (theme) => theme.palette.text.primary,
          }}
        >
          Create Custom&nbsp;
          <Typography
            component="span"
            variant="h1"
            sx={{
              fontSize: "clamp(3rem, 10vw, 4rem)",
              color: (theme) =>
                theme.palette.mode === "light"
                  ? "primary.main"
                  : "primary.light",
            }}
          >
            Bedtime Stories
          </Typography>
        </Typography>

        <Typography
          textAlign="center"
          color="text.secondary"
          sx={{ alignSelf: "center", width: { sm: "100%", md: "80%" } }}
        >
          Craft personalized bedtime stories tailored to your child's dreams and
          imagination.
          {/* Make bedtime magical and memorable. */}
        </Typography>

        <Button
          size="large"
          color="primary"
          variant="contained"
          sx={{ my: 2, px: 2 }}
          endIcon={<AutoFixHighOutlined />}
          onClick={handleStartNowClick}
        >
          Create Story
        </Button>
      </Container>
    </Box>
  );
}
