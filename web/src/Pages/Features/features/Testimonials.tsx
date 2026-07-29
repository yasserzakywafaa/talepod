import {
  AccountCircle,
  ChevronLeftOutlined,
  ChevronRightOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Typography,
} from "@mui/material";
import {
  primaryColor,
  secondaryColorForDarkTheme,
  secondaryColorForLightTheme,
} from "src/application/shared/themes";

import { useAppResolvedThemeMode } from "src/application/hooks/useAppResolvedThemeMode";
import { useAutoScroll } from "src/shared/hooks/useAutoScroll";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

const CARD_WIDTH = 250;

const Testimonials = () => {
  const { t } = useTranslation("landing");
  const testimonials = t("features.testimonialsList", {
    returnObjects: true,
  }) as Array<{ name: string; title: string; text: string; image?: string }>;

  const themeMode = useAppResolvedThemeMode();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { scrollNext, scrollPrev, handleInteraction } = useAutoScroll({
    scrollContainerRef,
    scrollAmount: CARD_WIDTH,
    scrollIntervalMs: 4000,
    pauseOnInteractionMs: 8000,
    loop: true,
  });

  return (
    <Container sx={{ pb: 4 }}>
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        {t("features.testimonials.title")}
      </Typography>
      <Box sx={{ position: "relative", marginTop: 4, width: "100%" }}>
        <Button
          color="primary"
          variant="outlined"
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            zIndex: 1,
            marginLeft: "-1rem",
            minWidth: "30px",
            maxWidth: "40px",
            transform: "translateY(-50%)",
            color:
              themeMode === "light"
                ? secondaryColorForLightTheme
                : secondaryColorForDarkTheme,
            backgroundColor: primaryColor,
          }}
          onClick={() => handleInteraction(scrollPrev)}
        >
          <ChevronLeftOutlined />
        </Button>

        <Button
          color="primary"
          variant="outlined"
          sx={{
            position: "absolute",
            right: "0",
            top: "50%",
            zIndex: 1,
            marginRight: "-1rem",
            minWidth: "30px",
            maxWidth: "40px",
            transform: "translateY(-50%)",
            color:
              themeMode === "light"
                ? secondaryColorForLightTheme
                : secondaryColorForDarkTheme,
            backgroundColor: primaryColor,
          }}
          onClick={() => handleInteraction(scrollNext)}
        >
          <ChevronRightOutlined />
        </Button>

        <Box
          ref={scrollContainerRef}
          sx={{
            gap: 4,
            paddingY: 2,
            paddingX: 2,
            display: "flex",
            overflowX: "auto",
            msOverflowStyle: "none",
            transition: "200ms all",
            scrollSnapType: "x proximity",
            scrollSnapAlign: "center",
            scrollbarWidth: "none",
            "::-webkit-scrollbar": { display: "none" },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <Box
              key={index}
              sx={{
                maxWidth: { xs: "85%", sm: CARD_WIDTH, md: CARD_WIDTH },
                width: "100%",
                flexShrink: 0,
              }}
            >
              <Card
                elevation={3}
                sx={{
                  padding: 3,
                  height: "100%",
                  maxWidth: { xs: "400px", sm: "500px" },
                  boxShadow: `-1px -1px 1px ${secondaryColorForDarkTheme}, 1px 1px 1px ${primaryColor}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ mr: 2 }} src={testimonial.image}>
                    {!testimonial.image && <AccountCircle />}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">
                      {testimonial.name}
                    </Typography>
                    <Typography variant="caption">
                      {testimonial.title}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2">{testimonial.text}</Typography>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default Testimonials;
