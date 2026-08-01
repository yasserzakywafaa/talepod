import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DrawerActions } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Appbar, Text } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import type { MainShellStackParamList } from "src/application/navigation/MainShellStackNavigator";
import { useMainShellDrawer } from "src/application/navigation/MainShellDrawerContext";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { DisplayText } from "src/components/brand/DisplayText";
import { LocaleLayoutBoundary } from "src/components/layout/LocaleLayoutBoundary";
import { useReadableLayout } from "src/components/layout/useReadableLayout";
import { Page } from "src/components/layout/Page";
import { useViewStory } from "src/features/viewStory/useViewStory";
import { LongStoryBody } from "src/features/viewStory/LongStoryBody";
import { ScreenErrorBoundary } from "src/components/shared/ErrorBoundary";

type Props = NativeStackScreenProps<
  MainShellStackParamList,
  typeof mobileRoutes.authenticated.viewStory
>;

export const ViewStoryScreen = ({ navigation, route }: Props) => {
  const { slug } = route.params;
  const { t } = useTranslation("story");
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const { contentMaxWidth } = useReadableLayout();
  /**
   * Sideways the window is wider than the screen is tall, so a full-width
   * comic page would stand taller than the viewport. Cap it the way every
   * other page caps its copy.
   */
  const mediaWidth = Math.min(width, contentMaxWidth) - 32;
  const shellDrawer = useMainShellDrawer();
  const { story, isFetching } = useViewStory(slug);

  /**
   * A story can be opened straight from the generation snackbar, in which case
   * there is nothing beneath it to pop back to — fall back to the library.
   */
  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.replace(mobileRoutes.public.library);
  };

  const isComic =
    story?.format === "comic" && (story.pages?.length ?? 0) > 0;
  const imagesPending = story?.imagesStatus === "pending";
  const hasAnyLongStoryImage = (story?.longStoryImages ?? []).some(
    (image) => image.imageUrl,
  );

  const header = (
    <Appbar.Header
      statusBarHeight={0}
      style={[styles.topBarHeader, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.BackAction onPress={goBack} color={theme.colors.primary} />
      <Appbar.Content
        title={
          <DisplayText size={18} numberOfLines={1}>
            {story?.title ?? ""}
          </DisplayText>
        }
      />
      {/* The drawer wraps the shell, so it now slides over the story instead
          of having to navigate somewhere else first. */}
      <Appbar.Action
        icon="menu"
        onPress={() => shellDrawer?.dispatch(DrawerActions.openDrawer())}
        color={theme.colors.primary}
      />
    </Appbar.Header>
  );

  return (
    <Page header={header}>
      <ScreenErrorBoundary name="ViewStory">
      {isFetching && !story ? (
        <View style={styles.loader}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}
          >
            {t("viewStory.loading")}
          </Text>
        </View>
      ) : !story ? (
        <Text style={styles.notFound}>{t("viewStory.notFound")}</Text>
      ) : (
        <LocaleLayoutBoundary>
          <ScrollView contentContainerStyle={styles.scroll}>
            {story.summary ? (
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {story.summary}
              </Text>
            ) : null}

            {/*
             * A banner up top, not a caption buried at the bottom — this is
             * the whole reason a reader might be confused ("is something
             * broken?"), so it needs to be the first thing they see, not the
             * last thing they might scroll past.
             */}
            {imagesPending ? (
              <View
                style={[
                  styles.generatingBanner,
                  {
                    backgroundColor: theme.colors.primaryContainer,
                    borderRadius: theme.tokens.radius.lg,
                  },
                ]}
              >
                <ActivityIndicator
                  size="small"
                  color={theme.colors.onPrimaryContainer}
                />
                <View style={styles.generatingBannerText}>
                  <Text
                    variant="labelLarge"
                    style={{ color: theme.colors.onPrimaryContainer }}
                  >
                    {t("viewStory.imagesGenerating")}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onPrimaryContainer }}
                  >
                    {t("viewStory.imagesGeneratingHint")}
                  </Text>
                </View>
              </View>
            ) : null}

            {isComic ? (
              story.pages!.map((page) => (
                <View key={page.index} style={styles.page}>
                  {page.imageUrl ? (
                    <Image
                      source={{ uri: page.imageUrl }}
                      style={{
                        width: mediaWidth,
                        height: mediaWidth * 0.75,
                        borderRadius: theme.tokens.radius.lg,
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[
                        styles.imagePlaceholder,
                        { width: mediaWidth, backgroundColor: theme.colors.surfaceVariant },
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
                /**
                 * Long stories had no visual cue at all while images were
                 * pending — a comic page at least shows a spinner box where
                 * its picture will go. This gives long-format the same
                 * affordance: one placeholder card, since we don't yet know
                 * where inside the text the images will land.
                 */
                showPendingPlaceholder={imagesPending && !hasAnyLongStoryImage}
              />
            )}
          </ScrollView>
        </LocaleLayoutBoundary>
      )}
      </ScreenErrorBoundary>
    </Page>
  );
};

const styles = StyleSheet.create({
  topBarHeader: { elevation: 0 },
  loader: { marginTop: 48, alignItems: "center" },
  notFound: { marginTop: 48, alignSelf: "center" },
  scroll: { padding: 16, gap: 16, paddingBottom: 40 },
  page: { gap: 8 },
  imagePlaceholder: {
    height: 200,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  generatingBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  generatingBannerText: { flex: 1, gap: 2 },
});
