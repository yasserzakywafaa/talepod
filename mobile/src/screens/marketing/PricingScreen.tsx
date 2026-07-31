import { StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { Card, Text, useTheme } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import type { MainShellStackParamList } from "src/application/navigation/MainShellStackNavigator";
import { Page, PageBody } from "src/components/layout/Page";
import { useDrawerPageHeader } from "src/components/layout/useDrawerPageHeader";
import { useScreenTypography } from "src/components/layout/useScreenTypography";

type Props = NativeStackScreenProps<
  MainShellStackParamList,
  typeof mobileRoutes.public.pricing
>;

export const PricingScreen = (_props: Props) => {
  const { t } = useTranslation("page");
  const theme = useTheme();
  const typography = useScreenTypography();
  const header = useDrawerPageHeader("nav.pricing");

  return (
    <Page header={header}>
      <PageBody>
        <Text variant="bodyMedium" style={typography.body}>
          {t("pricing.mobileBody")}
        </Text>
        <Card
          style={[styles.card, { backgroundColor: theme.colors.surface }]}
          mode="outlined"
        >
          <Card.Content>
            <Text
              variant="titleMedium"
              style={[typography.badge, styles.cardTitle]}
            >
              {t("pricing.freeTierTitle")}
            </Text>
            <Text variant="bodyMedium" style={typography.body}>
              {t("pricing.freeTierBody")}
            </Text>
          </Card.Content>
        </Card>
        <Card
          style={[styles.card, { backgroundColor: theme.colors.surface }]}
          mode="outlined"
        >
          <Card.Content>
            <Text
              variant="titleMedium"
              style={[typography.badge, styles.cardTitle]}
            >
              {t("pricing.paidTiersTitle")}
            </Text>
            <Text variant="bodyMedium" style={typography.body}>
              {t("pricing.paidTiersBody")}
            </Text>
          </Card.Content>
        </Card>
      </PageBody>
    </Page>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 8,
  },
  cardTitle: {
    marginBottom: 4,
  },
});
