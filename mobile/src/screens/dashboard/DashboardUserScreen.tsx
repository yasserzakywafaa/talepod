import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { mobileRoutes } from "src/application/routes";
import type { DashboardShellStackParamList } from "src/application/navigation/DashboardShellStackNavigator";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { Page, PageBody } from "src/components/layout/Page";
import { DashboardAppBar } from "src/components/chrome/DashboardAppBar";
import { AppToast } from "src/components/chrome/AppToast";
import { BrandCard } from "src/components/brand/BrandCard";
import { DisplayText } from "src/components/brand/DisplayText";
import { PillButton } from "src/components/brand/PillButton";
import { ServiceUnavailable } from "src/components/brand/ServiceUnavailable";
import { ScreenErrorBoundary } from "src/components/shared/ErrorBoundary";
import { ConfirmDestructiveDialog } from "src/features/dashboardShared/ConfirmDestructiveDialog";
import { isUserBlocked } from "src/features/dashboardShared/userPresentation";
import { getUserProfileContact } from "src/shared/utils/getUserProfileContact";
import { AdminUserInfoCard } from "src/features/dashboardUser/AdminUserInfoCard";
import { AdminUserRoleCard } from "src/features/dashboardUser/AdminUserRoleCard";
import { useDashboardUser } from "src/features/dashboardUser/useDashboardUser";

type Props = NativeStackScreenProps<
  DashboardShellStackParamList,
  typeof mobileRoutes.dashboard.user
>;

const DashboardUserContent = ({ navigation, route }: Props) => {
  const { userId } = route.params;
  const { t } = useTranslation("dashboard");
  const theme = useAppTheme();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const {
    user,
    storiesCount,
    isFetching,
    loadError,
    retry,
    updateUserRole,
    blockUser,
    unblockUser,
    deleteUser,
    isMutating,
    feedback,
    dismissFeedback,
  } = useDashboardUser(userId);

  if (isFetching && !user) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  if (loadError && !user) {
    return <ServiceUnavailable kind={loadError} isRetrying={isFetching} onRetry={retry} />;
  }

  if (!user) {
    return (
      <PageBody>
        <DisplayText size={22} color={theme.colors.primary}>
          {t("admin.user.notFoundTitle")}
        </DisplayText>
        <Text
          style={[
            styles.body,
            {
              color: theme.colors.onSurfaceVariant,
              fontFamily: theme.tokens.fontFamily.regular,
            },
          ]}
        >
          {t("admin.user.notFoundDescription")}
        </Text>
        <AppToast
          visible={!!feedback}
          message={feedback?.message ?? ""}
          variant={feedback?.variant}
          onDismiss={dismissFeedback}
        />
      </PageBody>
    );
  }

  const blocked = isUserBlocked(user.status);
  // Falls back to the contact so the delete prompt never names an empty string.
  const fullName =
    `${user.name?.givenName ?? ""} ${user.name?.familyName ?? ""}`.trim() ||
    getUserProfileContact(user).value;

  return (
    <>
      <PageBody>
        <Text
          style={[
            styles.body,
            {
              color: theme.colors.onSurfaceVariant,
              fontFamily: theme.tokens.fontFamily.regular,
            },
          ]}
        >
          {t("admin.user.subtitle")}
        </Text>

        <AdminUserInfoCard user={user} />

        <AdminUserRoleCard
          user={user}
          isUpdating={isMutating}
          onChange={updateUserRole}
        />

        <BrandCard style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="book-open-variant"
              size={20}
              color={theme.colors.primary}
            />
            <Text
              style={[
                styles.cardTitle,
                {
                  color: theme.colors.onSurface,
                  fontFamily: theme.tokens.fontFamily.semiBold,
                },
              ]}
            >
              {t("stories.title")}
            </Text>
          </View>

          <DisplayText size={34} color={theme.colors.primary}>
            {String(storiesCount)}
          </DisplayText>
          <Text
            style={[
              styles.body,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: theme.tokens.fontFamily.regular,
              },
            ]}
          >
            {t("admin.user.storiesCreated", { count: storiesCount })}
          </Text>

          <PillButton
            fullWidth
            trailingIcon="arrow-right"
            disabled={storiesCount === 0}
            onPress={() =>
              navigation.navigate(mobileRoutes.dashboard.userStories, {
                userId: user._id,
              })
            }
          >
            {t("admin.user.viewStories")}
          </PillButton>
        </BrandCard>

        {/* The two actions the web keeps in the list's row menu. They belong
            here too — this is the page you land on to judge an account. */}
        <BrandCard style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="gavel"
              size={20}
              color={theme.colors.error}
            />
            <Text
              style={[
                styles.cardTitle,
                {
                  color: theme.colors.onSurface,
                  fontFamily: theme.tokens.fontFamily.semiBold,
                },
              ]}
            >
              {t("admin.user.moderation")}
            </Text>
          </View>

          <PillButton
            fullWidth
            variant="outlined"
            icon={blocked ? "account-check-outline" : "block-helper"}
            loading={isMutating}
            onPress={() => (blocked ? unblockUser() : blockUser())}
          >
            {blocked ? t("admin.users.unblock") : t("admin.users.block")}
          </PillButton>

          <PillButton
            fullWidth
            variant="outlined"
            color={theme.colors.error}
            icon="delete-outline"
            onPress={() => setIsDeleteOpen(true)}
          >
            {t("admin.user.deleteUser")}
          </PillButton>
        </BrandCard>
      </PageBody>

      <ConfirmDestructiveDialog
        visible={isDeleteOpen}
        title={t("admin.users.deleteUserTitle")}
        message={t("admin.users.deleteUserConfirmPlain", { name: fullName })}
        isBusy={isMutating}
        onConfirm={() => {
          void (async () => {
            const deleted = await deleteUser();
            setIsDeleteOpen(false);
            if (deleted) {
              // The account is gone; there is nothing left on this screen.
              navigation.goBack();
            }
          })();
        }}
        onDismiss={() => setIsDeleteOpen(false)}
      />

      <AppToast
        visible={!!feedback}
        message={feedback?.message ?? ""}
        variant={feedback?.variant}
        onDismiss={dismissFeedback}
      />
    </>
  );
};

export const DashboardUserScreen = (props: Props) => (
  <Page header={<DashboardAppBar routeName={props.route.name} showBack />}>
    <ScreenErrorBoundary name="DashboardUser">
      <DashboardUserContent {...props} />
    </ScreenErrorBoundary>
  </Page>
);

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  body: { fontSize: 14, lineHeight: 20, includeFontPadding: false },
  card: { padding: 16, gap: 12 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardTitle: { fontSize: 15, includeFontPadding: false },
});
