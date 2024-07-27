import { AutoFixHighOutlined, SearchOutlined } from "@mui/icons-material";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import MainCharacter from "../../../assets/images/sleeping_bunny_with_a_moon.png";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const handleCreateStoryClick = () => {
    navigate("/create");
  };

  const handleExploreClick = () => {
    navigate("/explore");
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
            fontSize: { xs: "2rem", sm: "3.5rem" },
            color: (theme) => theme.palette.text.primary,
          }}
        >
          Create Custom&nbsp;
          <Typography
            component="span"
            variant="h1"
            sx={{
              fontSize: { xs: "2rem", sm: "3.5rem" },
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
          textAlign="center"
          color="text.secondary"
          sx={{ alignSelf: "center", width: { sm: "100%", md: "80%" } }}
        >
          Craft personalized bedtime stories tailored to your child's dreams and
          imagination.
          {/* Make bedtime magical and memorable. */}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            width: { xs: "100%", sm: "30%" },
          }}
        >
          <Button
            size="large"
            color="secondary"
            variant="contained"
            sx={{ my: 2, px: 2 }}
            endIcon={<SearchOutlined />}
            onClick={handleExploreClick}
          >
            Explore
          </Button>

          <Button
            size="large"
            color="primary"
            variant="contained"
            sx={{ my: 2, px: 2 }}
            endIcon={<AutoFixHighOutlined />}
            onClick={handleCreateStoryClick}
          >
            Create Story
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
