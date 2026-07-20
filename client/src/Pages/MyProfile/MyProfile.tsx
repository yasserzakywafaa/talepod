import "./MyProfile.scss";

import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import {
  CreditCardOutlined,
  DeleteOutlined,
  LocalActivityOutlined,
  PersonOutlined,
  SvgIconComponent,
  WorkspacePremiumOutlined,
} from "@mui/icons-material";
import { SubscriptionPlanEnum, User } from "src/shared/types/user";
import { useEffect, useState } from "react";

import Page from "src/components/shared/Page/Page";
import ProfileAvatar from "src/components/shared/ProfileAvatar";
import RandomImage from "src/components/shared/RandomImage/RandomImage";
import DeleteAccountDialog from "./features/DeleteAccountDialog";
import SubscriptionSection from "./features/Subscription";
import {
  getUserContact,
  getUserContactLabel,
} from "src/shared/utils/getUserContact";
import { useApplicationContext } from "src/application/store/Provider";
import { useMyProfileContext } from "./store/Provider";
import { usePricingModalContext } from "src/components/Modals/PricingModal/store/Provider";
import { hasAdminRights } from "src/shared/utils/getUserRoles";
import routes from "src/application/routes";
import { useNavigate } from "react-router-dom";
import { honey300, honey400, honey700 } from "src/application/shared/themes";
import { useTranslation } from "react-i18next";
import {
  formatLocalizedDate,
  localeFromLanguage,
} from "@yasserzakywafaa/client-core";

type ProfileTab = "profile" | "billing";

const MyProfilePage = () => {
  const { t, i18n } = useTranslation("dashboard");
  const locale = localeFromLanguage(i18n.language);
  const navigate = useNavigate();
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] =
    useState(false);
  const {
    store: {
      state: {
        auth,
        auth: { isAuthenticated, user },
        themeMode,
      },
    },
  } = useApplicationContext();
  const {
    store: {
      state: { isFetching, isDeletingAccount },
    },
    manager: {
      handleGetSubscriptionDetails,
      handleUpdateUserInfo,
      handleDeleteAccount,
    },
  } = useMyProfileContext();
  const {
    store: { handleTogglePricingModal },
  } = usePricingModalContext();

  const [tab, setTab] = useState<ProfileTab>("profile");

  const TABS: [ProfileTab, string, SvgIconComponent][] = [
    ["profile", t("profile.tabProfile"), PersonOutlined],
    ["billing", t("profile.tabBilling"), CreditCardOutlined],
  ];

  useEffect(() => {
    if (user?.subscription && user.subscription.id) {
      handleGetSubscriptionDetails();
    }
  }, [user]);

  if (!isAuthenticated || !user) return <></>;

  const showDeleteAccount = !hasAdminRights(user);

  const handleOnDarkModeSwitchChange = async () => {
    await handleUpdateUserInfo({
      preferences: {
        ...user.preferences,
        theme: themeMode === "dark" ? "light" : "dark",
      },
    });
  };

  const isFreeUser = user.subscription.type === SubscriptionPlanEnum.Free;
  const storiesUsed = user.storyCount;
  const storiesMax = user.subscription.maxStoriesAllowed;
  const usedPercent = storiesMax
    ? Math.min(100, Math.round((storiesUsed / storiesMax) * 100))
    : 0;

  return (
    <Page
      title={t("profile.pageTitle")}
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
          {t("profile.title")}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 4
          }}>
          <ProfileAvatar
            user={auth.user as User}
            verifiedBadgeSize={32}
            avatarSize={{ width: 100, height: 100 }}
          />
          <Typography variant="h5" component="h5" sx={{
            marginLeft: 2
          }}>
            {t("profile.greeting", { name: user?.name.givenName })}
          </Typography>
        </Box>

        {/* Tab bar */}
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            borderBottom: "1px solid",
            borderColor: "divider",
            mb: 3,
          }}
        >
          {TABS.map(([id, label, TabIcon]) => {
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
                  color: on ? honey700 : "text.secondary",
                  borderBottom: on
                    ? `2px solid ${honey400}`
                    : "2px solid transparent",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  mb: "-1px",
                }}
              >
                <TabIcon sx={{ fontSize: 18 }} />
                {label}
              </Box>
            );
          })}
        </Box>

        <Grid container spacing={3} sx={{
          alignItems: "flex-start"
        }}>
          {/* Active tab panel */}
          <Grid size={{ xs: 12, md: 8 }}>
            {tab === "profile" && (
              <Card elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h5">{t("profile.profileInformation")}</Typography>

                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography
                      variant="h6"
                      component="p"
                      className="text-underline"
                    >
                      {t("profile.fullName")}
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
                      {getUserContactLabel(user)}
                    </Typography>
                    <span className="bold">{getUserContact(user)}</span>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography
                      variant="h6"
                      component="p"
                      className="text-underline"
                    >
                      {t("profile.dateJoined")}
                    </Typography>
                    <span className="bold">
                      {formatLocalizedDate(new Date(user.createdAt), locale, {
                        dateStyle: "short",
                      })}
                    </span>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h6" component="p">
                      <span className="text-underline">{t("profile.appearance")}</span>
                      <Switch
                        size="medium"
                        value="dark-mode"
                        checked={themeMode === "dark"}
                        onChange={handleOnDarkModeSwitchChange}
                      />
                      <span className="bold">
                        {themeMode === "dark"
                          ? t("profile.themeDark")
                          : t("profile.themeLight")}
                      </span>
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            )}

            {tab === "profile" && showDeleteAccount && (
              <Card
                elevation={3}
                sx={{
                  padding: 3,
                  mt: 3,
                  border: "1px solid",
                  borderColor: "error.main",
                }}
              >
                <Typography variant="h5" color="error" sx={{ mb: 1 }}>
                  {t("profile.dangerZone")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mb: 2,
                  }}
                >
                  {t("profile.dangerZoneDescription")}
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlined />}
                  onClick={() => setIsDeleteAccountDialogOpen(true)}
                >
                  {t("profile.deleteAccount")}
                </Button>
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
              <Chip
                variant="badge"
                label={t("profile.planLabel", { plan: user.subscription.type })}
              />
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
                  ? t("profile.unlockPremium")
                  : t("profile.thanksSupporter")}
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
                  <span>{t("profile.storiesUsed")}</span>
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
                      background: honey300,
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
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.75,
                    }}
                  >
                    <LocalActivityOutlined
                      sx={{ fontSize: 18, color: honey300 }}
                    />
                    <span>{t("profile.storyCredits")}</span>
                  </Box>
                  <span style={{ fontWeight: 700 }}>{user.storyCredits}</span>
                </Box>
              )}

              {isFreeUser && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<WorkspacePremiumOutlined />}
                    onClick={() => handleTogglePricingModal("profile")}
                  >
                    {t("profile.upgradeToPremium")}
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
      <DeleteAccountDialog
        isOpen={isDeleteAccountDialogOpen}
        isDeleting={isDeletingAccount}
        impactItems={[
          t("profile.impactStories", { count: user.storyCount }),
          t("profile.impactAvatarsCredits"),
          t("profile.impactSubscription"),
        ]}
        warningMessage={t("profile.libraryPublishWarning")}
        onClose={() => setIsDeleteAccountDialogOpen(false)}
        onConfirm={async (confirmationPhrase) => {
          const deleted = await handleDeleteAccount(confirmationPhrase);
          if (deleted) {
            setIsDeleteAccountDialogOpen(false);
            navigate(routes.features);
          }
        }}
      />
    </Page>
  );
};

export default MyProfilePage;
