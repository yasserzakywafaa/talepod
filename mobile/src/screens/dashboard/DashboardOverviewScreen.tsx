import { StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Card, Text, useTheme } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import type { DashboardShellStackParamList } from "src/application/navigation/DashboardShellStackNavigator";
import { Page, PageBody } from "src/components/layout/Page";
import { DashboardAppBar } from "src/components/chrome/DashboardAppBar";
import { useApplicationContext } from "src/application/store/Provider";
import { useDashboardOverview } from "src/features/dashboardOverview/useDashboardOverview";

type Props = NativeStackScreenProps<
  DashboardShellStackParamList,
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

  const { storiesCount, usersCount, isFetching } = useDashboardOverview();

  const displayName = user
    ? `${user.name.givenName} ${user.name.familyName}`.trim()
    : "";

  // Each metric opens the section it counts — the drawer is otherwise the only
  // way in, and the number is the thing you want to drill into.
  const metricCard = (
    label: string,
    value: number | null,
    hint: string,
    onPress: () => void,
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
      onPress={onPress}
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
      header={<DashboardAppBar routeName={route.name} />}
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
            () => navigation.navigate(mobileRoutes.dashboard.users),
          )}
          {metricCard(
            t("overview.totalStories"),
            storiesCount,
            t("overview.storiesMetricHint"),
            () => navigation.navigate(mobileRoutes.dashboard.stories),
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
