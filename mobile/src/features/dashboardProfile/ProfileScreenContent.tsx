import { useState } from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  Chip,
  SegmentedButtons,
  Snackbar,
  Switch,
  Text,
  useTheme,
} from "react-native-paper";
import {
  formatLocalizedDate,
  localeFromLanguage,
} from "@yasserzakywafaa/client-core";

import { resetToMarketingAfterLogout, navigateToMainMyStories } from "src/application/navigation/rootNavigation";
import { useApplicationContext } from "src/application/store/Provider";
import { useResolvedThemeMode } from "src/application/useResolvedThemeMode";
import { ProfileAvatar } from "src/components/shared/ProfileAvatar";
import { PageBody } from "src/components/layout/Page";
import { DeleteAccountDialog } from "src/features/dashboardProfile/DeleteAccountDialog";
import { ProfileBillingPanel } from "src/features/dashboardProfile/ProfileBillingPanel";
import { useDashboardProfileContext } from "src/features/dashboardProfile/store/Provider";
import { UserStatus } from "src/shared/types/user";
import { getUserProfileContact } from "src/shared/utils/getUserProfileContact";
import { hasAdminRights } from "src/shared/utils/getUserRoles";

const formatStatusLabel = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1);

const formatRoleLabel = (role: string) =>
  role.charAt(0).toUpperCase() + role.slice(1).replace("_", " ");

const getStatusChipMode = (status: UserStatus): "flat" | "outlined" => {
  switch (status) {
    case UserStatus.active:
      return "flat";
    default:
      return "outlined";
  }
};

type ProfileFieldProps = {
  label: string;
  children: React.ReactNode;
};

const ProfileField = ({ label, children }: ProfileFieldProps) => {
  const theme = useTheme();
  return (
    <View style={styles.field}>
      <Text
        variant="titleSmall"
        style={[styles.fieldLabel, { color: theme.colors.primary }]}
      >
        {label}
      </Text>
      {children}
    </View>
  );
};

export const ProfileScreenContent = () => {
  const { t, i18n } = useTranslation(["dashboard", "common"]);
  const theme = useTheme();
  const locale = localeFromLanguage(i18n.language);
  const resolvedThemeMode = useResolvedThemeMode();

  const [activeTab, setActiveTab] = useState<"profile" | "billing">("profile");

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const {
    store: {
      state: {
        auth: { user },
      },
    },
    manager: { handleThemePreferenceChange },
  } = useApplicationContext();

  const {
    store: {
      state: { isDeletingAccount },
    },
    manager: { handleDeleteAccount },
  } = useDashboardProfileContext();

  if (!user) {
    return null;
  }

  const showDeleteAccount = !hasAdminRights(user);
  const profileContact = getUserProfileContact(user);
  const contactLabelKey =
    profileContact.kind === "phone" ? "profile.phoneNumber" : "profile.email";

  const handleThemeToggle = () => {
    void handleThemePreferenceChange(
      resolvedThemeMode === "dark" ? "light" : "dark",
    );
  };

  const onConfirmDelete = async (confirmationPhrase: string) => {
    const result = await handleDeleteAccount(confirmationPhrase);
    if (result.success) {
      setDeleteDialogVisible(false);
      resetToMarketingAfterLogout();
      return;
    }
    setSnackbarMessage(result.errorMessage ?? "Failed to delete account");
  };

  return (
    <View style={styles.screen}>
      <PageBody>
        <View style={styles.header}>
          <ProfileAvatar user={user} />
          <View style={styles.headerText}>
            <Text
              variant="headlineSmall"
              style={{ color: theme.colors.primary, textAlign: "center" }}
            >
              {t("profile.greeting", { name: user.name.givenName })}
            </Text>
            <View style={styles.chips}>
              <Chip
                compact
                mode={getStatusChipMode(user.status)}
                selected={user.status === UserStatus.active}
              >
                {formatStatusLabel(user.status)}
              </Chip>
              <Chip compact mode="outlined">
                {formatRoleLabel(user.role)}
              </Chip>
            </View>
            {profileContact.value ? (
              profileContact.openUrl ? (
                <Pressable
                  onPress={() => void Linking.openURL(profileContact.openUrl!)}
                >
                  <Text
                    variant="bodyMedium"
                    style={{
                      color: theme.colors.onSurfaceVariant,
                      textAlign: "center",
                    }}
                  >
                    {profileContact.value}
                  </Text>
                </Pressable>
              ) : (
                <Text
                  variant="bodyMedium"
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    textAlign: "center",
                  }}
                >
                  {profileContact.value}
                </Text>
              )
            ) : null}
          </View>
        </View>

        <SegmentedButtons
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "profile" | "billing")}
          buttons={[
            { value: "profile", label: t("profile.tabProfile") },
            { value: "billing", label: t("profile.tabBilling") },
          ]}
        />

        {activeTab === "billing" ? (
          <ProfileBillingPanel user={user} />
        ) : (
          <>
        <Card
          mode="outlined"
          style={[styles.card, { borderColor: theme.colors.primary }]}
        >
          <Card.Content>
            <View style={styles.statHeader}>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.onSurface }}
              >
                {t("overview.totalStories")}
              </Text>
            </View>
            <Text
              variant="displaySmall"
              style={{ color: theme.colors.primary }}
            >
              {user.storyCount}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {t("overview.storiesCreated")}
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="outlined"
              icon="book-open-variant"
              style={styles.fullWidthButton}
              onPress={() => navigateToMainMyStories()}
            >
              {t("profile.viewMyStories")}
            </Button>
          </Card.Actions>
        </Card>

        <Card mode="outlined" style={[styles.card, styles.expandCard]}>
          <Card.Content style={styles.infoCardContent}>
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.onSurface }}
            >
              {t("profile.profileInformation")}
            </Text>

            <ProfileField label={t("profile.fullName")}>
              <Text
                variant="bodyLarge"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {`${user.name.givenName} ${user.name.familyName}`.trim()}
              </Text>
            </ProfileField>

            <ProfileField label={t(contactLabelKey)}>
              {profileContact.value && profileContact.openUrl ? (
                <Pressable
                  onPress={() => void Linking.openURL(profileContact.openUrl!)}
                >
                  <Text
                    variant="bodyLarge"
                    style={{ color: theme.colors.primary }}
                  >
                    {profileContact.value}
                  </Text>
                </Pressable>
              ) : (
                <Text
                  variant="bodyLarge"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  {profileContact.value || "—"}
                </Text>
              )}
            </ProfileField>

            <ProfileField label={t("profile.dateJoined")}>
              <Text
                variant="bodyLarge"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {formatLocalizedDate(user.createdAt, locale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </ProfileField>

            <ProfileField label={t("profile.appearance")}>
              <Pressable onPress={handleThemeToggle} style={styles.themeRow}>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  {t("profile.themeLight")}
                </Text>
                <Switch
                  value={resolvedThemeMode === "dark"}
                  onValueChange={handleThemeToggle}
                />
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  {t("profile.themeDark")}
                </Text>
              </Pressable>
            </ProfileField>
          </Card.Content>
        </Card>
          </>
        )}

        {activeTab === "profile" && showDeleteAccount ? (
          <Card
            mode="outlined"
            style={[
              styles.card,
              styles.dangerCard,
              { borderColor: theme.colors.error },
            ]}
          >
            <Card.Content>
              <Text variant="titleLarge" style={{ color: theme.colors.error }}>
                {t("profile.dangerZone")}
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}
              >
                {t("profile.dangerZoneDescription")}
              </Text>
              <Button
                mode="outlined"
                icon="delete"
                textColor={theme.colors.error}
                style={styles.dangerButton}
                onPress={() => setDeleteDialogVisible(true)}
              >
                {t("profile.deleteAccount")}
              </Button>
            </Card.Content>
          </Card>
        ) : null}
      </PageBody>

      <DeleteAccountDialog
        visible={deleteDialogVisible}
        isDeleting={isDeletingAccount}
        impactItems={[
          t("profile.impactStories", { count: user.storyCount }),
          t("profile.impactAvatarsCredits"),
          t("profile.impactSubscription"),
        ]}
        onDismiss={() => setDeleteDialogVisible(false)}
        onConfirm={(phrase) => void onConfirmDelete(phrase)}
      />

      <Snackbar
        visible={snackbarMessage !== null}
        onDismiss={() => setSnackbarMessage(null)}
        duration={4000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    gap: 16,
    paddingTop: 8,
  },
  headerText: {
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  card: {
    marginTop: 0,
  },
  expandCard: {
    flexGrow: 1,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  fullWidthButton: {
    flex: 1,
  },
  infoCardContent: {
    gap: 16,
  },
  field: {
    gap: 4,
  },
  fieldLabel: {
    textDecorationLine: "underline",
  },
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dangerCard: {},
  dangerButton: {
    marginTop: 16,
    alignSelf: "flex-start",
    borderColor: undefined,
  },
});
