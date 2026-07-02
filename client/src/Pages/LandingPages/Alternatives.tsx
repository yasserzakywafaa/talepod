import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Page from "src/components/shared/Page/Page";
import { ParticlesComponent } from "src/components/shared/ParticlesComponent";
import routes from "src/application/routes";
import { useNavigate } from "react-router-dom";
import { landingPageSeo } from "./landingPageSeo";
import { landingPageSeoProps } from "./landingPageSeoProps";
import CallToAction from "../Features/features/CallToAction";
import FAQ from "../Features/features/FAQ";

interface ComparisonRow {
  feature: string;
  talepod: string;
  storyfox: string;
  bedtimestory: string;
  storywish: string;
  bairn: string;
  dreampages: string;
}

// Feature claims sourced from each product's public homepage (July 2026).
const comparisonRows: ComparisonRow[] = [
  {
    feature: "Personalization (name, age, interests)",
    talepod: "Yes — child name, age, gender, interests",
    storyfox: "Yes — child name, age, interests",
    bedtimestory: "Yes — child and family characters",
    storywish: "Yes — custom characters from photo/sketch",
    bairn: "Yes — ages 2–12, age adaptation",
    dreampages: "Yes — custom characters and settings",
  },
  {
    feature: "Illustrations",
    talepod: "Watercolor art; comic & long formats",
    storyfox: "Illustrated story pages",
    bedtimestory: "Multiple art styles",
    storywish: "Illustrated picture-book pages",
    bairn: "Illustrated stories",
    dreampages: "Custom artwork per story",
  },
  {
    feature: "Narration / audio",
    talepod: "AI narration with multiple voices",
    storyfox: "Narration; parent voice cloning",
    bedtimestory: "Primarily text/image focused",
    storywish: "Narration available",
    bairn: "Narration included",
    dreampages: "Narration available",
  },
  {
    feature: "Languages",
    talepod: "11 languages",
    storyfox: "12+ languages (per homepage)",
    bedtimestory: "Multiple languages",
    storywish: "Not prominently listed",
    bairn: "App store listing",
    dreampages: "Multiple languages",
  },
  {
    feature: "Kid-safety positioning",
    talepod: "Kid-safe defaults; parent-led creation",
    storyfox: "Safety claims on homepage",
    bedtimestory: "Family-friendly content",
    storywish: "Family-oriented platform",
    bairn: "Safety filters & parental controls",
    dreampages: "Parent controls & moderation",
  },
  {
    feature: "Pricing model",
    talepod: "Free tier + subscription plans",
    storyfox: "Subscription (see storyfox.net)",
    bedtimestory: "Membership model (see bedtimestory.ai)",
    storywish: "Subscription + print books",
    bairn: "App subscription",
    dreampages: "Subscription (see dreampages.ai)",
  },
];

const competitorLinks = [
  { name: "StoryFox", url: "https://www.storyfox.net/" },
  { name: "Bedtimestory.ai", url: "https://www.bedtimestory.ai/" },
  { name: "Storywish", url: "https://storywish.ai/" },
  { name: "Bairn", url: "https://bairn.ai/" },
  { name: "DreamPages", url: "https://dreampages.ai/" },
];

const Alternatives = () => {
  const navigate = useNavigate();

  return (
    <Page
      {...landingPageSeoProps(landingPageSeo[routes.landingPages.alternatives])}
      className="alternatives-page"
    >
      <div style={{ position: "absolute", zIndex: "-1" }}>
        <ParticlesComponent />
      </div>

      <Container sx={{ py: { xs: 4, sm: 8 } }}>
        <Typography
          component="h1"
          variant="h3"
          color="primary"
          textAlign="center"
          gutterBottom
          sx={{ fontSize: { xs: "1.75rem", sm: "2.5rem" } }}
        >
          TalePod Alternatives — Best Personalized Bedtime Story Apps
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ maxWidth: 720, mx: "auto", mb: 4 }}
        >
          Looking for TalePod alternatives? Below is an honest comparison of
          popular personalized bedtime story apps for parents. Feature details are
          based on each product&apos;s public website as of 2026.
        </Typography>

        <TableContainer component={Card} sx={{ mb: 4, overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell>Feature</TableCell>
                <TableCell>
                  <strong>TalePod</strong>
                </TableCell>
                <TableCell>StoryFox</TableCell>
                <TableCell>Bedtimestory.ai</TableCell>
                <TableCell>Storywish</TableCell>
                <TableCell>Bairn</TableCell>
                <TableCell>DreamPages</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comparisonRows.map((row) => (
                <TableRow key={row.feature}>
                  <TableCell component="th" scope="row">
                    {row.feature}
                  </TableCell>
                  <TableCell>{row.talepod}</TableCell>
                  <TableCell>{row.storyfox}</TableCell>
                  <TableCell>{row.bedtimestory}</TableCell>
                  <TableCell>{row.storywish}</TableCell>
                  <TableCell>{row.bairn}</TableCell>
                  <TableCell>{row.dreampages}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              About these alternatives
            </Typography>
            <Typography variant="body2" paragraph>
              Each app above offers a different take on AI bedtime stories.
              StoryFox emphasizes narration and voice options; Bedtimestory.ai
              focuses on instant personalized tales with art styles; Storywish
              adds photo-based characters and printed keepsakes; Bairn is an
              app-first experience with co-creation; DreamPages positions itself
              as a broader storybook generator with moderation tools.
            </Typography>
            <Typography variant="body2" paragraph>
              TalePod combines personalized stories with watercolor
              illustrations, warm AI narration, 11 languages, and comic or long
              story formats — designed for a calm, parent-led bedtime routine.
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
              {competitorLinks.map((c) => (
                <Link
                  key={c.url}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {c.name}
                </Link>
              ))}
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(routes.create)}
            >
              Try TalePod free
            </Button>
          </CardContent>
        </Card>
      </Container>

      <CallToAction />
      <FAQ />
    </Page>
  );
};

export default Alternatives;
