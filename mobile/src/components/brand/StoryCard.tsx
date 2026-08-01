import { Image, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { BrandBadge } from "src/components/brand/BrandBadge";
import { BrandCard } from "src/components/brand/BrandCard";
import { DisplayText } from "src/components/brand/DisplayText";
import { MetaTag } from "src/components/brand/MetaTag";
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
};

/**
 * Story list card — the native read of web `StoryCard`: 16:9 cover with a
 * format badge, serif title, one-line summary and outlined meta tags.
 */
export const StoryCard = ({ story, onPress }: StoryCardProps) => {
  const { t } = useTranslation("story");
  const theme = useAppTheme();
  const { gradients, fontFamily } = theme.tokens;

  const cover = getStoryCoverImageUrl(story);
  const isComic = story.format === "comic";
  const gender = story.profileInfo?.gender;
  const isFemale =
    gender === ChildGenderEnum.Girl || gender === AdultGenderEnum.Female;
  const isMale =
    gender === ChildGenderEnum.Boy || gender === AdultGenderEnum.Male;

  const authorPicture = story.authorProfile?.picture;

  return (
    <BrandCard onPress={onPress} style={styles.card}>
      <View style={styles.cover}>
        {cover ? (
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
              style={styles.mascot}
              resizeMode="contain"
            />
          </Gradient>
        )}

        <BrandBadge
          label={isComic ? t("card.badgeComic") : t("card.badgeStory")}
          tone={isComic ? "primary" : "secondary"}
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
          {story.title}
        </DisplayText>
        {story.summary ? (
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
    </BrandCard>
  );
};

const styles = StyleSheet.create({
  card: { width: "100%" },
  cover: { width: "100%", aspectRatio: 16 / 9, overflow: "hidden" },
  placeholder: { alignItems: "center", justifyContent: "flex-end" },
  mascot: { width: "44%", height: "88%" },
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
});
