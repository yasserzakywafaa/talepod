import "./MyProfile.scss";

import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import { AutoAwesomeOutlined, HeartBrokenOutlined } from "@mui/icons-material";

import Page from "src/components/shared/Page/Page";
import ProfileAvatar from "src/components/shared/ProfileAvatar";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import { SubscriptionPlanEnum } from "src/shared/user";
import { useApplicationContext } from "src/application/store/Provider";
import { useCancelSubscriptionModalContext } from "src/components/Modals/CancelSubscriptionModal/store/Provider";
import { useEffect } from "react";
import { useMyProfileContext } from "./store/Provider";
import { usePricingModalContext } from "src/components/Modals/PricingModal/store/Provider";

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
      state: { isFetching, subscription },
    },
    manager: { handleGetSubscriptionDetails, handleUpdateUserInfo },
  } = useMyProfileContext();
  const {
    store: { handleTogglePricingModal },
  } = usePricingModalContext();
  const {
    store: { handleToggleCancelSubscriptionModal },
  } = useCancelSubscriptionModalContext();

  if (!user) return;

  const isCancelledButStillActive =
    subscription && subscription.cancel_at_period_end;

  const handleOnDarkModeSwitchChange = async () => {
    await handleUpdateUserInfo({
      preferences: {
        ...user.preferences,
        theme: themeMode === "dark" ? "light" : "dark",
      },
    });
    toggleThemeMode();
  };

  const handleOnCancelSubscriptionClick = () => {
    handleToggleCancelSubscriptionModal();
  };

  const handleOnSubscribeClick = () => handleTogglePricingModal();

  const storiesCounterLeft =
    user.subscription.maxStoriesAllowed - user.storyCount;

  const hasMaxStoriesLimit =
    user.storyCount >= user.subscription.maxStoriesAllowed;

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
            Welcome back, {user?.name.givenName}!
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

          {/* Subscription */}
          <Grid item xs={12} md={8}>
            <Card elevation={3} sx={{ padding: 3 }}>
              <Typography variant="h5">Subscription</Typography>
              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item xs={6} md={4}>
                  <Typography
                    variant="h6"
                    component="p"
                    className="text-underline"
                  >
                    Plan Type
                  </Typography>
                  <span className="bold">{user.subscription.type}</span>
                </Grid>

                {user.isPaidUser &&
                user.subscription.type !== SubscriptionPlanEnum.Free ? (
                  <>
                    <Grid item xs={6} md={4}>
                      <Typography
                        variant="h6"
                        component="p"
                        className="text-underline"
                      >
                        Start Date
                      </Typography>
                      <span className="bold">
                        {new Date(user.subscription.startDate).toLocaleString(
                          "en-GB",
                          {
                            dateStyle: "short",
                          }
                        )}
                      </span>
                    </Grid>

                    <Grid item xs={6} md={4}>
                      <Typography
                        variant="h6"
                        component="p"
                        className="text-underline"
                      >
                        End Date
                      </Typography>
                      <span className="bold">
                        {new Date(user.subscription.endDate).toLocaleString(
                          "en-GB",
                          {
                            dateStyle: "short",
                          }
                        )}
                      </span>
                    </Grid>

                    <Grid item xs={12} sm={6} md={8}>
                      <Alert
                        severity="info"
                        variant="outlined"
                        sx={{ width: "fit-content" }}
                        icon={<AutoAwesomeOutlined />}
                      >
                        You have{" "}
                        <span className="bold">{storiesCounterLeft}</span>{" "}
                        stories left out of{" "}
                        <span className="bold">
                          {user.subscription.maxStoriesAllowed}
                        </span>
                      </Alert>
                    </Grid>

                    <Grid item xs={12} sm={3} md={4}>
                      <Button
                        fullWidth
                        color="error"
                        variant="contained"
                        sx={{ marginTop: 1 }}
                        onClick={handleOnCancelSubscriptionClick}
                      >
                        Cancel Subscription
                      </Button>
                    </Grid>
                  </>
                ) : (
                  <Grid item xs={6} md={6}>
                    <Button
                      fullWidth
                      color="primary"
                      variant="contained"
                      sx={{ marginTop: 1 }}
                      // disabled={!!isCancelledButStillActive}
                      onClick={handleOnSubscribeClick}
                    >
                      Upgrade
                    </Button>
                  </Grid>
                )}

                {hasMaxStoriesLimit && (
                  <Grid item xs={12} md={12}>
                    <Alert
                      severity="warning"
                      variant="outlined"
                      sx={{ width: "fit-content" }}
                      icon={<AutoAwesomeOutlined />}
                    >
                      {`You have consumed your maximum credit of ${user.subscription.maxStoriesAllowed} stories`}
                    </Alert>
                  </Grid>
                )}

                {isCancelledButStillActive &&
                  subscription.current_period_end && (
                    <Grid item xs={12} md={12}>
                      <Alert
                        severity="info"
                        variant="outlined"
                        icon={<HeartBrokenOutlined />}
                      >
                        It is sad to see you go. Enjoy the subscription benefits
                        until{" "}
                        <span className="bold">
                          {new Date(
                            subscription.current_period_end * 1000
                          ).toLocaleString("en-GB", {
                            dateStyle: "short",
                          })}
                        </span>
                      </Alert>
                    </Grid>
                  )}
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default MyProfilePage;
