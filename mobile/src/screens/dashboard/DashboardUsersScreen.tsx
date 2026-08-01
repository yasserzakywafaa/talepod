import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { mobileRoutes } from "src/application/routes";
import type { DashboardShellStackParamList } from "src/application/navigation/DashboardShellStackNavigator";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { Page, PAGE_SCROLL_PROPS } from "src/components/layout/Page";
import { useReadableLayout } from "src/components/layout/useReadableLayout";
import { DashboardAppBar } from "src/components/chrome/DashboardAppBar";
import { AppToast } from "src/components/chrome/AppToast";
import { FiltersButton } from "src/components/brand/FiltersButton";
import { PillButton } from "src/components/brand/PillButton";
import { ServiceUnavailable } from "src/components/brand/ServiceUnavailable";
import { AdminEmptyState } from "src/features/dashboardShared/AdminEmptyState";
import { ConfirmDestructiveDialog } from "src/features/dashboardShared/ConfirmDestructiveDialog";
import { AdminUserCard } from "src/features/dashboardUsers/AdminUserCard";
import { AdminUsersFiltersSheet } from "src/features/dashboardUsers/AdminUsersFiltersSheet";
import {
  DashboardUsersContextProvider,
  useDashboardUsersContext,
} from "src/features/dashboardUsers/store/Provider";
import type { User } from "src/shared/types/user";

type Props = NativeStackScreenProps<
  DashboardShellStackParamList,
  typeof mobileRoutes.dashboard.users
>;

const DashboardUsersContent = ({ navigation }: Props) => {
  const { t } = useTranslation(["dashboard", "library"]);
  const theme = useAppTheme();
  const { horizontalGutter, contentMaxWidth } = useReadableLayout();
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const {
    store: {
      state: {
        isFetching,
        isMutating,
        users,
        paging,
        feedback,
        loadError,
        filters,
        isFiltersPanelOpen,
        activeFiltersCount,
      },
    },
    manager: {
      setUp,
      handleGetUsersByPage,
      handleBlockUser,
      handleUnblockUser,
      handleDeleteUser,
      handleToggleFiltersPanel,
      handleUpdateFilter,
      handleApplyFilters,
      handleClearFilters,
      handleDismissFeedback,
    },
  } = useDashboardUsersContext();

  // Refetch on focus, not just on mount: coming back from a user's page, that
  // row's role or status may have changed under us.
  useFocusEffect(
    useCallback(() => {
      void setUp();
    }, [setUp]),
  );

  const renderItem = useCallback(
    ({ item }: { item: User }) => (
      <AdminUserCard
        user={item}
        onPress={() =>
          navigation.navigate(mobileRoutes.dashboard.user, { userId: item._id })
        }
        onBlock={() => void handleBlockUser(item._id)}
        onUnblock={() => void handleUnblockUser(item._id)}
        onDelete={() =>
          setUserToDelete({
            id: item._id,
            name: `${item.name?.givenName ?? ""} ${
              item.name?.familyName ?? ""
            }`.trim(),
          })
        }
      />
    ),
    [navigation, handleBlockUser, handleUnblockUser],
  );

  const totalCount = paging.totalCount ?? 0;
  const hasMore = (paging.totalPagesCount ?? 1) > paging.pageNumber;

  // Nothing loaded and the API is unreachable: the list has nothing to say,
  // so the screen explains itself instead of showing an empty page.
  if (loadError && users.length === 0) {
    return (
      <View style={styles.root}>
        <ServiceUnavailable
          kind={loadError}
          isRetrying={isFetching}
          onRetry={() => void setUp()}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        {...PAGE_SCROLL_PROPS}
        contentContainerStyle={[
          styles.listContent,
          { paddingHorizontal: horizontalGutter, maxWidth: contentMaxWidth },
        ]}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.onSurfaceVariant,
                  fontFamily: theme.tokens.fontFamily.regular,
                },
              ]}
            >
              {totalCount
                ? t("stories.totalCount", { count: totalCount })
                : t("admin.users.subtitle")}
            </Text>
            <FiltersButton
              activeCount={activeFiltersCount}
              onPress={() => handleToggleFiltersPanel(true)}
            />
          </View>
        }
        ListEmptyComponent={
          !isFetching ? (
            <AdminEmptyState
              icon="account-off-outline"
              message={
                activeFiltersCount > 0
                  ? t("admin.users.emptyFiltered")
                  : t("admin.users.empty")
              }
              action={
                activeFiltersCount > 0 ? (
                  <PillButton
                    variant="outlined"
                    compact
                    onPress={() => void handleClearFilters()}
                  >
                    {t("library:filters.clear")}
                  </PillButton>
                ) : null
              }
            />
          ) : null
        }
        ListFooterComponent={
          <View style={styles.footer}>
            {isFetching ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : null}
            {hasMore && !isFetching ? (
              <PillButton
                variant="outlined"
                onPress={() => void handleGetUsersByPage(paging.pageNumber + 1)}
              >
                {t("library:page.loadMore")}
              </PillButton>
            ) : null}
          </View>
        }
      />

      <AdminUsersFiltersSheet
        visible={isFiltersPanelOpen}
        values={filters}
        onChange={handleUpdateFilter}
        onApply={() => void handleApplyFilters()}
        onClear={() => void handleClearFilters()}
        onDismiss={() => handleToggleFiltersPanel(false)}
      />

      <ConfirmDestructiveDialog
        visible={!!userToDelete}
        title={t("admin.users.deleteUserTitle")}
        message={t("admin.users.deleteUserConfirmPlain", {
          name: userToDelete?.name ?? "",
        })}
        isBusy={isMutating}
        onConfirm={() => {
          if (userToDelete) {
            void handleDeleteUser(userToDelete.id);
            setUserToDelete(null);
          }
        }}
        onDismiss={() => setUserToDelete(null)}
      />

      <AppToast
        visible={!!feedback}
        message={feedback?.message ?? ""}
        variant={feedback?.variant}
        onDismiss={handleDismissFeedback}
      />
    </View>
  );
};

export const DashboardUsersScreen = (props: Props) => (
  <Page header={<DashboardAppBar routeName={props.route.name} />}>
    <DashboardUsersContextProvider>
      <DashboardUsersContent {...props} />
    </DashboardUsersContextProvider>
  </Page>
);

const styles = StyleSheet.create({
  root: { flex: 1 },
  listContent: {
    paddingBottom: 24,
    gap: 12,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  subtitle: { flex: 1, fontSize: 14, lineHeight: 20, includeFontPadding: false },
  footer: { paddingVertical: 16, alignItems: "center", gap: 12 },
});
