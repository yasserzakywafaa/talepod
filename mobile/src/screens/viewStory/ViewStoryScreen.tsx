import {
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
import { ComicReader } from "src/features/viewStory/ComicReader";
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
  // Sideways, a full-width comic page would stand taller than the viewport.
  const mediaWidth = Math.min(width, contentMaxWidth) - 32;
  const shellDrawer = useMainShellDrawer();
  const { story, isFetching } = useViewStory(slug);

  // Opened from the generation snackbar there is nothing to pop back to.
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
          <ScrollView
            contentContainerStyle={[
              styles.scroll,
              { maxWidth: contentMaxWidth, alignSelf: "center", width: "100%" },
            ]}
          >
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
              <ComicReader pages={story.pages!} width={mediaWidth} />
            ) : (
              <LongStoryBody
                mainStory={story.mainStory}
                longStoryImages={story.longStoryImages}
                // Comic pages already show a spinner box per page; long
                // stories had no cue at all while images were pending.
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
  generatingBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  generatingBannerText: { flex: 1, gap: 2 },
});
