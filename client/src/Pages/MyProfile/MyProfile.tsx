import "./MyProfile.scss";

import { Badge, Btn, Icon } from "src/components/shared/v2";
import { Box, Card, Container, Grid, Switch, Typography } from "@mui/material";
import { SubscriptionPlanEnum, User } from "src/shared/types/user";
import { useEffect, useState } from "react";

import Page from "src/components/shared/Page/Page";
import ProfileAvatar from "src/components/shared/ProfileAvatar";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import SubscriptionSection from "./features/Subscription";
import { useApplicationContext } from "src/application/store/Provider";
import { useMyProfileContext } from "./store/Provider";
import { usePricingModalContext } from "src/components/Modals/PricingModal/store/Provider";

type ProfileTab = "profile" | "billing";

const TABS: [ProfileTab, string, string][] = [
  ["profile", "Profile", "person"],
  ["billing", "Billing", "credit_card"],
];

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
  const {
    store: { handleTogglePricingModal },
  } = usePricingModalContext();

  const [tab, setTab] = useState<ProfileTab>("profile");

  useEffect(() => {
    if (user?.subscription && user.subscription.id) {
      handleGetSubscriptionDetails();
    }
  }, [user]);

  if (!isAuthenticated || !user) return <></>;

  const handleOnDarkModeSwitchChange = async () => {
    await handleUpdateUserInfo({
      preferences: {
        ...user.preferences,
        theme: themeMode === "dark" ? "light" : "dark",
      },
    });
    toggleThemeMode();
  };

  const isFreeUser = user.subscription.type === SubscriptionPlanEnum.Free;
  const storiesUsed = user.storyCount;
  const storiesMax = user.subscription.maxStoriesAllowed;
  const usedPercent = storiesMax
    ? Math.min(100, Math.round((storiesUsed / storiesMax) * 100))
    : 0;

  return (
    <Page
      title="My Profile | TalePod"
      className="my-profile-page"
      isLoading={isFetching}
    >
      <Box component="div" className="bg-image-character">
        <RandomImage />
      </Box>

      <Container className="view-story-container" sx={{ pt: 4, pb: 4 }}>
        <Typography
          variant="h4"
          component="h4"
          color="primary"
          sx={{ mb: 4, fontFamily: "var(--font-display)" }}
        >
          My Profile
        </Typography>

        <Box display="flex" alignItems="center" sx={{ mb: 4 }}>
          <ProfileAvatar
            user={auth.user as User}
            verifiedBadgeSize={32}
            avatarSize={{ width: 100, height: 100 }}
          />
          <Typography variant="h5" component="h5" marginLeft={2}>
            Hi {user?.name.givenName} 👋🏻
          </Typography>
        </Box>

        {/* Tab bar */}
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            borderBottom: "1px solid var(--border)",
            mb: 3,
          }}
        >
          {TABS.map(([id, label, icon]) => {
            const on = tab === id;
            return (
              <Box
                component="button"
                type="button"
                key={id}
                onClick={() => setTab(id)}
                sx={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  px: 2,
                  py: 1.5,
                  fontFamily: "inherit",
                  fontSize: 14,
                  fontWeight: on ? 700 : 500,
                  color: on ? "var(--honey-700)" : "var(--fg-2)",
                  borderBottom: on
                    ? "2px solid var(--honey-400)"
                    : "2px solid transparent",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  mb: "-1px",
                }}
              >
                <Icon name={icon} size={18} />
                {label}
              </Box>
            );
          })}
        </Box>

        <Grid container spacing={3} alignItems="flex-start">
          {/* Active tab panel */}
          <Grid size={{ xs: 12, md: 8 }}>
            {tab === "profile" && (
              <Card elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h5">Profile Information</Typography>

                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                  <Grid size={{ xs: 12, md: 6 }}>
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

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography
                      variant="h6"
                      component="p"
                      className="text-underline"
                    >
                      Email
                    </Typography>
                    <span className="bold">{`${user.email}`}</span>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
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

                  <Grid size={{ xs: 12, md: 6 }}>
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
                      </span>
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            )}

            {tab === "billing" && <SubscriptionSection />}
          </Grid>

          {/* Usage / plan rail (real data) */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                position: { md: "sticky" },
                top: 16,
                background: "linear-gradient(155deg, #574191 0%, #241a3d 100%)",
                color: "#fff",
                borderRadius: "var(--r-xl, 20px)",
                p: 3,
                boxShadow: "var(--shadow-md)",
              }}
            >
              <Badge tone="honey">{user.subscription.type} plan</Badge>
              <Typography
                sx={{
                  fontFamily: "var(--font-display)",
                  fontSize: 22,
                  lineHeight: 1.2,
                  mt: 1.5,
                  mb: 0.5,
                }}
              >
                {isFreeUser
                  ? "Unlock illustrations & every voice"
                  : "Thanks for supporting TalePod"}
              </Typography>

              <Box
                sx={{
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "var(--r-md, 12px)",
                  p: 2,
                  mt: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    mb: 1,
                  }}
                >
                  <span>Stories used</span>
                  <span style={{ fontWeight: 700 }}>
                    {storiesUsed} / {storiesMax}
                  </span>
                </Box>
                <Box
                  sx={{
                    height: 6,
                    background: "rgba(255,255,255,0.14)",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: `${usedPercent}%`,
                      height: "100%",
                      background: "var(--honey-300, #F2C45C)",
                    }}
                  />
                </Box>
              </Box>

              {(user.storyCredits ?? 0) > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: 2,
                    fontSize: 13,
                  }}
                >
                  <Box
                    sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}
                  >
                    <Icon name="local_activity" size={18} color="var(--honey-300)" />
                    <span>Story credits</span>
                  </Box>
                  <span style={{ fontWeight: 700 }}>{user.storyCredits}</span>
                </Box>
              )}

              {isFreeUser && (
                <Box sx={{ mt: 2 }}>
                  <Btn
                    variant="primary"
                    size="md"
                    full
                    icon="workspace_premium"
                    onClick={handleTogglePricingModal}
                  >
                    Upgrade to Premium
                  </Btn>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default MyProfilePage;
