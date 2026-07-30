import { useCallback, useEffect } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Button,
  Card,
  SegmentedButtons,
  Text,
  useTheme,
} from "react-native-paper";

import { navigateToCreateStory, navigateToViewStory } from "src/application/navigation/rootNavigation";
import { Page, PAGE_SCROLL_PROPS } from "src/components/layout/Page";
import { useDrawerPageHeader } from "src/components/layout/useDrawerPageHeader";
import { useReadableLayout } from "src/components/layout/useReadableLayout";
import {
  LibraryContextProvider,
  useLibraryContext,
} from "src/features/library/store/Provider";
import type { Story } from "src/features/storyCreator/store/state";
import { getStoryCoverImageUrl } from "src/shared/utils/getStoryCoverImageUrl";

const LibraryScreenContent = () => {
  const { t } = useTranslation("library");
  const theme = useTheme();
  const { horizontalGutter, contentMaxWidth } = useReadableLayout();
  const {
    store: {
      state: { isFetching, stories, pagingInfo, storiesSource },
    },
    manager: {
      setUp,
      handleClearFilters,
      handleGetStoriesByPage,
      handleSetStoriesSource,
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

  const renderItem = ({ item }: { item: Story }) => {
    const coverUrl = getStoryCoverImageUrl(item);
    return (
    <Pressable onPress={() => onStoryPress(item.slug)}>
      <Card mode="outlined" style={styles.card}>
        {coverUrl ? (
          <Image
            source={{ uri: coverUrl }}
            style={styles.cover}
            resizeMode="cover"
          />
        ) : null}
        <Card.Content>
          <Text variant="titleMedium" numberOfLines={2}>
            {item.title}
          </Text>
          {item.summary ? (
            <Text
              variant="bodySmall"
              numberOfLines={3}
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
            >
              {item.summary}
            </Text>
          ) : null}
        </Card.Content>
      </Card>
    </Pressable>
    );
  };

  const listHeader = (
    <View style={styles.header}>
      <Text variant="headlineSmall" style={{ color: theme.colors.primary }}>
        {t("page.libraryTitle")}
      </Text>
      <SegmentedButtons
        value={storiesSource === "talepod" ? "talepod" : "community"}
        onValueChange={(v) =>
          void handleSetStoriesSource(v as "community" | "talepod")
        }
        buttons={[
          { value: "community", label: t("page.sourceCommunity") },
          { value: "talepod", label: t("page.sourceTalepod") },
        ]}
      />
    </View>
  );

  const listEmpty =
    !isFetching && stories.length === 0 ? (
      <View style={styles.empty}>
        <Text variant="bodyLarge" style={{ textAlign: "center" }}>
          {t("page.libraryTitle")}
        </Text>
        <Button
          mode="contained"
          onPress={() => navigateToCreateStory()}
          style={styles.emptyButton}
        >
          {t("page.emptyCreate")}
        </Button>
        <Button mode="outlined" onPress={() => void handleClearFilters()}>
          {t("page.emptyClearFilters")}
        </Button>
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
          <>
            {isFetching ? (
              <ActivityIndicator style={styles.loader} />
            ) : null}
            {(pagingInfo.totalPagesCount ?? 1) > pagingInfo.pageNumber &&
            !isFetching ? (
              <Button
                mode="outlined"
                onPress={() =>
                  void handleGetStoriesByPage(pagingInfo.pageNumber + 1)
                }
                style={styles.loadMore}
              >
                Load more
              </Button>
            ) : null}
          </>
        }
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
  header: { gap: 12, marginBottom: 16 },
  toolbar: { flexDirection: "row", justifyContent: "flex-end" },
  listContent: { paddingBottom: 24 },
  card: { marginBottom: 12 },
  cover: { width: "100%", height: 160 },
  empty: { gap: 12, paddingVertical: 32, alignItems: "center" },
  emptyButton: { marginTop: 8 },
  loadMore: { marginTop: 8, alignSelf: "center" },
  loader: { paddingVertical: 16 },
});
