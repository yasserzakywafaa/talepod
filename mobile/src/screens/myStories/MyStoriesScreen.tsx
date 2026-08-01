import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

import {
  navigateToCreateStory,
  navigateToViewStory,
} from "src/application/navigation/rootNavigation";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { Page, PAGE_SCROLL_PROPS } from "src/components/layout/Page";
import { useReadableLayout } from "src/components/layout/useReadableLayout";
import { ScreenErrorBoundary } from "src/components/shared/ErrorBoundary";
import { ConfirmDestructiveDialog } from "src/features/dashboardShared/ConfirmDestructiveDialog";
import { FiltersButton } from "src/components/brand/FiltersButton";
import { NoStoriesFound } from "src/components/brand/NoStoriesFound";
import { PillButton } from "src/components/brand/PillButton";
import { ServiceUnavailable } from "src/components/brand/ServiceUnavailable";
import { StoryCard } from "src/components/brand/StoryCard";
import { StoryFiltersSheet } from "src/components/brand/StoryFiltersSheet";
import { useFailedStoryActions } from "src/features/myStories/useFailedStoryActions";
import { useMyStories } from "src/features/myStories/useMyStories";
import type { Story } from "src/features/storyCreator/store/state";
import { MainShellAppBar } from "src/components/chrome/MainShellAppBar";

const MyStoriesScreenContent = () => {
  const { t } = useTranslation(["library", "story"]);
  const theme = useAppTheme();
  const { horizontalGutter, contentMaxWidth } = useReadableLayout();
  const {
    stories,
    isLoading,
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
  } = useMyStories();

  const listRef = useRef<FlatList<Story>>(null);

  // The replacement placeholder is inserted at the top; without this the retry
  // looked like it did nothing until the user scrolled up to find it.
  const scrollToTop = useCallback(
    () => listRef.current?.scrollToOffset({ offset: 0, animated: true }),
    [],
  );

  const { deleteStory, retryStory, isDeletingStory, isRetryingStory } =
    useFailedStoryActions({ onRetryStarted: scrollToTop });
  const [pendingDelete, setPendingDelete] = useState<Story | null>(null);

  const renderItem = useCallback(
    ({ item }: { item: Story }) => {
      const isFailed = item.textStatus === "failed";
      return (
        <StoryCard
          story={item}
          onPress={() => navigateToViewStory(item.slug)}
          onRetry={isFailed ? () => retryStory(item) : undefined}
          onDelete={isFailed ? () => setPendingDelete(item) : undefined}
          isRetrying={isRetryingStory(item._id)}
        />
      );
    },
    [retryStory, isRetryingStory],
  );

  // Nothing loaded and the API is unreachable — say so rather than showing
  // an empty list that reads as "you have no stories".
  if (loadError) {
    return (
      <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
        <ServiceUnavailable
          kind={loadError}
          isRetrying={isLoading}
          onRetry={retry}
        />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <FlatList
        ref={listRef}
        data={stories}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.header}>
            <FiltersButton
              activeCount={activeFiltersCount}
              onPress={() => setFiltersPanelOpen(true)}
            />
          </View>
        }
        {...PAGE_SCROLL_PROPS}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingHorizontal: horizontalGutter,
            maxWidth: contentMaxWidth,
            alignSelf: "center",
            width: "100%",
          },
        ]}
        ListEmptyComponent={
          !isLoading ? (
            <NoStoriesFound
              onCreate={() => navigateToCreateStory()}
              onClearFilters={activeFiltersCount > 0 ? clearFilters : undefined}
            />
          ) : null
        }
        ListFooterComponent={
          <View style={styles.footer}>
            {isLoading || isFetchingNextPage ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : null}
            {hasNextPage && !isFetchingNextPage && !isLoading ? (
              <PillButton variant="outlined" onPress={loadMore}>
                {t("page.loadMore")}
              </PillButton>
            ) : null}
          </View>
        }
      />

      <StoryFiltersSheet
        visible={isFiltersPanelOpen}
        values={draftFilters}
        showOriginals
        onChange={(key, value) =>
          updateDraftFilter(
            key as keyof typeof draftFilters,
            value as (typeof draftFilters)[keyof typeof draftFilters],
          )
        }
        onApply={applyFilters}
        onClear={clearFilters}
        onDismiss={() => setFiltersPanelOpen(false)}
      />

      <ConfirmDestructiveDialog
        visible={pendingDelete !== null}
        title={t("story:card.deleteFailedTitle")}
        message={t("story:card.deleteFailedBody", {
          title: pendingDelete?.profileInfo?.name ?? "",
        })}
        confirmLabel={t("story:card.delete")}
        isBusy={isDeletingStory}
        onConfirm={() => {
          if (pendingDelete) {
            deleteStory(pendingDelete._id);
            setPendingDelete(null);
          }
        }}
        onDismiss={() => setPendingDelete(null)}
      />
    </View>
  );
};

export const MyStoriesScreen = () => {
  const { t } = useTranslation("library");

  return (
    <Page
      header={<MainShellAppBar title={t("nav.myStories", { ns: "common" })} />}
    >
      <ScreenErrorBoundary name="MyStories">
        <MyStoriesScreenContent />
      </ScreenErrorBoundary>
    </Page>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { marginBottom: 4 },
  listContent: { paddingBottom: 24, gap: 16 },
  footer: { paddingVertical: 16, alignItems: "center", gap: 12 },
});
