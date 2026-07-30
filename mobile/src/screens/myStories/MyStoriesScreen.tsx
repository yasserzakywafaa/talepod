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
  Text,
  useTheme,
} from "react-native-paper";

import { navigateToViewStory } from "src/application/navigation/rootNavigation";
import { Page, PAGE_SCROLL_PROPS } from "src/components/layout/Page";
import { useReadableLayout } from "src/components/layout/useReadableLayout";
import { MyStoriesContextProvider, useMyStoriesContext } from "src/features/myStories/store/Provider";
import type { Story } from "src/features/storyCreator/store/state";
import { getStoryCoverImageUrl } from "src/shared/utils/getStoryCoverImageUrl";
import { MainShellAppBar } from "src/components/paper/MainShellAppBar";
const MyStoriesScreenContent = () => {
  const { t } = useTranslation("library");
  const theme = useTheme();
  const { horizontalGutter, contentMaxWidth } = useReadableLayout();
  const {
    store: {
      state: { isFetching, stories, pagingInfo },
    },
    manager: { setUp, handleGetStoriesByPage },
  } = useMyStoriesContext();

  useEffect(() => {
    void setUp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Story }) => {
      const coverUrl = getStoryCoverImageUrl(item);
      return (
      <Pressable onPress={() => navigateToViewStory(item.slug)}>
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
    },
    [theme.colors.onSurfaceVariant],
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={stories}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
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
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 24 }}
            >
              {t("page.emptyCreate")}
            </Text>
          ) : null
        }
        ListFooterComponent={
          <>
            {isFetching ? (
              <ActivityIndicator style={styles.loader} color={theme.colors.primary} />
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
                {t("page.loadMore")}
              </Button>
            ) : null}
          </>
        }
      />
    </View>
  );
};

export const MyStoriesScreen = () => {
  const { t } = useTranslation("library");

  return (
    <Page
      header={
        <MainShellAppBar title={t("nav.myStories", { ns: "common" })} />
      }
    >
      <MyStoriesContextProvider>
        <MyStoriesScreenContent />
      </MyStoriesContextProvider>
    </Page>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  listContent: { paddingBottom: 24, gap: 12 },
  card: { marginBottom: 12 },
  cover: { width: "100%", height: 160 },
  loadMore: { marginTop: 8, alignSelf: "center" },
  loader: { paddingVertical: 16 },
});
