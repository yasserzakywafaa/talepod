import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  Typography,
} from "@mui/material";

import { AutoFixHighOutlined } from "@mui/icons-material";
import routes from "src/application/routes";
import { useNavigate } from "react-router-dom";

interface LandingPagePersonalizedBedtimeStoryText {
  introducingTalePod: string;
  whyPersonalizeBedtimeStories: string;
  personalizeImage: string;
  benefitsList: JSX.Element;
  benefitsImage: JSX.Element;
}

const PersonalizedBedtimeStoryText = (
  props: LandingPagePersonalizedBedtimeStoryText
) => {
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
        mb={4}
        gutterBottom
        variant="h3"
        color="primary"
        textAlign="center"
        sx={{
          fontSize: { xs: "1.75rem", sm: "2rem" },
        }}
      >
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
            width={{ sm: "50%" }}
            display={{ sm: "flex" }}
            flexDirection={{ sm: "column" }}
            justifyContent="center"
          >
            <Typography variant="h5" gutterBottom>
              Why Personalize Bedtime Stories?
            </Typography>

            <Typography variant="body1" paragraph>
              <Link
                sx={{ pr: "5px" }}
                color="text.secondary"
                href={routes.termsAndConditions}
                onClick={handleFooterLinkItemClick(routes.explore)}
              >
                Personalized bedtime stories
              </Link>
              {props.whyPersonalizeBedtimeStories}
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
                onClick={handleFooterLinkItemClick(routes.create)}
              >
                create personalized bedtime stories
              </Link>
              effortlessly. {props.introducingTalePod}
            </Typography>
          </Box>

          <Box sx={{ maxWidth: { sm: "50%" }, margin: "auto" }}>
            <img
              src={props.personalizeImage}
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
            width={{ sm: "50%" }}
            display={{ sm: "flex" }}
            flexDirection={{ sm: "column" }}
            justifyContent="center"
          >
            <Typography variant="h5" gutterBottom>
              Benefits of Using TalePod
            </Typography>
            {props.benefitsList}
          </Box>

          <Box sx={{ maxWidth: { sm: "50%" }, margin: "auto" }}>
            {props.benefitsImage}
          </Box>
        </CardContent>
      </Card>

      <Typography variant="body1" paragraph>
        TalePod transforms bedtime into a magical experience by offering{" "}
        <Link
          sx={{ pr: "5px" }}
          color="text.secondary"
          href={routes.explore}
          onClick={handleFooterLinkItemClick(routes.explore)}
        >
          personalized bedtime stories
        </Link>{" "}
        that cater to your child's unique preferences. By using TalePod, you can{" "}
        <Link
          sx={{ pr: "5px" }}
          color="text.secondary"
          href={routes.create}
          onClick={handleFooterLinkItemClick(routes.create)}
        >
          create memorable bedtime moments
        </Link>{" "}
        that nurture the imagination and foster a love for storytelling. Start
        crafting the perfect bedtime story. For more information, please read
        our{" "}
        <Link
          sx={{ pr: "5px" }}
          color="text.secondary"
          href={routes.privacyPolicy}
          onClick={handleFooterLinkItemClick(routes.privacyPolicy)}
        >
          Privacy Policy
        </Link>
        .
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
          onClick={handleFooterLinkItemClick(routes.create)}
        >
          Get Started for Free
        </Button>
      </Box>
    </Container>
  );
};

export default PersonalizedBedtimeStoryText;
