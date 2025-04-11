import { Box, Button, Card, Container, Typography } from "@mui/material";
import { ChevronLeftOutlined, ChevronRightOutlined } from "@mui/icons-material";
import {
  primaryColor,
  secondaryColorForDarkTheme,
  secondaryColorForLightTheme,
} from "src/application/shared/themes";

import { useApplicationContext } from "src/application/store/Provider";
import { useRef } from "react";
import { useAutoScroll } from "src/shared/hooks/useAutoScroll";

interface StoryExample {
  title: string;
  description: string;
  image?: string;
}

const storyExamples: StoryExample[] = [
  {
    title: "The Brave Little Astronaut",
    description: "A story about a child who goes on an adventure to Mars.",
    image: "",
  },
  {
    title: "The Magical Forest Friends",
    description: "A tale of woodland creatures who learn to work together.",
    image: "",
  },
  {
    title: "The Time-Traveling Explorer",
    description: "A journey through different historical periods.",
    image: "",
  },
  {
    title: "The Underwater Kingdom",
    description:
      "A story about a child who discovers a hidden underwater world.",
    image: "",
  },
  {
    title: "The Mystery of the Missing Toy",
    description:
      "A detective story where a child solves the case of a lost toy.",
    image: "",
  },
  {
    title: "The Day the Animals Talked",
    description:
      "A whimsical story where animals can suddenly talk to each other.",
    image: "",
  },
  {
    title: "The Magical Treehouse",
    description:
      "A child discovers a treehouse that can travel to different places.",
    image: "",
  },
  {
    title: "The Friendly Dragon",
    description:
      "A story about a dragon who is afraid of fire and makes friends with a child.",
    image: "",
  },
  {
    title: "The Night the Stars Fell",
    description:
      "A magical night where the stars fall from the sky and children catch them.",
    image: "",
  },
  {
    title: "The Secret Garden",
    description:
      "A child discovers a hidden garden that has magical properties.",
    image: "",
  },
];

const StoryExamples = () => {
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

  const handleOnChevronLeftClick = () => {
    handleInteraction(scrollPrev);
  };

  const handleOnChevronRightClick = () => {
    handleInteraction(scrollNext);
  };

  return (
    <Container sx={{ pb: 4 }}>
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        Examples of Stories You Can Create
      </Typography>
      <Box
        sx={{
          position: "relative",
          marginTop: 4,
          width: "100%",
        }}
      >
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
          onClick={handleOnChevronLeftClick}
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
          onClick={handleOnChevronRightClick}
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
                <Box display="flex" alignItems="center" mb={2}>
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
