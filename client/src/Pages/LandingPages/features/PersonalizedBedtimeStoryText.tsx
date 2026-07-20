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
import { useTranslation } from "react-i18next";
import { LandingPageContentKey } from "src/shared/i18n/useLandingPageSeo";
import LandingPageBenefitsList from "./LandingPageBenefitsList";

interface LandingPagePersonalizedBedtimeStoryText {
  pageKey: LandingPageContentKey;
  personalizeImage: string;
  benefitsImage: JSX.Element;
}

const PersonalizedBedtimeStoryText = (
  props: LandingPagePersonalizedBedtimeStoryText,
) => {
  const { t } = useTranslation("landing");
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
        {t("shared.howToHeading")}
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
              {t("shared.whyHeading")}
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              <Link
                href={routes.termsAndConditions}
                onClick={handleFooterLinkItemClick(routes.library)}
                sx={{
                  color: "text.secondary",
                  pr: "5px"
                }}>
                {t("shared.whyLink")}
              </Link>
              {t(`pages.${props.pageKey}.whyPersonalize`)}
            </Typography>

            <Typography variant="h5" gutterBottom>
              {t("shared.introHeading")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t("shared.introPrefix")}
              <Link
                href={routes.termsAndConditions}
                onClick={handleFooterLinkItemClick(routes.create)}
                sx={{
                  color: "text.secondary",
                  px: "5px"
                }}>
                {t("shared.introLink")}
              </Link>
              {t("shared.introSuffix")} {t(`pages.${props.pageKey}.introducing`)}
            </Typography>
          </Box>

          <Box sx={{ maxWidth: { sm: "50%" }, margin: "auto" }}>
            <img
              src={props.personalizeImage}
              alt={t("shared.imageAlt")}
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
              {t("shared.benefitsHeading")}
            </Typography>
            <LandingPageBenefitsList pageKey={props.pageKey} />
          </Box>

          <Box sx={{ maxWidth: { sm: "50%" }, margin: "auto" }}>
            {props.benefitsImage}
          </Box>
        </CardContent>
      </Card>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {t("shared.footerPrefix")}{" "}
        <Link
          href={routes.library}
          onClick={handleFooterLinkItemClick(routes.library)}
          sx={{
            color: "text.secondary",
            pr: "5px"
          }}>
          {t("shared.footerLibraryLink")}
        </Link>{" "}
        {t("shared.footerMiddle")}{" "}
        <Link
          href={routes.create}
          onClick={handleFooterLinkItemClick(routes.create)}
          sx={{
            color: "text.secondary",
            pr: "5px"
          }}>
          {t("shared.footerCreateLink")}
        </Link>{" "}
        {t("shared.footerSuffix")}{" "}
        <Link
          href={routes.privacyPolicy}
          onClick={handleFooterLinkItemClick(routes.privacyPolicy)}
          sx={{
            color: "text.secondary",
            pr: "5px"
          }}>
          {t("shared.privacyLink")}
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
          {t("shared.cta")}
        </Button>
      </Box>
    </Container>
  );
};

export default PersonalizedBedtimeStoryText;
