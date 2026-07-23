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
import { routes } from "src/application/routes";
import { useLocalizedPath } from "@yasserzakywafaa/client-core/web/i18n";
import { useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";

const benefitIcons = [
  ChildCareOutlined,
  EmojiObjectsOutlined,
  DevicesOutlined,
  LocalLibraryOutlined,
];

const PersonalizedBedtimeStoryText = () => {
  const { t } = useTranslation("landing");
  const navigate = useNavigate();
  const localizedPath = useLocalizedPath();

  const benefits = t("features.personalizedText.benefits", {
    returnObjects: true,
  }) as Array<{ primary: string; secondary: string }>;

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
          fontSize: { xs: "1.75rem", sm: "2rem" },
        }}
      >
        {t("features.personalizedText.howToHeading")}
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
              justifyContent: "center",
            }}
          >
            <Typography variant="h5" gutterBottom>
              {t("features.personalizedText.whyHeading")}
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              <Trans
                t={t}
                i18nKey="features.personalizedText.whyBody"
                components={{
                  whyLink: (
                    <Link
                      href={localizedPath(routes.library)}
                      onClick={handleFooterLinkItemClick(localizedPath(routes.library))}
                      sx={{ color: "text.secondary", pr: "5px" }}
                    />
                  ),
                }}
              />
            </Typography>

            <Typography variant="h5" gutterBottom>
              {t("features.personalizedText.introHeading")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <Trans
                t={t}
                i18nKey="features.personalizedText.introBody"
                components={{
                  introLink: (
                    <Link
                      href={localizedPath(routes.create)}
                      onClick={handleFooterLinkItemClick(localizedPath(routes.create))}
                      sx={{ color: "text.secondary", px: "5px" }}
                    />
                  ),
                }}
              />
            </Typography>
          </Box>

          <Box sx={{ maxWidth: { sm: "50%" }, margin: "auto" }}>
            <img
              src={Unicorn}
              alt={t("features.personalizedText.imageAlt")}
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
              justifyContent: "center",
            }}
          >
            <Typography variant="h5" gutterBottom>
              {t("features.personalizedText.benefitsHeading")}
            </Typography>
            <List>
              {benefits.map((benefit, index) => {
                const Icon = benefitIcons[index];
                return (
                  <ListItem key={benefit.primary}>
                    <ListItemIcon>
                      <Icon fontSize="large" color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={benefit.primary}
                      secondary={benefit.secondary}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Box>

          <Box sx={{ maxWidth: { sm: "50%" }, margin: "auto" }}>
            <RandomImage />
          </Box>
        </CardContent>
      </Card>
      <Typography variant="body1" sx={{ mb: 2 }}>
        <Trans
          t={t}
          i18nKey="features.personalizedText.footerBody"
          components={{
            libraryLink: (
              <Link
                href={localizedPath(routes.library)}
                onClick={handleFooterLinkItemClick(localizedPath(routes.library))}
                sx={{ color: "text.secondary", pr: "5px" }}
              />
            ),
            createLink: (
              <Link
                href={localizedPath(routes.create)}
                onClick={handleFooterLinkItemClick(localizedPath(routes.create))}
                sx={{ color: "text.secondary", pr: "5px" }}
              />
            ),
            privacyLink: (
              <Link
                href={localizedPath(routes.privacyPolicy)}
                onClick={handleFooterLinkItemClick(localizedPath(routes.privacyPolicy))}
                sx={{ color: "text.secondary", pr: "5px" }}
              />
            ),
          }}
        />
      </Typography>
      <Box sx={{ width: "100%", textAlign: "center" }}>
        <Button
          size="large"
          color="primary"
          LinkComponent="a"
          variant="contained"
          sx={{ my: 2, px: 2 }}
          href={localizedPath(routes.create)}
          endIcon={<AutoFixHighOutlined />}
          onClick={handleFooterLinkItemClick(localizedPath(routes.create))}
        >
          {t("features.personalizedText.cta")}
        </Button>
      </Box>
    </Container>
  );
};

export default PersonalizedBedtimeStoryText;
