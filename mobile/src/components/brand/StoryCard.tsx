import { Image, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { BrandBadge } from "src/components/brand/BrandBadge";
import { BrandCard } from "src/components/brand/BrandCard";
import { DisplayText } from "src/components/brand/DisplayText";
import { MetaTag } from "src/components/brand/MetaTag";
import { PillButton } from "src/components/brand/PillButton";
import { Gradient } from "src/components/shared/Gradient";
import {
  AdultGenderEnum,
  ChildGenderEnum,
  type Story,
} from "src/features/storyCreator/store/state";
import { getStoryCoverImageUrl } from "src/shared/utils/getStoryCoverImageUrl";

const mascotBunny = require("../../../assets/images/characters/sleeping_bunny_with_a_moon.webp");

type StoryCardProps = {
  story: Story;
  onPress: () => void;
  /**
   * Retry/delete actions for a story whose background generation set
   * `textStatus: "failed"`. Omit both on any list that never surfaces failed
   * placeholders (Library, the admin lists) — the card falls back to its
   * normal appearance.
   */
  onRetry?: () => void;
  onDelete?: () => void;
  isRetrying?: boolean;
};

/**
 * Story list card — the native read of web `StoryCard`: 16:9 cover with a
 * format badge, serif title, one-line summary and outlined meta tags.
 *
 * A story whose text generation failed used to render exactly like any other
 * card, permanently stuck on the placeholder title ("Creating your story…")
 * with no way to tell it apart from one still generating, and no way to
 * retry or remove it. `story.textStatus === "failed"` now swaps the cover
 * badge, replaces the summary with what happened, and — when the caller
 * passes `onRetry`/`onDelete` — replaces the tap target with explicit
 * actions instead of navigating to a reader that has nothing to show.
 */
export const StoryCard = ({
  story,
  onPress,
  onRetry,
  onDelete,
  isRetrying = false,
}: StoryCardProps) => {
  const { t } = useTranslation("story");
  const theme = useAppTheme();
  const { gradients, fontFamily } = theme.tokens;

  const cover = getStoryCoverImageUrl(story);
  const isComic = story.format === "comic";
  const isFailed = story.textStatus === "failed";
  const gender = story.profileInfo?.gender;
  const isFemale =
    gender === ChildGenderEnum.Girl || gender === AdultGenderEnum.Female;
  const isMale =
    gender === ChildGenderEnum.Boy || gender === AdultGenderEnum.Male;

  const authorPicture = story.authorProfile?.picture;

  return (
    <BrandCard
      onPress={isFailed ? undefined : onPress}
      style={styles.card}
    >
      <View style={styles.cover}>
        {cover && !isFailed ? (
          <Image
            source={{ uri: cover }}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        ) : (
          <Gradient
            colors={gradients.scene}
            style={[StyleSheet.absoluteFillObject, styles.placeholder]}
          >
            <Image
              source={mascotBunny}
              style={[styles.mascot, isFailed ? styles.mascotFailed : null]}
              resizeMode="contain"
            />
          </Gradient>
        )}

        <BrandBadge
          label={
            isFailed
              ? t("card.failedBadge")
              : isComic
                ? t("card.badgeComic")
                : t("card.badgeStory")
          }
          tone={isFailed ? "error" : isComic ? "primary" : "secondary"}
          style={styles.coverBadge}
        />

        {story.audioFile?.url ? (
          <View
            style={styles.audioPill}
            accessibilityLabel={t("card.hasNarration")}
          >
            <MaterialCommunityIcons
              name="waveform"
              size={16}
              color="#FFFFFF"
            />
          </View>
        ) : null}
      </View>

      <View style={styles.content}>
        <DisplayText size={17} numberOfLines={2}>
          {isFailed ? t("card.failedTitle") : story.title}
        </DisplayText>
        {isFailed ? (
          <Text
            numberOfLines={2}
            style={[
              styles.summary,
              { color: theme.colors.error, fontFamily: fontFamily.regular },
            ]}
          >
            {t("card.failedBody")}
          </Text>
        ) : story.summary ? (
          <Text
            numberOfLines={1}
            style={[
              styles.summary,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: fontFamily.regular,
              },
            ]}
          >
            {story.summary}
          </Text>
        ) : null}
      </View>

      {isFailed && (onRetry || onDelete) ? (
        <View style={styles.failedActions}>
          {onRetry ? (
            <PillButton
              compact
              variant="outlined"
              icon="refresh"
              loading={isRetrying}
              disabled={isRetrying}
              onPress={onRetry}
            >
              {t("card.retry")}
            </PillButton>
          ) : null}
          {onDelete ? (
            <PillButton
              compact
              variant="outlined"
              color={theme.colors.error}
              icon="delete-outline"
              disabled={isRetrying}
              onPress={onDelete}
            >
              {t("card.delete")}
            </PillButton>
          ) : null}
        </View>
      ) : (
        <View style={styles.meta}>
          <View style={styles.tags}>
            {story.profileInfo?.language ? (
              <MetaTag
                label={story.profileInfo.language.value.toUpperCase()}
                tone="secondary"
              />
            ) : null}
            {story.storyParams?.createdByAdmin ? (
              <MetaTag label={t("card.tagOriginal")} tone="primary" />
            ) : story.createdAt ? (
              <MetaTag
                label={new Date(story.createdAt).toLocaleDateString("en-GB")}
                tone="secondary"
              />
            ) : null}
            {isFemale || isMale ? (
              <MaterialCommunityIcons
                name={isFemale ? "gender-female" : "gender-male"}
                size={18}
                color={theme.colors.primary}
              />
            ) : null}
          </View>

          {authorPicture ? (
            <Image
              source={{ uri: authorPicture }}
              style={styles.author}
              accessibilityLabel={t("card.authorAvatarAlt")}
            />
          ) : null}
        </View>
      )}
    </BrandCard>
  );
};

const styles = StyleSheet.create({
  card: { width: "100%" },
  cover: { width: "100%", aspectRatio: 16 / 9, overflow: "hidden" },
  placeholder: { alignItems: "center", justifyContent: "flex-end" },
  mascot: { width: "44%", height: "88%" },
  mascotFailed: { opacity: 0.45 },
  coverBadge: { position: "absolute", top: 8, left: 8 },
  audioPill: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  content: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 6, gap: 4 },
  summary: { fontSize: 13, lineHeight: 19, includeFontPadding: false },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 12,
  },
  tags: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  author: { width: 36, height: 36, borderRadius: 6 },
  failedActions: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 12,
  },
});
