import {
  AutoFixHighOutlined,
  ChildCareOutlined,
  DevicesOutlined,
  EmojiObjectsOutlined,
  LocalLibraryOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import routes from "src/application/routes";
import { useNavigate } from "react-router-dom";

const PersonalizedBedtimeStoryText = () => {
  const navigate = useNavigate();

  const handleFooterLinkItemClick =
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
    <Container
      sx={{
        mt: { xs: 2, sm: 4 },
        mb: { xs: 8, sm: 12 },
        color: "text.primary",
        my: 4,
      }}
    >
      <Typography
        mb={4}
        gutterBottom
        variant="h3"
        color="primary"
        textAlign="center"
        sx={{
          fontSize: { xs: "1.5rem", sm: "2rem" },
        }}
      >
        How to Create a New Personalized Bedtime Story Each Day with TalePod
      </Typography>

      <Typography variant="h5" gutterBottom>
        Why Personalize Bedtime Stories?
      </Typography>

      <Typography variant="body1" paragraph>
        <Link
          sx={{ pr: "5px" }}
          color="text.secondary"
          href={routes.termsAndConditions}
          onClick={handleFooterLinkItemClick("explore")}
        >
          Personalized bedtime stories
        </Link>
        can foster a stronger bond between parents and children. They make
        bedtime more engaging and enjoyable, providing a unique way to spark
        your child's imagination. TalePod allows you to create custom stories
        tailored to your child's preferences, making each night a special
        adventure.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Introducing TalePod
      </Typography>
      <Typography variant="body1" paragraph>
        TalePod is a revolutionary app designed to help you
        <Link
          sx={{ px: "5px" }}
          color="text.secondary"
          href={routes.termsAndConditions}
          onClick={handleFooterLinkItemClick("create")}
        >
          create personalized bedtime stories
        </Link>
        effortlessly. With TalePod, you can craft unique narratives that
        resonate with your child's interests, ensuring an exciting and immersive
        bedtime experience.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Benefits of Using TalePod
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            <ChildCareOutlined fontSize="large" color="secondary" />
          </ListItemIcon>
          <ListItemText
            primary="Tailored to Your Child's Interests"
            secondary="With TalePod, you can customize stories based on your child's favorite characters, themes, and settings, making each story relevant and captivating."
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <EmojiObjectsOutlined fontSize="large" color="secondary" />
          </ListItemIcon>
          <ListItemText
            primary="Encourages Creativity"
            secondary="TalePod inspires creativity in both parents and children, encouraging them to imagine and explore new worlds together."
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <DevicesOutlined fontSize="large" color="secondary" />
          </ListItemIcon>
          <ListItemText
            primary="Easy to Use"
            secondary="TalePod's user-friendly interface makes it simple to create and customize stories, even for those who are not tech-savvy."
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <LocalLibraryOutlined fontSize="large" color="secondary" />
          </ListItemIcon>
          <ListItemText
            primary="Promotes Literacy"
            secondary="Personalized stories can enhance your child's vocabulary and comprehension skills, promoting a love for reading from an early age."
          />
        </ListItem>
      </List>

      <Typography variant="body1" paragraph>
        TalePod transforms bedtime into a magical experience by offering
        personalized stories that cater to your child's unique preferences. By
        using TalePod, you can create memorable bedtime moments that nurture
        your child's imagination and foster a love for storytelling. Start
        crafting the perfect bedtime story for your little one.
      </Typography>

      <Box width="100%" textAlign="center">
        <Button
          size="large"
          color="primary"
          LinkComponent="a"
          variant="contained"
          sx={{ my: 2, px: 2 }}
          href={routes.create}
          endIcon={<AutoFixHighOutlined />}
          onClick={handleFooterLinkItemClick("create")}
        >
          Create Story
        </Button>
      </Box>
    </Container>
  );
};

export default PersonalizedBedtimeStoryText;
