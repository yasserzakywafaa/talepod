import "./Contact.scss";

import { Container, Grid, Typography } from "@mui/material";

import ContactForm from "./features/ContactForm";
import ContactMap from "./features/ContactMap";
import Page from "src/components/shared/Page/Page";
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
          <Grid item xs={12} md={6}>
            <ContactForm />
          </Grid>

          <Grid item xs={12} md={6}>
            <ContactMap />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ContactPage;
