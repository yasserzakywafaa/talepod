import "./MyProfile.scss";

import { Box, Card, Container, Grid, Switch, Typography } from "@mui/material";

import Page from "src/components/shared/Page/Page";
import ProfileAvatar from "src/components/shared/ProfileAvatar";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import SubscriptionSection from "./features/Subscription";
import { useApplicationContext } from "src/application/store/Provider";
import { useEffect } from "react";
import { useMyProfileContext } from "./store/Provider";

const MyProfilePage = () => {
  const {
    store: {
      state: {
        auth,
        auth: { isAuthenticated, user },
        themeMode,
      },
      toggleThemeMode,
    },
  } = useApplicationContext();
  const {
    store: {
      state: { isFetching },
    },
    manager: { handleGetSubscriptionDetails, handleUpdateUserInfo },
  } = useMyProfileContext();

  if (!user) return;

  const handleOnDarkModeSwitchChange = async () => {
    await handleUpdateUserInfo({
      preferences: {
        ...user.preferences,
        theme: themeMode === "dark" ? "light" : "dark",
      },
    });
    toggleThemeMode();
  };

  if (!isAuthenticated || !user) return <></>;

  useEffect(() => {
    if (user.subscription && user.subscription.id) {
      handleGetSubscriptionDetails();
    }
  }, [user]);

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
        <Typography
          variant="h4"
          component="h4"
          color="primary"
          sx={{ marginBottom: 6 }}
        >
          My Profile
        </Typography>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="fit-content"
        >
          <ProfileAvatar
            auth={auth}
            verifiedBadgeSize={32}
            avatarSize={{ width: 100, height: 100 }}
          />

          <Typography variant="h5" component="h5" marginLeft={2}>
            Hi {user?.name.givenName} 👋🏻
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ marginY: 3 }}>
          {/* Profile Information */}
          <Grid item xs={12} md={8}>
            <Card elevation={3} sx={{ padding: 3 }}>
              <Typography variant="h5">Profile Information</Typography>

              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h6"
                    component="p"
                    className="text-underline"
                  >
                    Full Name
                  </Typography>

                  <span className="bold">
                    {`${user.name.givenName} ${user.name.familyName}`}
                  </span>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h6"
                    component="p"
                    className="text-underline"
                  >
                    Email
                  </Typography>
                  <span className="bold">{`${user.email}`}</span>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h6"
                    component="p"
                    className="text-underline"
                  >
                    Date joined
                  </Typography>
                  <span className="bold">
                    {new Date(user.createdAt).toLocaleString("en-GB", {
                      dateStyle: "short",
                    })}
                  </span>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" component="p">
                    <span className="text-underline">Appearance</span>
                    <Switch
                      size="medium"
                      value="dark-mode"
                      checked={themeMode === "dark"}
                      onChange={handleOnDarkModeSwitchChange}
                    />
                    <span className="bold">
                      {themeMode.toLocaleUpperCase()}
                      {/* {user.preferences.theme} */}
                    </span>
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <SubscriptionSection />
        </Grid>
      </Container>
    </Page>
  );
};

export default MyProfilePage;
