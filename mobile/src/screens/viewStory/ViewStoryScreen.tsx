import { useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ActivityIndicator, Appbar, Text } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import type { RootStackParamList } from "src/application/navigation/types";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { DisplayText } from "src/components/brand/DisplayText";
import { LocaleLayoutBoundary } from "src/components/layout/LocaleLayoutBoundary";
import { Page } from "src/components/layout/Page";
import { openMainDrawer } from "src/application/navigation/rootNavigation";
import {
  useViewStoryManager,
  useViewStoryStore,
} from "src/features/viewStory/useViewStory";
import { LongStoryBody } from "src/features/viewStory/LongStoryBody";

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof mobileRoutes.authenticated.viewStory
>;

export const ViewStoryScreen = ({ navigation, route }: Props) => {
  const { slug } = route.params;
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const store = useViewStoryStore();
  const manager = useViewStoryManager(store);
  const { story, isFetching } = store.state;

  useEffect(() => {
    void manager.setUp(slug);
  }, [slug]);

  const isComic =
    story?.format === "comic" && (story.pages?.length ?? 0) > 0;

  const header = (
    <Appbar.Header
      statusBarHeight={0}
      style={[styles.topBarHeader, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.BackAction
        onPress={() => navigation.goBack()}
        color={theme.colors.primary}
      />
      <Appbar.Content
        title={
          <DisplayText size={18} numberOfLines={1}>
            {story?.title ?? ""}
          </DisplayText>
        }
      />
      <Appbar.Action
        icon="menu"
        onPress={openMainDrawer}
        color={theme.colors.primary}
      />
    </Appbar.Header>
  );

  return (
    <Page header={header}>
      {isFetching && !story ? (
        <ActivityIndicator style={styles.loader} color={theme.colors.primary} />
      ) : !story ? (
        <Text style={styles.loader}>Story not found</Text>
      ) : (
        <LocaleLayoutBoundary>
          <ScrollView contentContainerStyle={styles.scroll}>
            {story.summary ? (
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {story.summary}
              </Text>
            ) : null}

            {isComic ? (
              story.pages!.map((page) => (
                <View key={page.index} style={styles.page}>
                  {page.imageUrl ? (
                    <Image
                      source={{ uri: page.imageUrl }}
                      style={{
                        width: width - 32,
                        height: (width - 32) * 0.75,
                        borderRadius: theme.tokens.radius.lg,
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[
                        styles.imagePlaceholder,
                        { width: width - 32, backgroundColor: theme.colors.surfaceVariant },
                      ]}
                    >
                      <ActivityIndicator color={theme.colors.primary} />
                    </View>
                  )}
                  <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                    {page.caption}
                  </Text>
                </View>
              ))
            ) : (
              <LongStoryBody
                mainStory={story.mainStory}
                longStoryImages={story.longStoryImages}
              />
            )}

            {story.imagesStatus === "pending" ? (
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Illustrations are still generating…
              </Text>
            ) : null}
          </ScrollView>
        </LocaleLayoutBoundary>
      )}
    </Page>
  );
};

const styles = StyleSheet.create({
  topBarHeader: { elevation: 0 },
  loader: { marginTop: 48, alignSelf: "center" },
  scroll: { padding: 16, gap: 16, paddingBottom: 40 },
  page: { gap: 8 },
  imagePlaceholder: {
    height: 200,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
