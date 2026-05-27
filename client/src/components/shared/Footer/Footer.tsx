import "./Footer.scss";

import { Box, Grid, Link, Stack, Typography } from "@mui/material";

import Logo from "../Logo";
import PortugalFlag from "src/assets/images/portugal_flag.png";
import SwitzerlandFlag from "src/assets/images/switzerland_flag.png";
import mascotBunny from "src/assets/images/v2/mascot_sleeping_bunny.webp";
import routes from "src/application/routes";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const landingLinks = [
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

  const productLinks = [
    { text: "Create a story", href: routes.create },
    { text: "Explore", href: routes.explore },
    { text: "Pricing", href: routes.pricing },
    { text: "Blog", href: routes.blogs },
    { text: "Contact", href: routes.contact },
  ];

  const go =
    (route: string) =>
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();
      navigate(route);
    };

  const linkSx = {
    fontSize: 13,
    color: "rgba(255,255,255,0.78)",
    textDecoration: "none",
    "&:hover": { color: "var(--honey-300)" },
  };

  const headingSx = {
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "var(--honey-300)",
    mb: 1.5,
  };

  return (
    <Box
      component="footer"
      className="footer"
      sx={{
        mt: 6,
        px: { xs: 3, sm: 5 },
        py: { xs: 4, sm: 6 },
        background: "var(--bg-sunken)",
        borderTop: "1px solid var(--divider)",
        borderRadius: "var(--r-xl) var(--r-xl) 0 0",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gap: 4,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1.5fr 1fr",
            md: "1.6fr 1fr 2fr",
          },
          maxWidth: 1200,
          mx: "auto",
        }}
      >
        {/* Brand */}
        <Grid container>
          <Stack alignItems="center" gap={1.25} mb={1.5}>
            <img src={mascotBunny} alt="" width={40} height={40} />
            <Logo isText />
          </Stack>
          <Typography
            sx={{
              fontSize: 13,
              maxWidth: 300,
            }}
          >
            Personalized bedtime stories — gently written and illustrated by AI,
            crafted with the Montessori spirit of curiosity, for the children
            you love most.
          </Typography>
        </Grid>

        {/* Product */}
        <Box>
          <Typography sx={headingSx}>Product</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {productLinks.map((l) => (
              <Link key={l.text} href={l.href} onClick={go(l.href)} sx={linkSx}>
                {l.text}
              </Link>
            ))}
          </Box>
        </Box>

        {/* Bedtime stories for */}
        <Box>
          <Typography sx={headingSx}>Bedtime stories for</Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 1,
            }}
            className="footer-landing-pages-links"
          >
            {landingLinks.map((l) => (
              <Link key={l.text} href={l.href} sx={linkSx}>
                {l.text}
              </Link>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Bottom bar */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          mt: 4,
          pt: 2.5,
          borderTop: "1px solid rgba(255,255,255,0.12)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1.5,
          fontSize: 12,
        }}
      >
        <span>© {new Date().getFullYear()} TalePod</span>
        <span>·</span>
        <Link
          href={routes.privacyPolicy}
          onClick={go(routes.privacyPolicy)}
          sx={linkSx}
        >
          Privacy
        </Link>
        <span>·</span>
        <Link
          href={routes.termsAndConditions}
          onClick={go(routes.termsAndConditions)}
          sx={linkSx}
        >
          Terms
        </Link>
        <Box sx={{ flex: 1 }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          Made in Switzerland &amp; Portugal
          <img
            src={SwitzerlandFlag}
            alt="Switzerland"
            width={18}
            height={18}
            style={{ verticalAlign: "middle" }}
          />
          <img
            src={PortugalFlag}
            alt="Portugal"
            width={18}
            height={18}
            style={{ verticalAlign: "middle" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
