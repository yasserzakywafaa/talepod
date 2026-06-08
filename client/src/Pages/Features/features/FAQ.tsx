import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { Card } from "@mui/material";
import Container from "@mui/material/Container";
import { ExpandMoreOutlined } from "@mui/icons-material";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import routes from "src/application/routes";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function FAQ() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleLinkClick =
    (name: string) =>
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();

      switch (name) {
        case "create":
          navigate(routes.create);
          break;
        case "library":
          navigate(routes.library);
          break;
        case "contact":
          navigate(routes.contact);
          break;
      }
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
        color="text.primary"
        sx={{
          width: { sm: "100%", md: "60%" },
          textAlign: { sm: "left", md: "center" },
        }}
      >
        Frequently asked questions
      </Typography>
      <Card sx={{ width: "100%" }}>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreOutlined color="primary" />}
            aria-controls="panel1d-content"
            id="panel1d-header"
          >
            <Typography component="h3" variant="subtitle1">
              How do I create a bedtime story on your platform?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: "100%", md: "70%" } }}
            >
              To create a bedtime story, simply navigate to the{" "}
              <Link
                href={`${window.location.origin}/create`}
                onClick={handleLinkClick("create")}
              >
                Create Story
              </Link>{" "}
              page and fill in the fields to create your own personalized story.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreOutlined color="primary" />}
            aria-controls="panel2d-content"
            id="panel2d-header"
          >
            <Typography component="h3" variant="subtitle1">
              Can I read and listen to stories created by other users?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: "100%", md: "70%" } }}
            >
              Absolutely! You can explore and enjoy a wide range of stories
              created by our team and other users.
              <br />
              Browse through the{" "}
              <Link
                href={`${window.location.origin}${routes.library}`}
                onClick={handleLinkClick("library")}
              >
                Library
              </Link>{" "}
              page to find both text and audio versions of various bedtime
              stories.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expanded === "panel4"}
          onChange={handleChange("panel4")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreOutlined color="primary" />}
            aria-controls="panel4d-content"
            id="panel4d-header"
          >
            <Typography component="h3" variant="subtitle1">
              How do I contact customer support if I have a question or issue?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: "100%", md: "70%" } }}
            >
              If you have any questions or encounter any issues, you can contact
              our customer support team by visiting the{" "}
              <Link
                href={`${window.location.origin}/contact`}
                onClick={handleLinkClick("contact")}
              >
                Contact
              </Link>{" "}
              page from our menu.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expanded === "panel5"}
          onChange={handleChange("panel5")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreOutlined color="primary" />}
            aria-controls="panel5d-content"
            id="panel5d-header"
          >
            <Typography component="h3" variant="subtitle1">
              Are there any guidelines for creating stories?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: "100%", md: "70%" } }}
            >
              We make sure that all stories created are appropriate for children
              and suitable for young audiences.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expanded === "panel6"}
          onChange={handleChange("panel6")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreOutlined color="primary" />}
            aria-controls="panel6d-content"
            id="panel6d-header"
          >
            <Typography component="h3" variant="subtitle1">
              Can I share the stories I create on social media?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: "100%", md: "70%" } }}
            >
              Yes, you can share your stories on social media directly from our
              platform. Use the share button on your story page to post it on
              various social media platforms.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreOutlined color="primary" />}
            aria-controls="panel3d-content"
            id="panel3d-header"
          >
            <Typography component="h3" variant="subtitle1">
              Is there a way to filter stories based on age or genre?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="body2"
              gutterBottom
              sx={{ maxWidth: { sm: "100%", md: "70%" } }}
            >
              Certainly! Our platform allows you to filter stories by age group
              and genre, ensuring you find the perfect story for your child's
              bedtime.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Card>
    </Container>
  );
}
