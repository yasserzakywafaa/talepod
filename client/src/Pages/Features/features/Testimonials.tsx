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

import { useApplicationContext } from "src/application/store/Provider";
import { useRef } from "react";

interface Testimonial {
  name: string;
  title: string;
  text: string;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah J.",
    title: "Parent of Two",
    text: "TalePod has completely transformed our bedtime routine! My kids now eagerly anticipate story time every night. It's become a cherished part of our day.",
    image: "",
  },
  {
    name: "Michael B.",
    title: "Father of a 5-Year-Old",
    text: "I love how easy it is to create personalized stories with TalePod. It's like magic! My daughter's face lights up every time we start a new adventure.",
    image: "",
  },
  {
    name: "Emily L.",
    title: "Mother of Three",
    text: "My children's imagination has exploded since we started using TalePod. They're constantly coming up with new ideas for stories. I highly recommend it!",
    image: "",
  },
  {
    name: "David K.",
    title: "Parent and Educator",
    text: "As both a parent and an educator, I'm impressed with TalePod's ability to engage children. It's a fantastic tool for fostering creativity and a love of reading.",
    image: "",
  },
  {
    name: "Jessica R.",
    title: "Mom of a Budding Author",
    text: "TalePod has empowered my child to become a storyteller. She's now writing her own stories and illustrating them. It's been incredible to witness her growth.",
    image: "",
  },
  {
    name: "Kevin M.",
    title: "Dad of Twins",
    text: "With twins, bedtime can be chaotic. TalePod has made it so much easier and more enjoyable. Each child gets a personalized story, and they love it!",
    image: "",
  },
  {
    name: "Amanda P.",
    title: "Grandmother of Four",
    text: "I use TalePod to create stories for my grandchildren when they visit. It's a wonderful way to connect with them and create lasting memories.",
    image: "",
  },
  {
    name: "Brian S.",
    title: "Parent of a Reluctant Reader",
    text: "My child used to dread reading, but TalePod has changed that. Now, he's excited to read and create his own stories. It's been a game-changer.",
    image: "",
  },
  {
    name: "Laura W.",
    title: "Mother of an Imaginative Child",
    text: "TalePod has been a fantastic outlet for my child's boundless imagination. The stories are always unique and engaging. We love it!",
    image: "",
  },
  {
    name: "Chris T.",
    title: "Father of Two",
    text: "I was skeptical at first, but TalePod has exceeded my expectations. It's easy to use, and the stories are always high-quality. Highly recommended!",
    image: "",
  },
];

const Testimonials = () => {
  const {
    store: {
      state: { themeMode },
    },
  } = useApplicationContext();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const CARD_WIDTH = 300; // Fixed card width for scrolling

  const handleOnChevronLeftClick = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const newScrollLeft = Math.max(0, container.scrollLeft - CARD_WIDTH);
      container.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handleOnChevronRightClick = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const newScrollLeft = container.scrollLeft + CARD_WIDTH;
      container.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <Container sx={{ pb: 4 }}>
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        What Parents Are Saying
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
                }}
              >
                <Box display="flex" alignItems="center" mb={2}>
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
