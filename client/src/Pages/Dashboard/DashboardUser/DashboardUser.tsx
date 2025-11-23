import { Box, CircularProgress, Grid, Typography } from "@mui/material";

import RoleSelector from "./features/RoleSelector";
import StoriesCard from "./features/StoriesCard";
import UserInfoCard from "./features/UserInfoCard";
import { useDashboardUserContext } from "./store/Provider";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const DashboardUser = () => {
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
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box>
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          User Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          The user you're looking for doesn't exist or has been deleted.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ marginY: 3 }}>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
        User Details
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        View and manage user information, blogs, campaigns, and permissions.
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
