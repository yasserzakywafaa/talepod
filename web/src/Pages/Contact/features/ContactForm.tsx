import { Box, Button, Grid, TextField } from "@mui/material";

import ContactSecurity, { useContactVerified } from "./ContactSecurity";
import { SendOutlined } from "@mui/icons-material";
import { useContactContext } from "../store/Provider";
import { useTranslation } from "react-i18next";

const ContactForm = () => {
  const { t } = useTranslation("page");
  const {
    store: { state },
    manager: { handleUpdateContactForm, handleSubmitContactForm },
  } = useContactContext();
  const verified = useContactVerified();

  const handleOnFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    handleUpdateContactForm(name, value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Enter key or requestSubmit(): same rule as the disabled button.
    if (!verified || state.isFetching) return;
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
            slotProps={{ htmlInput: { maxLength: 100 } }}
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
            slotProps={{ htmlInput: { maxLength: 254 } }}
            value={state.contactForm.email}
            onChange={handleOnFieldChange}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            required
            fullWidth
            name="subject"
            slotProps={{ htmlInput: { maxLength: 200 } }}
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
            slotProps={{ htmlInput: { maxLength: 5000 } }}
            label={t("contact.message")}
            value={state.contactForm.message}
            onChange={handleOnFieldChange}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <ContactSecurity />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendOutlined />}
            disabled={!verified || state.isFetching}
          >
            {verified ? t("contact.sendMessage") : t("contact.verifying")}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactForm;
