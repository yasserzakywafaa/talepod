import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import type { DrawerScreenProps } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Card, Text, useTheme } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import type { DashboardDrawerParamList } from "src/application/navigation/DashboardDrawerNavigator";
import { Page, PageBody } from "src/components/layout/Page";
import { DashboardAppBar } from "src/components/paper/DashboardAppBar";
import { useApplicationContext } from "src/application/store/Provider";
import { useDashboardOverviewContext } from "src/features/dashboardOverview/store/Provider";

type Props = DrawerScreenProps<
  DashboardDrawerParamList,
  typeof mobileRoutes.dashboard.overview
>;

export const DashboardOverviewScreen = ({ navigation, route }: Props) => {
  const { t } = useTranslation("dashboard");
  const theme = useTheme();
  const {
    store: {
      state: {
        auth: { user },
      },
    },
  } = useApplicationContext();

  const {
    store: {
      state: { storiesCount, usersCount, isFetching },
    },
    manager: { setUp },
  } = useDashboardOverviewContext();

  useEffect(() => {
    void setUp();
  }, []);

  const displayName = user
    ? `${user.name.givenName} ${user.name.familyName}`.trim()
    : "";

  const metricCard = (
    label: string,
    value: number | null,
    hint: string,
  ) => (
    <Card
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.primary,
        },
      ]}
      mode="outlined"
    >
      <Card.Content>
        <Text
          variant="labelLarge"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          {label}
        </Text>
        <Text variant="displaySmall" style={{ color: theme.colors.primary }}>
          {value !== null ? value : "--"}
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
        >
          {hint}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <Page
      header={
        <DashboardAppBar navigation={navigation} routeName={route.name} />
      }
    >
      <PageBody>
      <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
        {displayName
          ? t("overview.welcomeBack", { name: displayName })
          : t("overview.welcomeBackFallback")}
      </Text>
      <Text
        variant="bodyLarge"
        style={{ color: theme.colors.onSurfaceVariant }}
      >
        {t("overview.subtitle")}
      </Text>

      {isFetching ? (
        <ActivityIndicator animating color={theme.colors.primary} />
      ) : (
        <View style={styles.metrics}>
          {metricCard(
            t("overview.totalUsers"),
            usersCount,
            t("overview.usersActive"),
          )}
          {metricCard(
            t("overview.totalStories"),
            storiesCount,
            t("overview.storiesMetricHint"),
          )}
        </View>
      )}
      </PageBody>
    </Page>
  );
};

const styles = StyleSheet.create({
  card: {},
  metrics: {
    gap: 12,
  },
});
