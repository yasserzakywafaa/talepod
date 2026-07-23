import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { Card } from "@mui/material";
import Container from "@mui/material/Container";
import { ExpandMoreOutlined } from "@mui/icons-material";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { routes } from "src/application/routes";
import { useLocalizedPath } from "@yasserzakywafaa/client-core/web/i18n";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import SafetyFaqAccordions from "./SafetyFaqAccordions";

const faqItemKeys = [
  "create",
  "library",
  "contact",
  "guidelines",
  "share",
  "filter",
] as const;

export default function FAQ() {
  const { t } = useTranslation("landing");
  const navigate = useNavigate();
  const localizedPath = useLocalizedPath();
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleLinkClick =
    (name: string) =>
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();

      switch (name) {
        case "create":
          navigate(localizedPath(routes.create));
          break;
        case "library":
          navigate(localizedPath(routes.library));
          break;
        case "contact":
          navigate(localizedPath(routes.contact));
          break;
      }
    };

  const linkComponents = {
    createLink: (
      <Link
        href={`${window.location.origin}${localizedPath(routes.create)}`}
        onClick={handleLinkClick("create")}
      />
    ),
    libraryLink: (
      <Link
        href={`${window.location.origin}${localizedPath(routes.library)}`}
        onClick={handleLinkClick("library")}
      />
    ),
    contactLink: (
      <Link
        href={`${window.location.origin}${localizedPath(routes.contact)}`}
        onClick={handleLinkClick("contact")}
      />
    ),
    br: <br />,
  };

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
        component="h5"
        variant="h5"
        sx={{
          color: "text.primary",
          width: { sm: "100%", md: "60%" },
          textAlign: { sm: "left", md: "center" },
        }}
      >
        {t("features.faq.title")}
      </Typography>
      <Card sx={{ width: "100%" }}>
        {faqItemKeys.map((key, index) => {
          const panelId = `panel${index + 1}`;
          return (
            <Accordion
              key={key}
              expanded={expanded === panelId}
              onChange={handleChange(panelId)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreOutlined color="primary" />}
                aria-controls={`${panelId}d-content`}
                id={`${panelId}d-header`}
              >
                <Typography component="h3" variant="subtitle1">
                  {t(`features.faq.items.${key}.question`)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ maxWidth: { sm: "100%", md: "70%" } }}
                >
                  {["create", "library", "contact"].includes(key) ? (
                    <Trans
                      t={t}
                      i18nKey={`features.faq.items.${key}.answer`}
                      components={linkComponents}
                    />
                  ) : (
                    t(`features.faq.items.${key}.answer`)
                  )}
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}

        <SafetyFaqAccordions />
      </Card>
    </Container>
  );
}
