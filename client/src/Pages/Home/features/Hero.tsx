import { AutoFixHigh } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const handleStartNowClick = () => {
    navigate("/create");
  };

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundSize: "100% 20%",
        backgroundRepeat: "no-repeat",
      })}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 2, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Box
          id="image"
          sx={(theme) => ({
            my: { xs: 6, sm: 8 },
            alignSelf: "center",
            height: { xs: 200, sm: 700 },
            width: "100%",
            backgroundSize: "cover",
            borderRadius: "10px",
            outline: "1px solid",
            outlineColor:
              theme.palette.mode === "light"
                ? alpha("#BFCCD9", 0.5)
                : alpha("#9CCCFC", 0.1),
            // boxShadow:
            //   theme.palette.mode === "light"
            //     ? `0 0 12px 8px ${alpha("#9CCCFC", 0.2)}`
            //     : `0 0 24px 12px ${alpha("#033363", 0.2)}`,
          })}
        />

        <Typography
          variant="h1"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignSelf: "center",
            textAlign: "center",
            fontSize: "3.5rem",
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
          imagination. Make bedtime magical and memorable.
        </Typography>

        <Button
          size="large"
          color="primary"
          variant="contained"
          sx={{ my: 2, px: 2 }}
          endIcon={<AutoFixHigh />}
          onClick={handleStartNowClick}
        >
          Create Story
        </Button>
      </Container>
    </Box>
  );
}
