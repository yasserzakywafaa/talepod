import "./Footer.scss";

import { Box, Grid, Link, Stack, Typography } from "@mui/material";

import Logo from "../Logo";
import PortugalFlag from "src/assets/images/portugal_flag.png";
import SwitzerlandFlag from "src/assets/images/switzerland_flag.png";
import { honey300 } from "src/application/shared/themes";
import mascotBunny from "src/assets/images/sleeping_bunny_with_a_moon.webp";
import APP_CONSTANTS from "src/application/shared/app_constants";
import { routes } from "src/application/routes";
import { useLocalizedPath } from "@yasserzakywafaa/client-core/web/i18n";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const localizedPath = useLocalizedPath();

  const landingLinks = [
    {
      text: t("footer.landingLinks.bedtimeStoriesForKids"),
      href: localizedPath(routes.landingPages.bedtimeStoriesForKids),
    },
    {
      text: t("footer.landingLinks.bedtimeStoriesForAdults"),
      href: localizedPath(routes.landingPages.bedtimeStoriesForAdults),
    },
    {
      text: t("footer.landingLinks.shortBedtimeStories"),
      href: localizedPath(routes.landingPages.shortBedtimeStories),
    },
    {
      text: t("footer.landingLinks.christmasBedtimeStories"),
      href: localizedPath(routes.landingPages.christmasBedtimeStories),
    },
    {
      text: t("footer.landingLinks.bedtimeStoriesForGirlfriend"),
      href: localizedPath(routes.landingPages.bedtimeStoriesForGirlfriend),
    },
    {
      text: t("footer.landingLinks.bedtimeStoriesForToddlers"),
      href: localizedPath(routes.landingPages.bedtimeStoriesForToddlers),
    },
    {
      text: t("footer.landingLinks.educationalBedtimeStories"),
      href: localizedPath(routes.landingPages.educationalBedtimeStories),
    },
    {
      text: t("footer.landingLinks.babyBedtimeStories"),
      href: localizedPath(routes.landingPages.babyBedtimeStories),
    },
    {
      text: t("footer.landingLinks.bestBedtimeStories"),
      href: localizedPath(routes.landingPages.bestBedtimeStories),
    },
    {
      text: t("footer.landingLinks.quickBedtimeStories"),
      href: localizedPath(routes.landingPages.quickBedtimeStories),
    },
  ];

  const productLinks: Array<{
    text: string;
    href: string;
    external?: boolean;
  }> = [
    { text: t("footer.productLinks.createStory"), href: localizedPath(routes.create) },
    { text: t("footer.productLinks.library"), href: localizedPath(routes.library) },
    { text: t("footer.productLinks.pricing"), href: localizedPath(routes.pricing) },
    {
      text: t("footer.productLinks.alternatives"),
      href: localizedPath(routes.landingPages.alternatives),
    },
    {
      text: t("footer.productLinks.storyGenerator"),
      href: localizedPath(routes.landingPages.personalizedBedtimeStoryGenerator),
    },
    { text: t("footer.productLinks.blog"), href: APP_CONSTANTS.BLOG_URL, external: true },
    { text: t("footer.productLinks.contact"), href: localizedPath(routes.contact) },
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
    "&:hover": { color: honey300 },
  };

  const headingSx = {
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: honey300,
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
        background: "background.default",
        color: "text.primary",
        border: `1px solid ${honey300}`,
        borderBottom: "none",
        backdropFilter: "blur(10px)",
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
        <Grid container>
          <Stack
            sx={{
              alignItems: "center",
              gap: 1.25,
              mb: 1.5,
            }}
          >
            <img src={mascotBunny} alt="" width={40} height={40} />
            <Logo isText />
          </Stack>
          <Typography
            sx={{
              fontSize: 13,
              maxWidth: 300,
            }}
          >
            {t("footer.tagline")}
          </Typography>
        </Grid>

        <Box>
          <Typography sx={headingSx}>{t("footer.product")}</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {productLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={l.external ? undefined : go(l.href)}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                sx={linkSx}
              >
                {l.text}
              </Link>
            ))}
          </Box>
        </Box>

        <Box>
          <Typography sx={headingSx}>{t("footer.landingSectionTitle")}</Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 1,
            }}
            className="footer-landing-pages-links"
          >
            {landingLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={go(l.href)} sx={linkSx}>
                {l.text}
              </Link>
            ))}
          </Box>
        </Box>
      </Box>
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
          href={localizedPath(routes.privacyPolicy)}
          onClick={go(localizedPath(routes.privacyPolicy))}
          sx={linkSx}
        >
          {t("footer.privacyShort")}
        </Link>
        <span>·</span>
        <Link
          href={localizedPath(routes.termsAndConditions)}
          onClick={go(localizedPath(routes.termsAndConditions))}
          sx={linkSx}
        >
          {t("footer.termsShort")}
        </Link>
        <Box sx={{ flex: 1 }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          {t("footer.madeIn")}
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
