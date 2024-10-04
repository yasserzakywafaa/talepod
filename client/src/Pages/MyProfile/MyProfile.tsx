import "./MyProfile.scss";

import { Box, Card, Container, Typography } from "@mui/material";

import Page from "src/components/shared/Page/Page";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import { useMyProfileContext } from "./store/Provider";
import { useApplicationContext } from "src/application/store/Provider";

const MyProfilePage = () => {
  const {
    store: {
      state: {
        auth: { isAuthenticated, user },
      },
    },
  } = useApplicationContext();

  const {
    store: {
      state: { isFetching },
    },
  } = useMyProfileContext();

  if (!isAuthenticated || !user) return <></>;

  console.log(
    new Date(user.subscription.subscriptionExpiry).toLocaleDateString()
  );

  return (
    <Page
      title="My Profile | TalePod"
      className="my'profile-page"
      isLoading={isFetching}
    >
      <Box component="div" className="bg-image-character">
        <RandomImage />
      </Box>

      <Container
        className="view-story-container"
        sx={{
          pt: 4,
          pb: 4,
        }}
      >
        <Typography variant="h4" component="h4" color="primary" gutterBottom>
          My Profile
        </Typography>

        <Typography variant="h4" component="h4">
          Welcome back, {user?.name.givenName}!
        </Typography>

        <Card className="user-info-card">
          <Typography variant="h5" component="h5">
            Subscription
          </Typography>

          <Typography variant="h5" component="h5">
            Type: {user.subscription.subscriptionPlanType}
          </Typography>

          <Typography variant="h5" component="h5">
            Expires at:{" "}
            {new Date(
              user.subscription.subscriptionExpiry
            ).toLocaleDateString()}
          </Typography>

          <Typography variant="h5" component="h5">
            Max Stories: {user.subscription.maxStoriesAllowed}
          </Typography>

          <Typography variant="h5" component="h5">
            Appearance: {user.subscription.preferences.theme}
          </Typography>
        </Card>
      </Container>
    </Page>
  );
};

export default MyProfilePage;
