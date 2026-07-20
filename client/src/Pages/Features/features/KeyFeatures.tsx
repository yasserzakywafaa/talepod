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
  Create,
  Devices,
  Favorite,
  Group,
  MenuBook,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const featureIcons = [Create, ChildCare, MenuBook, Favorite, Group, Devices];

const KeyFeatures = () => {
  const { t } = useTranslation("landing");
  const items = t("features.keyFeatures.items", {
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
        {t("features.keyFeatures.title")}
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        {t("features.keyFeatures.subtitle")}
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {items.map((item, index) => {
          const Icon = featureIcons[index];
          return (
            <Grid key={item.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    <Icon color="primary" fontSize="large" />
                  </Box>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default KeyFeatures;
