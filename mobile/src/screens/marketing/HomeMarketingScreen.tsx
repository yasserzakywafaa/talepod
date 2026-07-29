import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import type { DrawerScreenProps } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";
import { Text } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import type { MarketingDrawerParamList } from "src/application/navigation/MarketingDrawerNavigator";
import {
  navigateToMainMyStories,
  openRootSheet,
} from "src/application/navigation/rootNavigation";
import { useApplicationContext } from "src/application/store/Provider";
import { hasAdminRights } from "src/shared/utils/getUserRoles";
import { MarketingScreenBody } from "src/components/layout/PageScaffold";
import {
  useBrandButtonColors,
  useScreenTypography,
} from "src/components/layout/useScreenTypography";
import { AppButton } from "src/components/paper/AppButton";

type Props = DrawerScreenProps<
  MarketingDrawerParamList,
  typeof mobileRoutes.public.home
>;

export const HomeMarketingScreen = ({ navigation }: Props) => {
  const { t } = useTranslation("page");
  const typography = useScreenTypography();
  const brand = useBrandButtonColors();
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  useEffect(() => {
    if (auth.isAuthenticated && auth.user && !hasAdminRights(auth.user)) {
      navigateToMainMyStories();
    }
  }, [auth.isAuthenticated, auth.user]);

  return (
    <MarketingScreenBody>
      <View style={styles.hero}>
        <Text variant="labelLarge" style={typography.badge}>
          {t("home.badge")}
        </Text>
        <Text variant="headlineMedium" style={typography.title}>
          {t("home.title")}
        </Text>
        <Text variant="bodyLarge" style={typography.body}>
          {t("home.body")}
        </Text>
        <AppButton
          mode="contained"
          buttonColor={brand.contained}
          textColor={brand.onContained}
          onPress={() => openRootSheet(mobileRoutes.public.login)}
        >
          {t("home.ctaLogin")}
        </AppButton>
        <AppButton
          mode="outlined"
          textColor={brand.outlined}
          onPress={() => navigation.navigate(mobileRoutes.public.pricing)}
        >
          {t("home.ctaPricing")}
        </AppButton>
      </View>
    </MarketingScreenBody>
  );
};

const styles = StyleSheet.create({
  hero: {
    gap: 12,
  },
});
