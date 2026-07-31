import { useCallback, useEffect } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { navigateToViewStory } from "src/application/navigation/rootNavigation";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { Page, PAGE_SCROLL_PROPS } from "src/components/layout/Page";
import { useReadableLayout } from "src/components/layout/useReadableLayout";
import { PillButton } from "src/components/brand/PillButton";
import { StoryCard } from "src/components/brand/StoryCard";
import {
  MyStoriesContextProvider,
  useMyStoriesContext,
} from "src/features/myStories/store/Provider";
import type { Story } from "src/features/storyCreator/store/state";
import { MainShellAppBar } from "src/components/paper/MainShellAppBar";

const MyStoriesScreenContent = () => {
  const { t } = useTranslation("library");
  const theme = useAppTheme();
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
    ({ item }: { item: Story }) => (
      <StoryCard story={item} onPress={() => navigateToViewStory(item.slug)} />
    ),
    [],
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
              style={[
                styles.empty,
                {
                  color: theme.colors.onSurfaceVariant,
                  fontFamily: theme.tokens.fontFamily.regular,
                },
              ]}
            >
              {t("page.emptyCreate")}
            </Text>
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
  listContent: { paddingBottom: 24, gap: 16 },
  empty: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 24,
    includeFontPadding: false,
  },
  footer: { paddingVertical: 16, alignItems: "center", gap: 12 },
});
