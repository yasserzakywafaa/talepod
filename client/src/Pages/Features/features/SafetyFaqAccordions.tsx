import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { ExpandMoreOutlined } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import { safetyFaqItems } from "src/shared/utils/structuredDataSchemas";

interface SafetyFaqAccordionsProps {
  panelIdPrefix?: string;
  startPanelIndex?: number;
}

export default function SafetyFaqAccordions({
  panelIdPrefix = "safety",
  startPanelIndex = 7,
}: SafetyFaqAccordionsProps) {
  return (
    <>
      {/* TODO: legal review — safety/COPPA FAQ copy below is draft only. */}
      {safetyFaqItems.map((item, index) => {
        const panelId = `${panelIdPrefix}${startPanelIndex + index}`;
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
    </>
  );
}
