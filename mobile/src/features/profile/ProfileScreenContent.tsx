import { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Snackbar, Switch } from "react-native-paper";
import {
  formatLocalizedDate,
  localeFromLanguage,
} from "@yasserzakywafaa/client-core";

import { resetToMarketingAfterLogout, navigateToMainMyStories } from "src/application/navigation/rootNavigation";
import { useApplicationContext } from "src/application/store/Provider";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { useResolvedThemeMode } from "src/application/useResolvedThemeMode";
import { ProfileAvatar } from "src/components/shared/ProfileAvatar";
import { PageBody } from "src/components/layout/Page";
import { BrandCard } from "src/components/brand/BrandCard";
import { DisplayText } from "src/components/brand/DisplayText";
import { MetaTag } from "src/components/brand/MetaTag";
import { PillButton } from "src/components/brand/PillButton";
import { UnderlineTabs } from "src/components/brand/UnderlineTabs";
import { DeleteAccountDialog } from "src/features/profile/DeleteAccountDialog";
import { ProfileBillingPanel } from "src/features/profile/ProfileBillingPanel";
import { useDashboardProfileContext } from "src/features/profile/store/Provider";
import { UserStatus } from "src/shared/types/user";
import { getUserProfileContact } from "src/shared/utils/getUserProfileContact";
import { hasAdminRights } from "src/shared/utils/getUserRoles";

const formatStatusLabel = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1);

const formatRoleLabel = (role: string) =>
  role.charAt(0).toUpperCase() + role.slice(1).replace("_", " ");

type ProfileFieldProps = {
  label: string;
  children: React.ReactNode;
};

/** Honey underlined label over a bold value — the web profile-info rows. */
const ProfileField = ({ label, children }: ProfileFieldProps) => {
  const theme = useAppTheme();
  return (
    <View style={styles.field}>
      <Text
        style={[
          styles.fieldLabel,
          {
            color: theme.colors.onSurface,
            textDecorationColor: theme.colors.primary,
            fontFamily: theme.tokens.fontFamily.medium,
          },
        ]}
      >
        {label}
      </Text>
      {children}
    </View>
  );
};

type ProfileValueProps = {
  children: string;
  tone?: "default" | "link";
};

const ProfileValue = ({ children, tone = "default" }: ProfileValueProps) => {
  const theme = useAppTheme();
  return (
    <Text
      style={[
        styles.fieldValue,
        {
          color: tone === "link" ? theme.colors.primary : theme.colors.onSurface,
          fontFamily: theme.tokens.fontFamily.semiBold,
        },
      ]}
    >
      {children}
    </Text>
  );
};

export const ProfileScreenContent = () => {
  const { t, i18n } = useTranslation(["dashboard", "common"]);
  const theme = useAppTheme();
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
            <DisplayText size={26} color={theme.colors.primary}>
              {t("profile.greeting", { name: user.name.givenName })}
            </DisplayText>
            <View style={styles.chips}>
              <MetaTag
                label={formatStatusLabel(user.status)}
                tone={user.status === UserStatus.active ? "primary" : "secondary"}
              />
              <MetaTag label={formatRoleLabel(user.role)} />
            </View>
            {profileContact.value ? (
              profileContact.openUrl ? (
                <Pressable
                  onPress={() => void Linking.openURL(profileContact.openUrl!)}
                >
                  <Text
                    style={[
                      styles.contact,
                      {
                        color: theme.colors.onSurfaceVariant,
                        fontFamily: theme.tokens.fontFamily.regular,
                      },
                    ]}
                  >
                    {profileContact.value}
                  </Text>
                </Pressable>
              ) : (
                <Text
                  style={[
                    styles.contact,
                    {
                      color: theme.colors.onSurfaceVariant,
                      fontFamily: theme.tokens.fontFamily.regular,
                    },
                  ]}
                >
                  {profileContact.value}
                </Text>
              )
            ) : null}
          </View>
        </View>

        <UnderlineTabs
          value={activeTab}
          onChange={setActiveTab}
          tabs={[
            {
              value: "profile" as const,
              label: t("profile.tabProfile"),
              icon: "account-outline",
            },
            {
              value: "billing" as const,
              label: t("profile.tabBilling"),
              icon: "credit-card-outline",
            },
          ]}
        />

        {activeTab === "billing" ? (
          <ProfileBillingPanel user={user} />
        ) : (
          <>
            <BrandCard style={styles.cardBody}>
              <Text
                style={[
                  styles.statLabel,
                  {
                    color: theme.colors.onSurfaceVariant,
                    fontFamily: theme.tokens.fontFamily.semiBold,
                  },
                ]}
              >
                {t("overview.totalStories")}
              </Text>
              <DisplayText size={38} color={theme.colors.primary}>
                {String(user.storyCount)}
              </DisplayText>
              <Text
                style={[
                  styles.statCaption,
                  {
                    color: theme.colors.onSurfaceVariant,
                    fontFamily: theme.tokens.fontFamily.regular,
                  },
                ]}
              >
                {t("overview.storiesCreated")}
              </Text>
              <PillButton
                variant="outlined"
                icon="view-array-outline"
                style={styles.statAction}
                onPress={() => navigateToMainMyStories()}
              >
                {t("profile.viewMyStories")}
              </PillButton>
            </BrandCard>

            <BrandCard style={[styles.cardBody, styles.infoCardContent]}>
              <DisplayText size={22}>
                {t("profile.profileInformation")}
              </DisplayText>

              <ProfileField label={t("profile.fullName")}>
                <ProfileValue>
                  {`${user.name.givenName} ${user.name.familyName}`.trim()}
                </ProfileValue>
              </ProfileField>

              <ProfileField label={t(contactLabelKey)}>
                {profileContact.value && profileContact.openUrl ? (
                  <Pressable
                    onPress={() =>
                      void Linking.openURL(profileContact.openUrl!)
                    }
                  >
                    <ProfileValue tone="link">
                      {profileContact.value}
                    </ProfileValue>
                  </Pressable>
                ) : (
                  <ProfileValue>{profileContact.value || "—"}</ProfileValue>
                )}
              </ProfileField>

              <ProfileField label={t("profile.dateJoined")}>
                <ProfileValue>
                  {formatLocalizedDate(user.createdAt, locale, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </ProfileValue>
              </ProfileField>

              <ProfileField label={t("profile.appearance")}>
                <Pressable onPress={handleThemeToggle} style={styles.themeRow}>
                  <Text
                    style={[
                      styles.themeLabel,
                      {
                        color: theme.colors.onSurfaceVariant,
                        fontFamily: theme.tokens.fontFamily.medium,
                      },
                    ]}
                  >
                    {t("profile.themeLight")}
                  </Text>
                  <Switch
                    value={resolvedThemeMode === "dark"}
                    onValueChange={handleThemeToggle}
                  />
                  <Text
                    style={[
                      styles.themeLabel,
                      {
                        color: theme.colors.onSurfaceVariant,
                        fontFamily: theme.tokens.fontFamily.medium,
                      },
                    ]}
                  >
                    {t("profile.themeDark")}
                  </Text>
                </Pressable>
              </ProfileField>
            </BrandCard>
          </>
        )}

        {activeTab === "profile" && showDeleteAccount ? (
          <BrandCard
            style={[styles.cardBody, { borderColor: theme.colors.error }]}
          >
            <DisplayText size={22} color={theme.colors.error}>
              {t("profile.dangerZone")}
            </DisplayText>
            <Text
              style={[
                styles.dangerCopy,
                {
                  color: theme.colors.onSurfaceVariant,
                  fontFamily: theme.tokens.fontFamily.regular,
                },
              ]}
            >
              {t("profile.dangerZoneDescription")}
            </Text>
            <PillButton
              variant="outlined"
              icon="delete"
              color={theme.colors.error}
              style={styles.dangerButton}
              onPress={() => setDeleteDialogVisible(true)}
            >
              {t("profile.deleteAccount")}
            </PillButton>
          </BrandCard>
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
  contact: { fontSize: 14, textAlign: "center", includeFontPadding: false },
  cardBody: { padding: 20, gap: 8 },
  statLabel: { fontSize: 15, includeFontPadding: false },
  statCaption: { fontSize: 13, includeFontPadding: false },
  statAction: { marginTop: 12 },
  infoCardContent: {
    gap: 18,
  },
  field: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 15,
    textDecorationLine: "underline",
    includeFontPadding: false,
  },
  fieldValue: { fontSize: 15, includeFontPadding: false },
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  themeLabel: { fontSize: 13, includeFontPadding: false },
  dangerCopy: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 4,
    includeFontPadding: false,
  },
  dangerButton: {
    marginTop: 16,
    alignSelf: "flex-start",
  },
});
