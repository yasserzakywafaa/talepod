import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { DrawerScreenProps } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";

import { mobileRoutes } from "src/application/routes";
import type { MainDrawerParamList } from "src/application/navigation/MainDrawerNavigator";
import {
  navigateToMainMyStories,
  navigateToPublicMarketingScreen,
  navigateToCreateStory,
} from "src/application/navigation/rootNavigation";
import { useApplicationContext } from "src/application/store/Provider";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { Page, PageBody } from "src/components/layout/Page";
import { BrandBadge } from "src/components/brand/BrandBadge";
import { DisplayText } from "src/components/brand/DisplayText";
import { PillButton } from "src/components/brand/PillButton";
import { Gradient } from "src/components/shared/Gradient";
import { MarketingAppBar } from "src/components/chrome/MarketingAppBar";

type Props = DrawerScreenProps<
  MainDrawerParamList,
  typeof mobileRoutes.public.home
>;

export const HomeMarketingScreen = ({ navigation }: Props) => {
  const { t } = useTranslation("page");
  const theme = useAppTheme();
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      navigateToMainMyStories();
    }
  }, [auth.isAuthenticated, auth.user]);

  const handleCreateStoryPress = () => {
    navigateToCreateStory();
  };

  const handlePricingPress = () => {
    navigateToPublicMarketingScreen(mobileRoutes.public.pricing);
  };

  return (
    <Page header={<MarketingAppBar navigation={navigation} showCreateOnHome />}>
      <PageBody>
        {/* Night-sky-to-dawn hero — the web `bgTwilight` ramp. */}
        <Gradient
          colors={theme.tokens.gradients.twilight}
          bands={32}
          style={[styles.hero, { borderRadius: theme.tokens.radius.xl }]}
        >
          <BrandBadge label={t("home.badge")} />
          <DisplayText size={32} color="#FFFFFF" style={styles.title}>
            {t("home.title")}
          </DisplayText>
          <Text
            style={[
              styles.body,
              { fontFamily: theme.tokens.fontFamily.regular },
            ]}
          >
            {t("home.body")}
          </Text>
          <View style={styles.actions}>
            <PillButton onPress={handleCreateStoryPress} trailingIcon="shimmer">
              {t("home.ctaLogin")}
            </PillButton>
            <PillButton
              variant="text"
              color="#FFFFFF"
              onPress={handlePricingPress}
            >
              {t("home.ctaPricing")}
            </PillButton>
          </View>
        </Gradient>
      </PageBody>
    </Page>
  );
};

const styles = StyleSheet.create({
  hero: {
    gap: 16,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: { textAlign: "center" },
  body: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    color: "rgba(255,255,255,0.88)",
    includeFontPadding: false,
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingTop: 8,
  },
});
