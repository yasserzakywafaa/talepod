import { Box, Button, Grid, TextField } from "@mui/material";

import { SendOutlined } from "@mui/icons-material";
import { useContactContext } from "../store/Provider";
import { useTranslation } from "react-i18next";

const ContactForm = () => {
  const { t } = useTranslation("page");
  const {
    store: { state },
    manager: { handleUpdateContactForm, handleSubmitContactForm },
  } = useContactContext();

  const handleOnFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    handleUpdateContactForm(name, value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSubmitContactForm(state.contactForm);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            required
            fullWidth
            name="name"
            label={t("contact.name")}
            value={state.contactForm.name}
            onChange={handleOnFieldChange}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            required
            fullWidth
            type="email"
            label={t("contact.email")}
            name="email"
            value={state.contactForm.email}
            onChange={handleOnFieldChange}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            required
            fullWidth
            name="subject"
            label={t("contact.subject")}
            value={state.contactForm.subject}
            onChange={handleOnFieldChange}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            required
            multiline
            fullWidth
            rows={4}
            name="message"
            label={t("contact.message")}
            value={state.contactForm.message}
            onChange={handleOnFieldChange}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button type="submit" variant="contained" endIcon={<SendOutlined />}>
            {t("contact.sendMessage")}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactForm;
