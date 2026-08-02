import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { BrandBadge } from "src/components/brand/BrandBadge";
import { DisplayText } from "src/components/brand/DisplayText";
import { PillButton } from "src/components/brand/PillButton";
import { Gradient } from "src/components/shared/Gradient";
import { usePricingPlans } from "src/features/pricing/usePricingPlans";

/**
 * Web `Pricing/PayPerStoryCallout` — "buy one story" for people who don't
 * want a subscription. Self-gating: renders only once a one-time Stripe price
 * exists, exactly as on the web.
 */
export const PayPerStoryCallout = () => {
  const { t } = useTranslation("page");
  const theme = useAppTheme();
  const { isPayPerStoryAvailable, getOneTimePrice, handleBuyStory } =
    usePricingPlans();

  if (!isPayPerStoryAvailable) return null;

  const price = getOneTimePrice();
  const priceLabel = price ? `${price.currency}${price.amount}` : "";
  const { radius, brand, fontFamily, semantic } = theme.tokens;

  return (
    <View
      style={[
        styles.callout,
        {
          borderRadius: radius.xl,
          borderColor: semantic.borderStrong,
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      <View style={styles.header}>
        <Gradient
          colors={[brand.honey[300], brand.twilight[500]]}
          direction="horizontal"
          bands={20}
          style={styles.iconCircle}
        >
          <MaterialCommunityIcons name="ticket-outline" size={28} color="#FFF" />
        </Gradient>

        <View style={styles.headerCopy}>
          <BrandBadge label={t("pricing.payPerStory.badge")} tone="secondary" />
          <Text
            style={[
              styles.caption,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: fontFamily.regular,
              },
            ]}
          >
            {t("pricing.payPerStory.caption")}
          </Text>
        </View>
      </View>

      <DisplayText size={20}>{t("pricing.payPerStory.title")}</DisplayText>

      <Text
        style={[
          styles.body,
          {
            color: theme.colors.onSurfaceVariant,
            fontFamily: fontFamily.regular,
          },
        ]}
      >
        {t("pricing.payPerStory.body", { price: priceLabel })}
      </Text>

      <View style={styles.priceRow}>
        <DisplayText size={34}>{priceLabel}</DisplayText>
        <Text
          style={[
            styles.perStory,
            {
              color: theme.colors.onSurfaceVariant,
              fontFamily: fontFamily.regular,
            },
          ]}
        >
          {t("pricing.payPerStory.perStory")}
        </Text>
      </View>

      <PillButton fullWidth icon="auto-fix" onPress={handleBuyStory}>
        {t("pricing.payPerStory.cta")}
      </PillButton>
    </View>
  );
};

const styles = StyleSheet.create({
  callout: {
    gap: 10,
    padding: 20,
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  header: { flexDirection: "row", alignItems: "center", gap: 14 },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCopy: { flex: 1, gap: 4, alignItems: "flex-start" },
  caption: { fontSize: 12, includeFontPadding: false },
  body: { fontSize: 14, lineHeight: 21, includeFontPadding: false },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  perStory: { fontSize: 13, includeFontPadding: false },
});
