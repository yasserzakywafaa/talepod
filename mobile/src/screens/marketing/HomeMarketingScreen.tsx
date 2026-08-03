import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
import { SectionDivider } from "src/features/marketing/MarketingSection";
import { StoryFormatsSection } from "src/features/marketing/StoryFormatsSection";
import { TestimonialsSection } from "src/features/marketing/TestimonialsSection";
import {
  BENEFIT_ICONS,
  IconItemsSection,
  KEY_FEATURE_ICONS,
} from "src/features/marketing/IconItemsSection";
import { HowItWorksSection } from "src/features/marketing/HowItWorksSection";
import { StoryExamplesSection } from "src/features/marketing/StoryExamplesSection";
import { PricingTeaserSection } from "src/features/marketing/PricingTeaserSection";
import { GuaranteeSection } from "src/features/marketing/GuaranteeSection";
import { CallToActionSection } from "src/features/marketing/CallToActionSection";
import { FaqSection } from "src/features/marketing/FaqSection";
import { asList } from "src/features/marketing/copy";

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

  const trustBadges = asList<string>(
    t("home.trustBadges", { returnObjects: true }),
  );

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
            {/* PillButton pins itself to `alignSelf: "flex-start"`, which beats
                the container's `alignItems: "center"` — so centring has to be
                asked for explicitly here. */}
            <PillButton
              variant="text"
              color="#FFFFFF"
              style={styles.centeredAction}
              onPress={handlePricingPress}
            >
              {t("home.ctaPricing")}
            </PillButton>
          </View>

          <View style={styles.trustBadges}>
            {trustBadges.map((badge) => (
              <View key={badge} style={styles.trustBadge}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={14}
                  color="rgba(255,255,255,0.85)"
                />
                <Text
                  style={[
                    styles.trustBadgeLabel,
                    { fontFamily: theme.tokens.fontFamily.regular },
                  ]}
                >
                  {badge}
                </Text>
              </View>
            ))}
          </View>
        </Gradient>

        {/* Below the hero the app mirrors the web landing page section order. */}
        <StoryFormatsSection />
        <SectionDivider />
        <TestimonialsSection />
        <SectionDivider />
        <IconItemsSection
          translationKey="keyFeatures"
          icons={KEY_FEATURE_ICONS}
        />
        <SectionDivider />
        <HowItWorksSection />
        <SectionDivider />
        <StoryExamplesSection />
        <SectionDivider />
        <IconItemsSection translationKey="benefits" icons={BENEFIT_ICONS} />
        <SectionDivider />
        <PricingTeaserSection />
        <SectionDivider />
        <GuaranteeSection />
        <SectionDivider />
        <CallToActionSection />
        <SectionDivider />
        <FaqSection />
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
  centeredAction: { alignSelf: "center" },
  trustBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  trustBadge: { flexDirection: "row", alignItems: "center", gap: 5 },
  trustBadgeLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    includeFontPadding: false,
  },
});
