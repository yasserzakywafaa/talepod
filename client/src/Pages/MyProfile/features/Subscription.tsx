import { Alert, Box, Button, Card, Grid, Typography } from "@mui/material";
import { AutoAwesomeOutlined, HeartBrokenOutlined } from "@mui/icons-material";

import { SubscriptionPlanEnum } from "src/shared/types/user";
import { useApplicationContext } from "src/application/store/Provider";
import { CancelSubscriptionModal } from "src/components/Modals/CancelSubscriptionModal/CancelSubscriptionModal";
import { useCancelSubscriptionModalContext } from "src/components/Modals/CancelSubscriptionModal/store/Provider";
import { useMyProfileContext } from "../store/Provider";
import { usePricingModalContext } from "src/components/Modals/PricingModal/store/Provider";

const SubscriptionSection = () => {
  const {
    store: {
      state: {
        auth: { user },
      },
    },
  } = useApplicationContext();

  const {
    store: {
      state: { subscription },
    },
  } = useMyProfileContext();

  if (!user) return null;

  const blogsCounterLeft =
    user.subscription.maxStoriesAllowed - user.storyCount;
  const hasMaxBlogsLimit =
    user.storyCount >= user.subscription.maxStoriesAllowed;
  const isCancelledButStillActive =
    subscription && subscription.cancel_at_period_end;

  const {
    store: { handleTogglePricingModal },
  } = usePricingModalContext();
  const {
    store: { handleToggleCancelSubscriptionModal },
  } = useCancelSubscriptionModalContext();

  const handleOnCancelSubscriptionClick = () => {
    handleToggleCancelSubscriptionModal();
  };

  const handleOnSubscribeClick = () => handleTogglePricingModal("profile");

  return (
    <>
      <CancelSubscriptionModal />
      <Box id="subscription">
      <Card elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5">Subscription</Typography>
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid size={{ xs: 6, md: 4 }}>
            <Typography variant="h6" component="p" className="text-underline">
              Plan Type
            </Typography>
            <span className="bold">{user.subscription.type}</span>
          </Grid>

          {user.isPaidUser &&
          user.subscription.type !== SubscriptionPlanEnum.Free ? (
            <>
              <Grid size={{ xs: 6, md: 4 }}>
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

              <Grid size={{ xs: 6, md: 4 }}>
                <Typography
                  variant="h6"
                  component="p"
                  className="text-underline"
                >
                  End Date
                </Typography>
                <span className="bold">
                  {new Date(user.subscription.endDate).toLocaleString("en-GB", {
                    dateStyle: "short",
                  })}
                </span>
              </Grid>

              {/* <Grid item xs={12} sm={6} md={8}>
                      <Alert
                        severity="info"
                        variant="outlined"
                        sx={{ width: "fit-content" }}
                        icon={<AutoAwesomeOutlined />}
                      >
                        You have{" "}
                        <span className="bold">{blogsCounterLeft}</span>{" "}
                        blogs left out of{" "}
                        <span className="bold">
                          {user.subscription.maxStoriesAllowed}
                        </span>
                      </Alert>
                    </Grid> */}

              <Grid size={{ xs: 12, sm: 3, md: 4 }}>
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
            <Grid size={{ xs: 6, md: 6 }}>
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

          {hasMaxBlogsLimit ? (
            <Grid size={{ xs: 12, md: 12 }}>
              <Alert
                severity="warning"
                variant="outlined"
                sx={{ width: "fit-content" }}
                icon={<AutoAwesomeOutlined />}
              >
                {`You have consumed your maximum credit of ${user.subscription.maxStoriesAllowed} blogs`}
              </Alert>
            </Grid>
          ) : (
            <Grid size={{ xs: 12, sm: 6, md: 8 }}>
              <Alert
                severity="info"
                variant="outlined"
                sx={{ width: "fit-content" }}
                icon={<AutoAwesomeOutlined />}
              >
                You have <span className="bold">{blogsCounterLeft}</span> blogs
                left out of{" "}
                <span className="bold">
                  {user.subscription.maxStoriesAllowed}
                </span>
              </Alert>
            </Grid>
          )}

          {isCancelledButStillActive && subscription.current_period_end && (
            <Grid size={{ xs: 12, md: 12 }}>
              <Alert
                severity="info"
                variant="outlined"
                icon={<HeartBrokenOutlined />}
              >
                It is sad to see you go. Enjoy the subscription benefits until{" "}
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
    </Box>
    </>
  );
};

export default SubscriptionSection;
