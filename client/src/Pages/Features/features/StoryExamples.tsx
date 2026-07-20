import { Box, Button, Card, Container, Typography } from "@mui/material";
import { ChevronLeftOutlined, ChevronRightOutlined } from "@mui/icons-material";
import {
  primaryColor,
  secondaryColorForDarkTheme,
  secondaryColorForLightTheme,
} from "src/application/shared/themes";

import { useApplicationContext } from "src/application/store/Provider";
import { useAutoScroll } from "src/shared/hooks/useAutoScroll";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

const StoryExamples = () => {
  const { t } = useTranslation("landing");
  const storyExamples = t("features.storyExamples.items", {
    returnObjects: true,
  }) as Array<{ title: string; description: string }>;

  const {
    store: {
      state: { themeMode },
    },
  } = useApplicationContext();
  const CARD_WIDTH = 300;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { scrollNext, scrollPrev, handleInteraction } = useAutoScroll({
    scrollContainerRef,
    scrollAmount: CARD_WIDTH,
    scrollIntervalMs: 4000,
    pauseOnInteractionMs: 8000,
    loop: true,
  });

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        {t("features.storyExamples.title")}
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
          {storyExamples.map((storyExample, index) => (
            <Box
              key={index}
              sx={{
                maxWidth: { xs: "94%", sm: CARD_WIDTH, md: CARD_WIDTH },
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
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle1">
                      {storyExample.title}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2">
                  {storyExample.description}
                </Typography>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default StoryExamples;
