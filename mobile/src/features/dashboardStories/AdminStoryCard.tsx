import { Image, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { BrandCard } from "src/components/brand/BrandCard";
import { DisplayText } from "src/components/brand/DisplayText";
import { MetaTag } from "src/components/brand/MetaTag";
import {
  AdminRowActionsMenu,
  type AdminRowAction,
} from "src/features/dashboardShared/AdminRowActionsMenu";
import { formatAdminDate } from "src/features/dashboardShared/userPresentation";
import type { Story } from "src/features/storyCreator/store/state";

type AdminStoryCardProps = {
  story: Story;
  onOpen: () => void;
  onDelete: () => void;
};

/**
 * One row of the web's stories data grid as a card.
 *
 * The grid's nine columns collapse to three bands: the title, the profile the
 * story was written for (name / gender / age / language, as outlined tags),
 * and an author-and-date footer — with the audio column kept as an icon,
 * because "does this story have narration" is the column an admin scans for.
 */
export const AdminStoryCard = ({
  story,
  onOpen,
  onDelete,
}: AdminStoryCardProps) => {
  const { t, i18n } = useTranslation("dashboard");
  const { t: tCommon } = useTranslation("common");
  const theme = useAppTheme();
  const { fontFamily } = theme.tokens;

  const profile = story.profileInfo;
  const author = story.authorProfile;
  const authorName = author
    ? `${author.name?.givenName ?? ""} ${author.name?.familyName ?? ""}`.trim()
    : t("stories.unknownAuthor");
  const hasAudio = Boolean(story.audioFile?.url);

  const actions: AdminRowAction[] = [
    {
      key: "view",
      label: t("stories.view"),
      icon: "eye-outline",
      onPress: onOpen,
    },
    {
      key: "delete",
      label: tCommon("delete"),
      icon: "delete-outline",
      destructive: true,
      onPress: onDelete,
    },
  ];

  return (
    <BrandCard onPress={onOpen} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <DisplayText size={16} numberOfLines={2}>
            {story.title}
          </DisplayText>
        </View>

        <MaterialCommunityIcons
          name={hasAudio ? "headphones" : "headphones-off"}
          size={18}
          color={hasAudio ? theme.colors.primary : theme.colors.error}
          accessibilityLabel={
            hasAudio ? t("stories.hasAudio") : t("stories.noAudio")
          }
        />

        <AdminRowActionsMenu
          actions={actions}
          accessibilityLabel={t("stories.rowActions", { title: story.title })}
        />
      </View>

      <View style={styles.tags}>
        {profile?.name ? <MetaTag label={profile.name} tone="primary" /> : null}
        {profile?.gender ? <MetaTag label={profile.gender} /> : null}
        {typeof profile?.age === "number" ? (
          <MetaTag label={t("stories.ageValue", { age: profile.age })} />
        ) : null}
        {profile?.language?.name ? (
          <MetaTag label={profile.language.name} />
        ) : null}
      </View>

      <View
        style={[styles.footer, { borderTopColor: theme.colors.outlineVariant }]}
      >
        <View style={styles.author}>
          {author?.picture ? (
            <Image
              source={{ uri: author.picture }}
              style={styles.avatar}
              accessibilityIgnoresInvertColors
            />
          ) : (
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={22}
              color={theme.colors.onSurfaceVariant}
            />
          )}
          <Text
            numberOfLines={1}
            style={[
              styles.footerText,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: fontFamily.regular,
              },
            ]}
          >
            {authorName}
          </Text>
        </View>

        <Text
          style={[
            styles.footerText,
            {
              color: theme.colors.onSurfaceVariant,
              fontFamily: fontFamily.regular,
            },
          ]}
        >
          {formatAdminDate(story.createdAt, i18n.language)}
        </Text>
      </View>
    </BrandCard>
  );
};

const styles = StyleSheet.create({
  card: { width: "100%", padding: 14, gap: 10 },
  header: { flexDirection: "row", alignItems: "center", gap: 10 },
  titleWrap: { flex: 1 },
  tags: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
  },
  author: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  avatar: { width: 22, height: 22, borderRadius: 6 },
  footerText: { fontSize: 12, includeFontPadding: false },
});
