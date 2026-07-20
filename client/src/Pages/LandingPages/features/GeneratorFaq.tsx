import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { Card } from "@mui/material";
import Container from "@mui/material/Container";
import { ExpandMoreOutlined } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import { generatorFaqItems } from "src/shared/content/faqContent";
import { useTranslation } from "react-i18next";

export default function GeneratorFaq() {
  const { t } = useTranslation("landing");

  return (
    <Container
      id="faq"
      sx={{
        pt: { xs: 4, sm: 8 },
        pb: 8,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Typography
        component="h2"
        variant="h5"
        sx={{
          color: "text.primary",
          width: { sm: "100%", md: "60%" },
          textAlign: { sm: "left", md: "center" }
        }}>
        {t("faq.generatorHeading")}
      </Typography>
      <Card sx={{ width: "100%" }}>
        {generatorFaqItems.map((item, index) => {
          const panelId = `generator-faq-${index}`;
          return (
            <Accordion key={panelId}>
              <AccordionSummary
                expandIcon={<ExpandMoreOutlined color="primary" />}
                aria-controls={`${panelId}-content`}
                id={`${panelId}-header`}
              >
                <Typography component="h3" variant="subtitle1">
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ maxWidth: { sm: "100%", md: "70%" } }}
                >
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Card>
    </Container>
  );
}
