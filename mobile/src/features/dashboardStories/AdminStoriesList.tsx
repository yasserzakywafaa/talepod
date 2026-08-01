import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

import { navigateToViewStory } from "src/application/navigation/rootNavigation";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { PAGE_SCROLL_PROPS } from "src/components/layout/Page";
import { useGridList } from "src/components/layout/useGridList";
import { AppToast } from "src/components/chrome/AppToast";
import { FiltersButton } from "src/components/brand/FiltersButton";
import { PillButton } from "src/components/brand/PillButton";
import { ServiceUnavailable } from "src/components/brand/ServiceUnavailable";
import { StoryFiltersSheet } from "src/components/brand/StoryFiltersSheet";
import { AdminEmptyState } from "src/features/dashboardShared/AdminEmptyState";
import { ConfirmDestructiveDialog } from "src/features/dashboardShared/ConfirmDestructiveDialog";
import { AdminStoryCard } from "src/features/dashboardStories/AdminStoryCard";
import { useDashboardStories } from "src/features/dashboardStories/useDashboardStories";
import type { Story } from "src/features/storyCreator/store/state";

type AdminStoriesListProps = {
  /** Scopes the list to one account's stories, as on the user detail screen. */
  userId?: string;
  /** Rendered above the list once totalCount is known — the count line, or a per-user heading. */
  subtitle: (totalCount: number) => string;
  emptyMessage: string;
};

/**
 * The story list shared by "all platform stories" and "one user's stories",
 * exactly as the web shares one data-grid config between those two pages.
 */
export const AdminStoriesList = ({
  userId,
  subtitle,
  emptyMessage,
}: AdminStoriesListProps) => {
  const { t } = useTranslation(["dashboard", "library"]);
  const theme = useAppTheme();
  const { gridKey, listProps, itemStyle } = useGridList();
  const [storyToDelete, setStoryToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const {
    stories,
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
    deleteStory,
    isMutating,
    feedback,
    dismissFeedback,
  } = useDashboardStories(userId);

  const renderItem = useCallback(
    ({ item }: { item: Story }) => (
      <View style={itemStyle}>
        <AdminStoryCard
          story={item}
          onOpen={() => navigateToViewStory(item.slug)}
          onDelete={() => setStoryToDelete({ id: item._id, title: item.title })}
        />
      </View>
    ),
    [itemStyle],
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
        data={stories}
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
              {subtitle(totalCount)}
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
              icon="book-off-outline"
              message={
                activeFiltersCount > 0
                  ? t("dashboard:stories.emptyFiltered")
                  : emptyMessage
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

      {/* The same sheet Library and My Stories use — the admin list filters on
          exactly the fields those lists do, and the server reads one shape. */}
      <StoryFiltersSheet
        visible={isFiltersPanelOpen}
        values={draftFilters}
        showOriginals
        onChange={updateDraftFilter}
        onApply={applyFilters}
        onClear={clearFilters}
        onDismiss={() => setFiltersPanelOpen(false)}
      />

      <ConfirmDestructiveDialog
        visible={!!storyToDelete}
        title={t("dashboard:stories.deleteStoryTitle")}
        message={t("dashboard:stories.deleteStoryConfirmPlain", {
          name: storyToDelete?.title ?? "",
        })}
        isBusy={isMutating}
        onConfirm={() => {
          if (storyToDelete) {
            deleteStory(storyToDelete.id);
            setStoryToDelete(null);
          }
        }}
        onDismiss={() => setStoryToDelete(null)}
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
