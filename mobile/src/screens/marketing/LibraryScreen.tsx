import { useCallback, useEffect } from "react";
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
import { FiltersButton } from "src/components/brand/FiltersButton";
import { PillButton } from "src/components/brand/PillButton";
import { SegmentedControl } from "src/components/brand/SegmentedControl";
import { StoryCard } from "src/components/brand/StoryCard";
import { StoryFiltersSheet } from "src/components/brand/StoryFiltersSheet";
import {
  LibraryContextProvider,
  useLibraryContext,
} from "src/features/library/store/Provider";
import type { LibraryStoryFilters } from "src/features/library/store/state";
import type { Story } from "src/features/storyCreator/store/state";

const LibraryScreenContent = () => {
  const { t } = useTranslation("library");
  const theme = useAppTheme();
  const { horizontalGutter, contentMaxWidth } = useReadableLayout();
  const {
    store: {
      state: {
        isFetching,
        stories,
        pagingInfo,
        storiesSource,
        filters,
        isFiltersPanelOpen,
        activeFiltersCount,
      },
    },
    manager: {
      setUp,
      handleClearFilters,
      handleGetStoriesByPage,
      handleSetStoriesSource,
      handleToggleFiltersPanel,
      handleUpdateFilters,
      handleFilterStories,
    },
  } = useLibraryContext();

  useEffect(() => {
    void setUp();
    // Initial library load only on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onStoryPress = useCallback((slug: string) => {
    navigateToViewStory(slug);
  }, []);

  const renderItem = ({ item }: { item: Story }) => (
    <StoryCard story={item} onPress={() => onStoryPress(item.slug)} />
  );

  const listHeader = (
    <View style={styles.header}>
      <SegmentedControl
        value={storiesSource === "talepod" ? "talepod" : "community"}
        options={[
          { value: "community", label: t("page.sourceCommunity") },
          { value: "talepod", label: t("page.sourceTalepod") },
        ]}
        onChange={(value) =>
          void handleSetStoriesSource(value as "community" | "talepod")
        }
      />
      <FiltersButton
        activeCount={activeFiltersCount}
        onPress={() => handleToggleFiltersPanel(true)}
      />
    </View>
  );

  const listEmpty =
    !isFetching && stories.length === 0 ? (
      <View style={styles.empty}>
        <PillButton onPress={() => navigateToCreateStory()}>
          {t("page.emptyCreate")}
        </PillButton>
        <PillButton
          variant="outlined"
          onPress={() => void handleClearFilters()}
        >
          {t("page.emptyClearFilters")}
        </PillButton>
      </View>
    ) : null;

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={stories}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
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
        onChange={(key, value) => {
          // The sheet's key set includes `createdByAdmin`, which only My
          // Stories filters on; without `showOriginals` it is never emitted.
          if (key === "createdByAdmin") return;
          handleUpdateFilters(key, value as LibraryStoryFilters[typeof key]);
        }}
        onApply={() => void handleFilterStories()}
        onClear={() => void handleClearFilters()}
        onDismiss={() => handleToggleFiltersPanel(false)}
      />
    </View>
  );
};

export const LibraryScreen = () => {
  const header = useDrawerPageHeader("nav.library");

  return (
    <Page header={header}>
      <LibraryContextProvider>
        <LibraryScreenContent />
      </LibraryContextProvider>
    </Page>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { marginBottom: 16, gap: 4 },
  listContent: { paddingBottom: 24, gap: 16 },
  empty: { gap: 12, paddingVertical: 32, alignItems: "center" },
  footer: { paddingVertical: 16, alignItems: "center", gap: 12 },
});
