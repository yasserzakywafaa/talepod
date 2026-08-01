import { useCallback } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

import {
  navigateToCreateStory,
  navigateToViewStory,
} from "src/application/navigation/rootNavigation";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { Page, PAGE_SCROLL_PROPS } from "src/components/layout/Page";
import { useDrawerPageHeader } from "src/components/layout/useDrawerPageHeader";
import { useReadableLayout } from "src/components/layout/useReadableLayout";
import { ScreenErrorBoundary } from "src/components/shared/ErrorBoundary";
import { FiltersButton } from "src/components/brand/FiltersButton";
import { NoStoriesFound } from "src/components/brand/NoStoriesFound";
import { PillButton } from "src/components/brand/PillButton";
import { SegmentedControl } from "src/components/brand/SegmentedControl";
import { ServiceUnavailable } from "src/components/brand/ServiceUnavailable";
import { StoryCard } from "src/components/brand/StoryCard";
import { StoryFiltersSheet } from "src/components/brand/StoryFiltersSheet";
import {
  useLibraryStories,
  type LibraryStoryFilters,
} from "src/features/library/useLibraryStories";
import type { Story } from "src/features/storyCreator/store/state";

const LibraryScreenContent = () => {
  const { t } = useTranslation("library");
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
    source,
    setSource,
    draftFilters,
    updateDraftFilter,
    applyFilters,
    clearFilters,
    activeFiltersCount,
    isFiltersPanelOpen,
    setFiltersPanelOpen,
  } = useLibraryStories();

  const onStoryPress = useCallback((slug: string) => {
    navigateToViewStory(slug);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Story }) => (
      <StoryCard story={item} onPress={() => onStoryPress(item.slug)} />
    ),
    [onStoryPress],
  );

  const listHeader = (
    <View style={styles.header}>
      <SegmentedControl
        value={source === "talepod" ? "talepod" : "community"}
        options={[
          { value: "community", label: t("page.sourceCommunity") },
          { value: "talepod", label: t("page.sourceTalepod") },
        ]}
        onChange={(value) => setSource(value as "community" | "talepod")}
      />
      <FiltersButton
        activeCount={activeFiltersCount}
        onPress={() => setFiltersPanelOpen(true)}
      />
    </View>
  );

  const listEmpty =
    !isLoading && stories.length === 0 ? (
      <NoStoriesFound
        onCreate={() => navigateToCreateStory()}
        onClearFilters={activeFiltersCount > 0 ? clearFilters : undefined}
      />
    ) : null;

  // Nothing loaded and the API is unreachable — say so rather than showing
  // an empty library that reads as "there are no stories".
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
        data={stories}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        {...PAGE_SCROLL_PROPS}
        /**
         * Infinite scroll rather than a tap target. The threshold is half a
         * screen so the next page is usually resolved before the user reaches
         * the end; the button below stays as the fallback when the prefetch
         * has not landed yet.
         */
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
        onChange={(key, value) => {
          // The sheet's key set includes `createdByAdmin`, which only My
          // Stories filters on; without `showOriginals` it is never emitted.
          if (key === "createdByAdmin") return;
          updateDraftFilter(
            key as keyof LibraryStoryFilters,
            value as LibraryStoryFilters[keyof LibraryStoryFilters],
          );
        }}
        onApply={applyFilters}
        onClear={clearFilters}
        onDismiss={() => setFiltersPanelOpen(false)}
      />
    </View>
  );
};

export const LibraryScreen = () => {
  const header = useDrawerPageHeader("nav.library");

  return (
    <Page header={header}>
      <ScreenErrorBoundary name="Library">
        <LibraryScreenContent />
      </ScreenErrorBoundary>
    </Page>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { marginBottom: 16, gap: 4 },
  listContent: { paddingBottom: 24, gap: 16 },
  footer: { paddingVertical: 16, alignItems: "center", gap: 12 },
});
