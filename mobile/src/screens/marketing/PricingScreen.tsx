import { StyleSheet } from "react-native";
import type { DrawerScreenProps } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";
import { Card, Text, useTheme } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import type { MarketingDrawerParamList } from "src/application/navigation/MarketingDrawerNavigator";
import { MarketingScreenBody } from "src/components/layout/PageScaffold";
import { useScreenTypography } from "src/components/layout/useScreenTypography";

type Props = DrawerScreenProps<
  MarketingDrawerParamList,
  typeof mobileRoutes.public.pricing
>;

export const PricingScreen = (_props: Props) => {
  const { t } = useTranslation("page");
  const theme = useTheme();
  const typography = useScreenTypography();

  return (
    <MarketingScreenBody>
      <Text variant="headlineSmall" style={typography.title}>
        {t("pricing.plans")}
      </Text>
      <Text variant="bodyMedium" style={typography.body}>
        {t("pricing.mobileBody")}
      </Text>
      <Card
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        mode="outlined"
      >
        <Card.Content>
          <Text variant="titleMedium" style={[typography.badge, styles.cardTitle]}>
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
          <Text variant="titleMedium" style={[typography.badge, styles.cardTitle]}>
            {t("pricing.paidTiersTitle")}
          </Text>
          <Text variant="bodyMedium" style={typography.body}>
            {t("pricing.paidTiersBody")}
          </Text>
        </Card.Content>
      </Card>
    </MarketingScreenBody>
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
