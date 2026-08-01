import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { mobileRoutes } from "src/application/routes";
import type { DashboardShellStackParamList } from "src/application/navigation/DashboardShellStackNavigator";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { Page, PAGE_SCROLL_PROPS } from "src/components/layout/Page";
import { useGridList } from "src/components/layout/useGridList";
import { ScreenErrorBoundary } from "src/components/shared/ErrorBoundary";
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
  useDashboardUsers,
  type DashboardUsersFilters,
} from "src/features/dashboardUsers/useDashboardUsers";
import type { User } from "src/shared/types/user";

type Props = NativeStackScreenProps<
  DashboardShellStackParamList,
  typeof mobileRoutes.dashboard.users
>;

const DashboardUsersContent = ({ navigation }: Props) => {
  const { t } = useTranslation(["dashboard", "library"]);
  const theme = useAppTheme();
  const { gridKey, listProps, itemStyle } = useGridList();
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const {
    users,
    totalCount,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    loadError,
    loadMore,
    retry,
    draftFilters,
    updateDraftFilter,
    applyFilters,
    clearFilters,
    activeFiltersCount,
    isFiltersPanelOpen,
    setFiltersPanelOpen,
    blockUser,
    unblockUser,
    deleteUser,
    isMutating,
    feedback,
    dismissFeedback,
  } = useDashboardUsers();

  const renderItem = useCallback(
    ({ item }: { item: User }) => (
      <View style={itemStyle}>
      <AdminUserCard
        user={item}
        onPress={() =>
          navigation.navigate(mobileRoutes.dashboard.user, { userId: item._id })
        }
        onBlock={() => blockUser(item._id)}
        onUnblock={() => unblockUser(item._id)}
        onDelete={() =>
          setUserToDelete({
            id: item._id,
            name: `${item.name?.givenName ?? ""} ${
              item.name?.familyName ?? ""
            }`.trim(),
          })
        }
      />
      </View>
    ),
    [navigation, blockUser, unblockUser, itemStyle],
  );

  // Nothing loaded and the API is unreachable: the list has nothing to say,
  // so the screen explains itself instead of showing an empty page.
  if (loadError) {
    return (
      <View style={styles.root}>
        <ServiceUnavailable kind={loadError} isRetrying={isFetching} onRetry={retry} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <FlatList
        key={gridKey}
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        {...PAGE_SCROLL_PROPS}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        {...listProps}
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
              onPress={() => setFiltersPanelOpen(true)}
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
                  <PillButton variant="outlined" compact onPress={clearFilters}>
                    {t("library:filters.clear")}
                  </PillButton>
                ) : null
              }
            />
          ) : null
        }
        ListFooterComponent={
          <View style={styles.footer}>
            {isFetching || isFetchingNextPage ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : null}
            {hasNextPage && !isFetchingNextPage && !isFetching ? (
              <PillButton variant="outlined" onPress={loadMore}>
                {t("library:page.loadMore")}
              </PillButton>
            ) : null}
          </View>
        }
      />

      <AdminUsersFiltersSheet
        visible={isFiltersPanelOpen}
        values={draftFilters}
        onChange={(key, value) =>
          updateDraftFilter(
            key as keyof DashboardUsersFilters,
            value as DashboardUsersFilters[keyof DashboardUsersFilters],
          )
        }
        onApply={applyFilters}
        onClear={clearFilters}
        onDismiss={() => setFiltersPanelOpen(false)}
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
            deleteUser(userToDelete.id);
            setUserToDelete(null);
          }
        }}
        onDismiss={() => setUserToDelete(null)}
      />

      <AppToast
        visible={!!feedback}
        message={feedback?.message ?? ""}
        variant={feedback?.variant}
        onDismiss={dismissFeedback}
      />
    </View>
  );
};

export const DashboardUsersScreen = (props: Props) => (
  <Page header={<DashboardAppBar routeName={props.route.name} />}>
    <ScreenErrorBoundary name="DashboardUsers">
      <DashboardUsersContent {...props} />
    </ScreenErrorBoundary>
  </Page>
);

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  subtitle: { flex: 1, fontSize: 14, lineHeight: 20, includeFontPadding: false },
  footer: { paddingVertical: 16, alignItems: "center", gap: 12 },
});
