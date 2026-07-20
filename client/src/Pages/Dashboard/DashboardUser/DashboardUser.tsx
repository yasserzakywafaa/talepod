import { Box, CircularProgress, Grid, Typography } from "@mui/material";

import RoleSelector from "./features/RoleSelector";
import StoriesCard from "./features/StoriesCard";
import UserInfoCard from "./features/UserInfoCard";
import { useDashboardUserContext } from "./store/Provider";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DashboardUser = () => {
  const { t } = useTranslation("dashboard");
  const { userId } = useParams<{ userId: string }>();
  const {
    store: {
      state: { isFetching, user, storiesCount },
    },
    manager: { setUp, handleUpdateUserRole },
  } = useDashboardUserContext();

  useEffect(() => {
    if (userId) {
      setUp(userId);
    }
  }, [userId]);

  if (isFetching && !user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px"
        }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box>
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          {t("admin.user.notFoundTitle")}
        </Typography>
        <Typography variant="body1" sx={{
          color: "text.secondary"
        }}>
          {t("admin.user.notFoundDescription")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ marginY: 3 }}>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
        {t("admin.user.title")}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          mb: 3
        }}>
        {t("admin.user.subtitle")}
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <UserInfoCard user={user} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <RoleSelector user={user} onRoleChange={handleUpdateUserRole} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <StoriesCard storiesCount={storiesCount} userId={user._id} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardUser;
