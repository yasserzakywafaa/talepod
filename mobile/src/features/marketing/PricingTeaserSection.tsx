import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { mobileRoutes } from "src/application/routes";
import { navigateToPublicMarketingScreen } from "src/application/navigation/rootNavigation";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { BrandCard } from "src/components/brand/BrandCard";
import { PillButton } from "src/components/brand/PillButton";
import { MarketingSection } from "src/features/marketing/MarketingSection";
import { usePricingPlans } from "src/features/pricing/usePricingPlans";

/**
 * Compact read of the web pricing table: one row per plan with its headline
 * price, handing off to the full pricing screen for the feature lists.
 */
export const PricingTeaserSection = () => {
  const { t } = useTranslation("page");
  const theme = useAppTheme();
  const { plans, getCurrency, getDisplayPrice } = usePricingPlans();

  const handlePricingPress = () => {
    navigateToPublicMarketingScreen(mobileRoutes.public.pricing);
  };

  return (
    <MarketingSection
      title={t("home.pricing.title")}
      subtitle={t("home.pricing.subtitle")}
    >
      {plans.map((plan) => {
        const price = getDisplayPrice(plan.product);
        const currency = getCurrency(plan.product);

        return (
          <BrandCard key={plan.title} style={styles.row}>
            <View style={styles.copy}>
              <Text
                style={[
                  styles.plan,
                  {
                    color: theme.colors.onSurface,
                    fontFamily: theme.tokens.fontFamily.semiBold,
                  },
                ]}
              >
                {plan.title}
              </Text>
              <Text
                style={[
                  styles.feature,
                  {
                    color: theme.colors.onSurfaceVariant,
                    fontFamily: theme.tokens.fontFamily.regular,
                  },
                ]}
                numberOfLines={2}
              >
                {plan.features.slice(0, 2).join(" · ")}
              </Text>
            </View>

            <Text
              style={[
                styles.price,
                {
                  color: theme.colors.primary,
                  fontFamily: theme.tokens.fontFamily.semiBold,
                },
              ]}
            >
              {plan.isFree || !price.amount
                ? t("pricing.freeForever")
                : `${currency}${price.amount}${t("pricing.perMonth")}`}
            </Text>
          </BrandCard>
        );
      })}

      <PillButton
        variant="outlined"
        onPress={handlePricingPress}
        trailingIcon="arrow-right"
        style={styles.cta}
      >
        {t("home.pricing.cta")}
      </PillButton>
    </MarketingSection>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 18,
  },
  copy: { flex: 1, gap: 4 },
  plan: {
    fontSize: 16,
    includeFontPadding: false,
    textTransform: "capitalize",
  },
  feature: { fontSize: 12, lineHeight: 18, includeFontPadding: false },
  price: { fontSize: 14, includeFontPadding: false },
  cta: { alignSelf: "center" },
});
