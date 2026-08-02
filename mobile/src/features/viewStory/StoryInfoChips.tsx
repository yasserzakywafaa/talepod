import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

import { BrandCard } from "src/components/brand/BrandCard";
import { InfoChip } from "src/components/brand/InfoChip";
import { ArtStyles } from "src/shared/artStyles";
import type { Story } from "src/features/storyCreator/store/state";

const artStyleLabel = (id?: string): string =>
  ArtStyles.find((style) => style.id === id)?.label ?? id ?? "";

/** The parameters a story was generated from, as the web's chip footer. */
export const StoryInfoChips = ({ story }: { story: Story }) => {
  const { t } = useTranslation("story");
  const { profileInfo, storyParams } = story;

  const formatLabel =
    story.format === "comic"
      ? t("reader.meta.formatComic")
      : story.format === "long"
        ? t("reader.meta.formatLong")
        : "";

  const wordCount =
    storyParams?.totalWords ??
    (story.mainStory
      ? story.mainStory.trim().split(/\s+/).filter(Boolean).length
      : 0);

  return (
    <BrandCard style={styles.card}>
      {!storyParams?.createdByAdmin && story.createdAt ? (
        <InfoChip
          tone="primary"
          label={t("reader.meta.createdOn")}
          value={new Date(story.createdAt).toLocaleString("en-GB", {
            timeStyle: "short",
            dateStyle: "short",
          })}
        />
      ) : null}

      <View style={styles.group}>
        {profileInfo?.name ? (
          <InfoChip tone="primary" label={t("reader.meta.name")} value={profileInfo.name} />
        ) : null}
        {profileInfo?.gender ? (
          <InfoChip tone="primary" label={t("reader.meta.gender")} value={profileInfo.gender} />
        ) : null}
        {profileInfo?.age !== undefined ? (
          <InfoChip
            tone="primary"
            label={t("reader.meta.age")}
            value={t("reader.meta.ageSuffix", { age: profileInfo.age })}
          />
        ) : null}
        {profileInfo?.language?.name ? (
          <InfoChip
            tone="primary"
            label={t("reader.meta.language")}
            value={profileInfo.language.name}
          />
        ) : null}
        {profileInfo?.interests ? (
          <InfoChip
            tone="primary"
            label={t("reader.meta.interests")}
            value={profileInfo.interests}
          />
        ) : null}
      </View>

      <View style={styles.group}>
        {storyParams?.environment?.value ? (
          <InfoChip
            label={t("reader.meta.environment")}
            value={storyParams.environment.name}
          />
        ) : null}
        {storyParams?.moral?.value ? (
          <InfoChip label={t("reader.meta.moral")} value={storyParams.moral.name} />
        ) : null}
        {storyParams?.tone?.value ? (
          <InfoChip label={t("reader.meta.tone")} value={storyParams.tone.name} />
        ) : null}
        {wordCount ? (
          <InfoChip
            label={t("reader.meta.storyLength")}
            value={t("reader.meta.wordCount", { count: wordCount })}
          />
        ) : null}
        {formatLabel ? (
          <InfoChip label={t("reader.meta.format")} value={formatLabel} />
        ) : null}
        {story.artStyle ? (
          <InfoChip
            label={t("reader.meta.artStyle")}
            value={artStyleLabel(story.artStyle)}
          />
        ) : null}
      </View>
    </BrandCard>
  );
};

const styles = StyleSheet.create({
  card: { padding: 16, gap: 10 },
  group: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
