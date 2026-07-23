import "./Contact.scss";

import { Box, Container, Grid, Typography } from "@mui/material";

import ContactForm from "./features/ContactForm";
import ContactMap from "./features/ContactMap";
import Page from "src/components/shared/Page/Page";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import { routes } from "src/application/routes";
import { useContactContext } from "./store/Provider";
import { useTranslation } from "react-i18next";

const ContactPage = () => {
  const { t } = useTranslation("page");
  const {
    store: {
      state: { isFetching },
    },
  } = useContactContext();

  return (
    <Page
      title={t("contact.pageTitle")}
      className="contact-page"
      isLoading={isFetching}
      seo={{ description: t("contact.pageTitle"), segment: routes.contact }}
    >
      <Box component="div" className="bg-image-character">
        <RandomImage />
      </Box>

      <Container
        className="view-story-container"
        sx={{
          pt: 4,
          pb: 4,
        }}
      >
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          {t("contact.title")}
        </Typography>

        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ContactForm />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <ContactMap />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ContactPage;
