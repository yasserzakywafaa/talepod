import "./Contact.scss";

import { Box, Container, Grid, Typography } from "@mui/material";

import ContactForm from "./features/ContactForm";
import ContactMap from "./features/ContactMap";
import Page from "src/components/shared/Page/Page";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import { useContactContext } from "./store/Provider";

const ContactPage = () => {
  const {
    store: {
      state: { isFetching },
    },
  } = useContactContext();

  return (
    <Page
      title="Contact Us | TalePod"
      className="contact-page"
      isLoading={isFetching}
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
          Contact Us
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
