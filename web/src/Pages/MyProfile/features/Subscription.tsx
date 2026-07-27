import { Alert, Box, Button, Card, Grid, Typography } from "@mui/material";
import { AutoAwesomeOutlined, HeartBrokenOutlined } from "@mui/icons-material";

import { SubscriptionPlanEnum } from "src/shared/types/user";
import { useApplicationContext } from "src/application/store/Provider";
import { CancelSubscriptionModal } from "src/components/Modals/CancelSubscriptionModal/CancelSubscriptionModal";
import { useCancelSubscriptionModalContext } from "src/components/Modals/CancelSubscriptionModal/store/Provider";
import { useMyProfileContext } from "../store/Provider";
import { usePricingModalContext } from "src/components/Modals/PricingModal/store/Provider";
import { Trans, useTranslation } from "react-i18next";
import {
  formatLocalizedDate,
  localeFromLanguage,
} from "@yasserzakywafaa/client-core";

const SubscriptionSection = () => {
  const { t, i18n } = useTranslation("dashboard");
  const locale = localeFromLanguage(i18n.language);
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

  const storiesCounterLeft =
    user.subscription.maxStoriesAllowed - user.storyCount;
  const hasMaxStoriesLimit =
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
          <Typography variant="h5">{t("subscription.title")}</Typography>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid size={{ xs: 6, md: 4 }}>
              <Typography
                variant="h6"
                component="p"
                className="text-underline"
              >
                {t("subscription.planType")}
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
                    {t("subscription.startDate")}
                  </Typography>
                  <span className="bold">
                    {formatLocalizedDate(user.subscription.startDate, locale, {
                      dateStyle: "short",
                    })}
                  </span>
                </Grid>

                <Grid size={{ xs: 6, md: 4 }}>
                  <Typography
                    variant="h6"
                    component="p"
                    className="text-underline"
                  >
                    {t("subscription.endDate")}
                  </Typography>
                  <span className="bold">
                    {formatLocalizedDate(user.subscription.endDate, locale, {
                      dateStyle: "short",
                    })}
                  </span>
                </Grid>

                <Grid size={{ xs: 12, sm: 3, md: 4 }}>
                  <Button
                    fullWidth
                    color="error"
                    variant="contained"
                    sx={{ marginTop: 1 }}
                    onClick={handleOnCancelSubscriptionClick}
                  >
                    {t("subscription.cancelSubscription")}
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
                  onClick={handleOnSubscribeClick}
                >
                  {t("subscription.upgrade")}
                </Button>
              </Grid>
            )}

            {hasMaxStoriesLimit ? (
              <Grid size={{ xs: 12, md: 12 }}>
                <Alert
                  severity="warning"
                  variant="outlined"
                  sx={{ width: "fit-content" }}
                  icon={<AutoAwesomeOutlined />}
                >
                  {t("subscription.maxCreditConsumed", {
                    count: user.subscription.maxStoriesAllowed,
                  })}
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
                  <Trans
                    t={t}
                    i18nKey="subscription.storiesLeft"
                    values={{
                      left: storiesCounterLeft,
                      max: user.subscription.maxStoriesAllowed,
                    }}
                    components={{ bold: <span className="bold" /> }}
                  />
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
                  <Trans
                    t={t}
                    i18nKey="subscription.cancelledUntil"
                    values={{
                      date: formatLocalizedDate(
                        new Date(subscription.current_period_end * 1000),
                        locale,
                        { dateStyle: "short" },
                      ),
                    }}
                    components={{ bold: <span className="bold" /> }}
                  />
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
