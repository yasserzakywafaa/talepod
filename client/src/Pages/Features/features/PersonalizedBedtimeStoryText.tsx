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
  Card,
  CardContent,
  Container,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import RandomImage from "src/components/shared/RandomImage/RandomImage";
import Unicorn from "../../../assets/images/unicorn_with_a_magic_wand_and_a_book.webp";
import routes from "src/application/routes";
import { useNavigate } from "react-router-dom";

const PersonalizedBedtimeStoryText = () => {
  const navigate = useNavigate();

  const handleFooterLinkItemClick =
    (route: string) =>
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();
      navigate(route);
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
        gutterBottom
        variant="h3"
        color="primary"
        sx={{
          mb: 4,
          textAlign: "center",
          fontSize: { xs: "1.75rem", sm: "2rem" }
        }}>
        How to Create a New Personalized Bedtime Story
      </Typography>
      <Card sx={{ mb: "2rem" }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row-reverse" },
          }}
        >
          <Box
            sx={{
              width: { sm: "50%" },
              display: { sm: "flex" },
              flexDirection: { sm: "column" },
              justifyContent: "center"
            }}>
            <Typography variant="h5" gutterBottom>
              Why Personalize Bedtime Stories?
            </Typography>

            <Typography variant="body1" paragraph>
              <Link
                href={routes.termsAndConditions}
                onClick={handleFooterLinkItemClick(routes.library)}
                sx={{
                  color: "text.secondary",
                  pr: "5px"
                }}>
                Personalized bedtime stories
              </Link>
              can foster a stronger bond between parents and children. They make
              bedtime more engaging and enjoyable, providing a unique way to
              spark your child's imagination. TalePod allows you to create
              custom stories tailored to your child's preferences, making each
              night a special adventure.
            </Typography>

            <Typography variant="h5" gutterBottom>
              Introducing TalePod
            </Typography>
            <Typography variant="body1" paragraph>
              TalePod is a revolutionary app designed to help you
              <Link
                href={routes.termsAndConditions}
                onClick={handleFooterLinkItemClick(routes.create)}
                sx={{
                  color: "text.secondary",
                  px: "5px"
                }}>
                create personalized bedtime stories
              </Link>
              effortlessly. With TalePod, you can craft unique narratives that
              resonate with your child's interests, ensuring an exciting and
              immersive bedtime experience.
            </Typography>
          </Box>

          <Box sx={{ maxWidth: { sm: "50%" }, margin: "auto" }}>
            <img
              src={Unicorn}
              alt="unicorn with a magic wand and a book"
              width="100%"
              height="100%"
            />
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ mb: "2rem" }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box
            sx={{
              width: { sm: "50%" },
              display: { sm: "flex" },
              flexDirection: { sm: "column" },
              justifyContent: "center"
            }}>
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
          </Box>

          <Box sx={{ maxWidth: { sm: "50%" }, margin: "auto" }}>
            <RandomImage />
          </Box>
        </CardContent>
      </Card>
      <Typography variant="body1" paragraph>
        TalePod transforms bedtime into a magical experience by offering{" "}
        <Link
          href={routes.library}
          onClick={handleFooterLinkItemClick(routes.library)}
          sx={{
            color: "text.secondary",
            pr: "5px"
          }}>
          personalized bedtime stories
        </Link>{" "}
        that cater to your child's unique preferences. By using TalePod, you can{" "}
        <Link
          href={routes.create}
          onClick={handleFooterLinkItemClick(routes.create)}
          sx={{
            color: "text.secondary",
            pr: "5px"
          }}>
          create memorable bedtime moments
        </Link>{" "}
        that nurture the imagination and foster a love for storytelling. Start
        crafting the perfect bedtime story. For more information, please read
        our{" "}
        <Link
          href={routes.privacyPolicy}
          onClick={handleFooterLinkItemClick(routes.privacyPolicy)}
          sx={{
            color: "text.secondary",
            pr: "5px"
          }}>
          Privacy Policy
        </Link>
        .
      </Typography>
      <Box
        sx={{
          width: "100%",
          textAlign: "center"
        }}>
        <Button
          size="large"
          color="primary"
          LinkComponent="a"
          variant="contained"
          sx={{ my: 2, px: 2 }}
          href={routes.create}
          endIcon={<AutoFixHighOutlined />}
          onClick={handleFooterLinkItemClick(routes.create)}
        >
          Get Started for Free
        </Button>
      </Box>
    </Container>
  );
};

export default PersonalizedBedtimeStoryText;
