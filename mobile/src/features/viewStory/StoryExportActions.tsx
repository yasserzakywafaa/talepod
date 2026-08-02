import { useState } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text } from "react-native-paper";

import { api } from "src/application/shared/apiClient";
import END_POINTS from "src/application/shared/endpoints";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { AvatarCard } from "src/components/brand/AvatarCard";
import { BrandCard } from "src/components/brand/BrandCard";
import { DisplayText } from "src/components/brand/DisplayText";
import { PillButton } from "src/components/brand/PillButton";
import { useStoryAvatar } from "src/features/viewStory/useStoryAvatar";
import type { Story } from "src/features/storyCreator/store/state";
import logger from "src/shared/logger";

type StoryExportActionsProps = {
  story: Story;
  /** Only offered when the account has an email address to send to. */
  canEmail: boolean;
  onFeedback: (message: string, isError?: boolean) => void;
};

/**
 * "Turn this into an eBook" — the server renders the PDF and returns a URL,
 * which opens in the system browser so the OS handles saving and sharing it.
 */
export const StoryExportActions = ({
  story,
  canEmail,
  onFeedback,
}: StoryExportActionsProps) => {
  const { t } = useTranslation("story");
  const theme = useAppTheme();
  const [downloading, setDownloading] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const { avatar, isLoading: isAvatarLoading } = useStoryAvatar(story.avatarId);

  const stillGenerating = story.imagesStatus === "pending";

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { data } = await api.get<{ url: string }>(
        END_POINTS.STORIES.EXPORT_STORY_PDF(story.slug),
      );
      await Linking.openURL(data.url);
      onFeedback(t("reader.export.toastReady"));
    } catch (error) {
      logger.error("Failed to export story PDF", error);
      onFeedback(t("reader.export.toastPdfError"), true);
    } finally {
      setDownloading(false);
    }
  };

  const handleEmail = async () => {
    setEmailing(true);
    try {
      await api.post(END_POINTS.STORIES.EMAIL_STORY_PDF(story.slug));
      onFeedback(t("reader.export.toastEmailSent"));
    } catch (error) {
      logger.error("Failed to email story PDF", error);
      onFeedback(t("reader.export.toastEmailError"), true);
    } finally {
      setEmailing(false);
    }
  };

  return (
    <BrandCard style={styles.card}>
      <View style={styles.heading}>
        <MaterialCommunityIcons
          name="book-open-page-variant-outline"
          size={22}
          color={theme.colors.primary}
        />
        <DisplayText size={20} style={styles.headingText}>
          {t("reader.export.heading")}
        </DisplayText>
      </View>

      <Text
        variant="bodyMedium"
        style={{ color: theme.colors.onSurfaceVariant }}
      >
        {t("reader.export.description")}
      </Text>

      <View style={styles.actions}>
        <PillButton
          icon="download-outline"
          onPress={handleDownload}
          disabled={downloading || stillGenerating}
          loading={downloading}
          fullWidth
        >
          {downloading
            ? t("reader.export.preparing")
            : t("reader.export.download")}
        </PillButton>

        {canEmail ? (
          <PillButton
            variant="outlined"
            icon="email-outline"
            onPress={handleEmail}
            disabled={emailing || stillGenerating}
            loading={emailing}
            fullWidth
          >
            {emailing ? t("reader.export.sending") : t("reader.export.email")}
          </PillButton>
        ) : null}
      </View>

      {stillGenerating ? (
        <View style={styles.pending}>
          <MaterialCommunityIcons
            name="brush"
            size={15}
            color={theme.colors.secondary}
          />
          <Text
            variant="bodySmall"
            style={[styles.pendingText, { color: theme.colors.onSurfaceVariant }]}
          >
            {t("reader.export.imagesPending")}
          </Text>
        </View>
      ) : null}

      {story.avatarId ? (
        <View style={styles.avatar}>
          {isAvatarLoading ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : avatar ? (
            <AvatarCard avatar={avatar} readOnly />
          ) : null}
        </View>
      ) : null}
    </BrandCard>
  );
};

const styles = StyleSheet.create({
  card: { padding: 18, gap: 12 },
  heading: { flexDirection: "row", alignItems: "center", gap: 10 },
  headingText: { flex: 1 },
  actions: { gap: 10, marginTop: 4 },
  pending: { flexDirection: "row", alignItems: "flex-start", gap: 6 },
  pendingText: { flex: 1 },
  avatar: { marginTop: 4, maxWidth: 260, alignSelf: "center", width: "100%" },
});
