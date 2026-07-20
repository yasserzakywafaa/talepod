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
import routes from "src/application/routes";
import { useNavigate } from "react-router-dom";
import CallToAction from "../Features/features/CallToAction";
import FAQ from "../Features/features/FAQ";
import { useLandingPageSeo } from "src/shared/i18n/useLandingPageSeo";
import { useTranslation } from "react-i18next";

const Alternatives = () => {
  const { t } = useTranslation("landing");
  const seoProps = useLandingPageSeo("alternatives");
  const navigate = useNavigate();

  const comparisonRows = t("alternatives.rows", {
    returnObjects: true,
  }) as Array<{
    feature: string;
    talepod: string;
    storyfox: string;
    bedtimestory: string;
    storywish: string;
    bairn: string;
    dreampages: string;
  }>;

  return (
    <Page {...seoProps} className="alternatives-page">
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
          {t("alternatives.heading")}
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
          {t("alternatives.intro")}
        </Typography>

        <TableContainer component={Card} sx={{ mb: 4, overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell>{t("alternatives.table.feature")}</TableCell>
                <TableCell>
                  <strong>{t("alternatives.table.talepod")}</strong>
                </TableCell>
                <TableCell>{t("alternatives.table.storyfox")}</TableCell>
                <TableCell>{t("alternatives.table.bedtimestory")}</TableCell>
                <TableCell>{t("alternatives.table.storywish")}</TableCell>
                <TableCell>{t("alternatives.table.bairn")}</TableCell>
                <TableCell>{t("alternatives.table.dreampages")}</TableCell>
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
          {t("alternatives.footer")}
        </Typography>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {t("alternatives.whyHeading")}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {t("alternatives.whyBody")}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(routes.create)}
            >
              {t("alternatives.cta")}
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
