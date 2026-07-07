import {
  Button,
  Card,
  CardContent,
  Container,
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
          gutterBottom
          sx={{
            textAlign: "center",
            fontSize: { xs: "1.75rem", sm: "2.5rem" }
          }}>
          TalePod Alternatives — Best Personalized Bedtime Story Apps
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            textAlign: "center",
            maxWidth: 720,
            mx: "auto",
            mb: 4
          }}>
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

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            textAlign: "center",
            maxWidth: 720,
            mx: "auto",
            mb: 4
          }}>
          We compared TalePod against popular apps in this category.
        </Typography>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Why choose TalePod
            </Typography>
            <Typography variant="body2" paragraph>
              TalePod combines personalized stories with watercolor
              illustrations, warm AI narration, 11 languages, and comic or long
              story formats — designed for a calm, parent-led bedtime routine.
              Kid-safe defaults and parent-led creation help keep every story
              age-appropriate for your child.
            </Typography>
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
