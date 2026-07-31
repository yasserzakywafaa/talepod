import { useCallback, useEffect } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

import {
  navigateToCreateStory,
  navigateToViewStory,
} from "src/application/navigation/rootNavigation";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { Page, PAGE_SCROLL_PROPS } from "src/components/layout/Page";
import { useReadableLayout } from "src/components/layout/useReadableLayout";
import { FiltersButton } from "src/components/brand/FiltersButton";
import { NoStoriesFound } from "src/components/brand/NoStoriesFound";
import { PillButton } from "src/components/brand/PillButton";
import { ServiceUnavailable } from "src/components/brand/ServiceUnavailable";
import { StoryCard } from "src/components/brand/StoryCard";
import { StoryFiltersSheet } from "src/components/brand/StoryFiltersSheet";
import {
  MyStoriesContextProvider,
  useMyStoriesContext,
} from "src/features/myStories/store/Provider";
import type { Story } from "src/features/storyCreator/store/state";
import { MainShellAppBar } from "src/components/chrome/MainShellAppBar";

const MyStoriesScreenContent = () => {
  const { t } = useTranslation("library");
  const theme = useAppTheme();
  const { horizontalGutter, contentMaxWidth } = useReadableLayout();
  const {
    store: {
      state: {
        isFetching,
        stories,
        loadError,
        pagingInfo,
        filters,
        isFiltersPanelOpen,
        activeFiltersCount,
      },
    },
    manager: {
      setUp,
      handleGetStoriesByPage,
      handleClearFilters,
      handleToggleFiltersPanel,
      handleUpdateFilters,
      handleFilterStories,
    },
  } = useMyStoriesContext();

  useEffect(() => {
    void setUp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Story }) => (
      <StoryCard story={item} onPress={() => navigateToViewStory(item.slug)} />
    ),
    [],
  );

  // Nothing loaded and the API is unreachable — say so rather than showing
  // an empty list that reads as "you have no stories".
  if (loadError && stories.length === 0) {
    return (
      <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
        <ServiceUnavailable
          kind={loadError}
          isRetrying={isFetching}
          onRetry={() => void setUp()}
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
        ListHeaderComponent={
          <View style={styles.header}>
            <FiltersButton
              activeCount={activeFiltersCount}
              onPress={() => handleToggleFiltersPanel(true)}
            />
          </View>
        }
        {...PAGE_SCROLL_PROPS}
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
          !isFetching ? (
            <NoStoriesFound
              onCreate={() => navigateToCreateStory()}
              onClearFilters={
                activeFiltersCount > 0
                  ? () => void handleClearFilters()
                  : undefined
              }
            />
          ) : null
        }
        ListFooterComponent={
          <View style={styles.footer}>
            {isFetching ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : null}
            {(pagingInfo.totalPagesCount ?? 1) > pagingInfo.pageNumber &&
            !isFetching ? (
              <PillButton
                variant="outlined"
                onPress={() =>
                  void handleGetStoriesByPage(pagingInfo.pageNumber + 1)
                }
              >
                {t("page.loadMore")}
              </PillButton>
            ) : null}
          </View>
        }
      />

      <StoryFiltersSheet
        visible={isFiltersPanelOpen}
        values={filters}
        showOriginals
        onChange={handleUpdateFilters}
        onApply={() => void handleFilterStories()}
        onClear={() => void handleClearFilters()}
        onDismiss={() => handleToggleFiltersPanel(false)}
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
      <MyStoriesContextProvider>
        <MyStoriesScreenContent />
      </MyStoriesContextProvider>
    </Page>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { marginBottom: 4 },
  listContent: { paddingBottom: 24, gap: 16 },
  footer: { paddingVertical: 16, alignItems: "center", gap: 12 },
});
