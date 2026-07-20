import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { Dashboard as DashboardIcon } from "@mui/icons-material";
import routes from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { useDashboardOverviewContext } from "./store/Provider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardOverview = () => {
  const { t } = useTranslation("dashboard");
  const navigate = useNavigate();
  const {
    store: {
      state: { usersCount, storiesCount },
    },
    manager: { setUp },
  } = useDashboardOverviewContext();
  const {
    store: {
      state: {
        auth: { user },
      },
    },
  } = useApplicationContext();

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    setUp();
  }, []);

  return (
    <Box>
      <Box>
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          {t("overview.welcomeBack", {
            name: `${user?.name.givenName} ${user?.name.familyName}`,
          })}
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            onClick={() => handleCardClick(routes.dashboard.users)}
            sx={{ cursor: "pointer" }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2
                }}>
                <DashboardIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">{t("overview.totalUsers")}</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {usersCount !== null ? usersCount : "--"}
              </Typography>
              <Typography variant="body2" sx={{
                color: "text.secondary"
              }}>
                {t("overview.usersActive")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            onClick={() => handleCardClick(routes.dashboard.stories)}
            sx={{ cursor: "pointer" }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2
                }}>
                <DashboardIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">{t("overview.totalStories")}</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {storiesCount !== null ? storiesCount : "--"}
              </Typography>
              <Typography variant="body2" sx={{
                color: "text.secondary"
              }}>
                {t("overview.storiesCreated")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;
