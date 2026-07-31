import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { navigateToViewStory } from "src/application/navigation/rootNavigation";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { PAGE_SCROLL_PROPS } from "src/components/layout/Page";
import { useReadableLayout } from "src/components/layout/useReadableLayout";
import { AppToast } from "src/components/chrome/AppToast";
import { PillButton } from "src/components/brand/PillButton";
import { AdminEmptyState } from "src/features/dashboardShared/AdminEmptyState";
import { ConfirmDestructiveDialog } from "src/features/dashboardShared/ConfirmDestructiveDialog";
import { AdminStoryCard } from "src/features/dashboardStories/AdminStoryCard";
import { useDashboardStoriesContext } from "src/features/dashboardStories/store/Provider";
import type { Story } from "src/features/storyCreator/store/state";

type AdminStoriesListProps = {
  /** Rendered above the list — the count line, or a per-user heading. */
  subtitle: string;
  emptyMessage: string;
};

/**
 * The story list shared by "all platform stories" and "one user's stories",
 * exactly as the web shares one data-grid config between those two pages.
 */
export const AdminStoriesList = ({
  subtitle,
  emptyMessage,
}: AdminStoriesListProps) => {
  const { t } = useTranslation(["dashboard", "library"]);
  const theme = useAppTheme();
  const { horizontalGutter, contentMaxWidth } = useReadableLayout();
  const [storyToDelete, setStoryToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const {
    store: {
      state: { isFetching, isMutating, stories, paging, feedback },
    },
    manager: {
      setUp,
      handleGetStoriesByPage,
      handleDeleteStory,
      handleDismissFeedback,
    },
  } = useDashboardStoriesContext();

  useFocusEffect(
    useCallback(() => {
      void setUp();
    }, [setUp]),
  );

  const renderItem = useCallback(
    ({ item }: { item: Story }) => (
      <AdminStoryCard
        story={item}
        onOpen={() => navigateToViewStory(item.slug)}
        onDelete={() => setStoryToDelete({ id: item._id, title: item.title })}
      />
    ),
    [],
  );

  const hasMore = (paging.totalPagesCount ?? 1) > paging.pageNumber;

  return (
    <View style={styles.root}>
      <FlatList
        data={stories}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        {...PAGE_SCROLL_PROPS}
        contentContainerStyle={[
          styles.listContent,
          { paddingHorizontal: horizontalGutter, maxWidth: contentMaxWidth },
        ]}
        ListHeaderComponent={
          <Text
            style={[
              styles.subtitle,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: theme.tokens.fontFamily.regular,
              },
            ]}
          >
            {subtitle}
          </Text>
        }
        ListEmptyComponent={
          !isFetching ? (
            <AdminEmptyState icon="book-off-outline" message={emptyMessage} />
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
                onPress={() =>
                  void handleGetStoriesByPage(paging.pageNumber + 1)
                }
              >
                {t("library:page.loadMore")}
              </PillButton>
            ) : null}
          </View>
        }
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
            void handleDeleteStory(storyToDelete.id);
            setStoryToDelete(null);
          }
        }}
        onDismiss={() => setStoryToDelete(null)}
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

const styles = StyleSheet.create({
  root: { flex: 1 },
  listContent: {
    paddingBottom: 24,
    gap: 12,
    width: "100%",
    alignSelf: "center",
  },
  subtitle: { fontSize: 14, lineHeight: 20, includeFontPadding: false },
  footer: { paddingVertical: 16, alignItems: "center", gap: 12 },
});
