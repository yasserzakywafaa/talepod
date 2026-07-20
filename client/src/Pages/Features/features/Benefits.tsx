import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import {
  ChildCare,
  Favorite,
  Lightbulb,
  MenuBook,
  ScreenShare,
  Star,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const benefitIcons = [
  Lightbulb,
  Favorite,
  MenuBook,
  ChildCare,
  Star,
  ScreenShare,
];

const Benefits = () => {
  const { t } = useTranslation("landing");
  const items = t("features.benefits.items", {
    returnObjects: true,
  }) as Array<{ title: string; description: string }>;

  return (
    <Container sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h2"
        align="center"
        color="primary"
        gutterBottom
      >
        {t("features.benefits.title")}
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        {t("features.benefits.subtitle")}
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {items.map((item, index) => {
          const Icon = benefitIcons[index];
          return (
            <Grid key={item.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", p: 3 }}>
                    <Icon color="primary" fontSize="large" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="h6">{item.title}</Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {item.description}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Benefits;
