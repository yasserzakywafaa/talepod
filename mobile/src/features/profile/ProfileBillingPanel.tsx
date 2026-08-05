import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Card, Text, useTheme } from "react-native-paper";
import {
  formatLocalizedDate,
  localeFromLanguage,
} from "@yasserzakywafaa/client-core";

import END_POINTS from "src/application/shared/endpoints";
import { api } from "src/application/shared/apiClient";
import type { User, UserSubscription } from "src/shared/types/user";
import { logger } from "src/shared/logger";

type Props = {
  user: User;
};

export const ProfileBillingPanel = ({ user }: Props) => {
  const { t, i18n } = useTranslation("dashboard");
  const theme = useTheme();
  const locale = localeFromLanguage(i18n.language);
  const [details, setDetails] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user.subscription?.id) return;
    void (async () => {
      setLoading(true);
      try {
        const { data } = await api.get<UserSubscription>(
          END_POINTS.PAYMENTS.GET_SUBSCRIPTION_DETAILS,
          { params: { subscriptionId: user.subscription.id } },
        );
        setDetails(data);
      } catch (error) {
        logger.error("Failed to load subscription", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [user.subscription?.id]);

  const max = user.subscription.maxStoriesAllowed;
  const used = user.storyCount;
  const left = Math.max(0, max - used);

  return (
    <Card mode="outlined" style={styles.card}>
      <Card.Content style={styles.content}>
        <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
          {t("subscription.title")}
        </Text>

        {loading ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          <>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {t("subscription.planType")}: {user.subscription.type}
            </Text>
            {details?.startDate ? (
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {t("subscription.startDate")}:{" "}
                {formatLocalizedDate(details.startDate, locale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            ) : null}
            {details?.endDate ? (
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {t("subscription.endDate")}:{" "}
                {formatLocalizedDate(details.endDate, locale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            ) : null}
            <View style={styles.spacer} />
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
              {t("subscription.storiesLeft", { left, max })}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}
            >
              {t("profile.manageOnWeb")}
            </Text>
          </>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { marginTop: 8 },
  content: { gap: 8 },
  spacer: { height: 8 },
});
