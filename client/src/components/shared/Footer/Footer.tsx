import "./Footer.scss";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Divider } from "@mui/material";
import Link from "@mui/material/Link";
import SwitzerlandFlag from "src/assets/images/switzerland_flag.png";
import Typography from "@mui/material/Typography";
import routes from "src/application/routes";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const footerLandingPagesLinks = [
    {
      text: "Bedtime stories for kids",
      href: routes.landingPages.bedtimeStoriesForKids,
    },
    {
      text: "Bedtime stories for adults",
      href: routes.landingPages.bedtimeStoriesForAdults,
    },
    {
      text: "Short bedtime stories",
      href: routes.landingPages.shortBedtimeStories,
    },
    {
      text: "Christmas bedtime stories",
      href: routes.landingPages.christmasBedtimeStories,
    },
    {
      text: "Bedtime stories for girlfriend",
      href: routes.landingPages.bedtimeStoriesForGirlfriend,
    },
    {
      text: "Bedtime stories for toddlers",
      href: routes.landingPages.bedtimeStoriesForToddlers,
    },
    {
      text: "Educational bedtime stories",
      href: routes.landingPages.educationalBedtimeStories,
    },
    {
      text: "Baby bedtime stories",
      href: routes.landingPages.babyBedtimeStories,
    },
    {
      text: "Best bedtime stories",
      href: routes.landingPages.bestBedtimeStories,
    },
    {
      text: "Quick bedtime stories",
      href: routes.landingPages.quickBedtimeStories,
    },
  ];

  const handleFooterLinkItemClick =
    (route: string) =>
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();
      navigate(route);
    };

  return (
    <Container
      className="footer"
      sx={{
        gap: { xs: 4, sm: 8 },
        p: { xs: 2, sm: 2 },
        textAlign: { sm: "center", md: "left" },
      }}
    >
      <Box
        display="flex"
        flexWrap="wrap"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
      >
        <Box
          width={{ sm: "40%" }}
          mb={{ xs: 3, sm: 0 }}
          paddingRight={{ sm: "1rem" }}
        >
          <Typography variant="body1" color="text.secondary">
            We embrace the principles of the{" "}
            <span className="bold">Montessori Method</span> to create our
            stories. This educational approach fosters independence, creativity,
            and a love of learning in children.
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Each tale is carefully crafted to encourage young readers to explore
            their imaginations, develop problem-solving skills, and cultivate a
            sense of curiosity about the world around them. Use Talepod to
            transform bedtime stories into magical adventures with our AI
            bedtime story generator and narrator.
          </Typography>
        </Box>

        <Box
          display="flex"
          flexWrap="wrap"
          flexDirection="row"
          width={{ sm: "60%" }}
          justifyContent={{ sm: "flex-end" }}
          className="footer-landing-pages-links"
        >
          {footerLandingPagesLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              color="text.secondary"
              sx={{ p: "5px", width: "300px" }}
              // onClick={handleFooterLinkItemClick(link.href)}
            >
              {link.text}
            </Link>
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" justifyContent="center" alignContent="center">
          <Link
            sx={{ pt: "5px" }}
            color="text.secondary"
            href={routes.privacyPolicy}
            onClick={handleFooterLinkItemClick(routes.privacyPolicy)}
          >
            Privacy Policy
          </Link>

          <Divider
            variant="middle"
            orientation="vertical"
            sx={{ width: "3px", height: "20px", mx: 1 }}
          />

          <Link
            sx={{ pt: "5px" }}
            color="text.secondary"
            href={routes.termsAndConditions}
            onClick={handleFooterLinkItemClick(routes.termsAndConditions)}
          >
            Terms and Conditions
          </Link>
        </Box>

        <Box
          mt={1}
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          alignContent="center"
        >
          <Typography variant="body2" color="textSecondary" align="center">
            Made with{" "}
            <span role="img" aria-label="love">
              ❤️
            </span>{" "}
            and{" "}
            <span role="img" aria-label="love">
              ☕
            </span>{" "}
            in Switzerland{" "}
            <img
              src={SwitzerlandFlag}
              alt="Switzerland Flag"
              style={{ width: "20px", verticalAlign: "middle" }}
            />
          </Typography>

          <Typography variant="body2" color="text.secondary" mx={2}>
            {"Copyright © "}
            <Link href={routes.home}>TalePod&nbsp;</Link>
            {new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Footer;
