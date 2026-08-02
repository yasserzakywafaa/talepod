import { Image, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import type { MainShellStackParamList } from "src/application/navigation/MainShellStackNavigator";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { Page, PageBody } from "src/components/layout/Page";
import { useDrawerPageHeader } from "src/components/layout/useDrawerPageHeader";
import { BrandBadge } from "src/components/brand/BrandBadge";
import { BrandCard } from "src/components/brand/BrandCard";
import { DisplayText } from "src/components/brand/DisplayText";
import { PillButton } from "src/components/brand/PillButton";
import { SegmentedControl } from "src/components/brand/SegmentedControl";
import {
  usePricingPlans,
  type BillingInterval,
  type PricingPlan,
} from "src/features/pricing/usePricingPlans";
import { PayPerStoryCallout } from "src/features/pricing/PayPerStoryCallout";
import { SubscriptionPlanEnum } from "src/shared/types/user";

type Props = NativeStackScreenProps<
  MainShellStackParamList,
  typeof mobileRoutes.public.pricing
>;

const MASCOTS = {
  free: require("../../../assets/images/characters/cute_puppy_with_sparkling_eyes.webp"),
  paid: require("../../../assets/images/characters/lion_cub.webp"),
};

export const PricingScreen = (_props: Props) => {
  const { t } = useTranslation("page");
  const theme = useAppTheme();
  const header = useDrawerPageHeader("nav.pricing");

  const {
    plans,
    isLoading,
    billingInterval,
    setBillingInterval,
    isYearlyAvailable,
    getCurrency,
    getDisplayPrice,
    getYearlySavingsPercent,
  } = usePricingPlans();

  const savings = getYearlySavingsPercent();

  return (
    <Page header={header}>
      <PageBody>
        <View style={styles.hero}>
          <DisplayText
            size={26}
            color={theme.colors.primary}
            style={styles.center}
          >
            {t("pricing.heroTitle")}
          </DisplayText>
          <Text
            style={[
              styles.heroSubtitle,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: theme.tokens.fontFamily.regular,
              },
            ]}
          >
            {t("pricing.heroSubtitle")}
          </Text>
        </View>

        {isYearlyAvailable ? (
          <SegmentedControl<BillingInterval>
            value={billingInterval}
            options={[
              { value: "month", label: t("pricing.monthly") },
              {
                value: "year",
                label: savings
                  ? `${t("pricing.yearly")} · −${savings}%`
                  : t("pricing.yearly"),
              },
            ]}
            onChange={setBillingInterval}
          />
        ) : null}

        {isLoading ? (
          <ActivityIndicator
            style={styles.loader}
            color={theme.colors.primary}
          />
        ) : null}

        {plans.map((plan) => (
          <PlanCard
            key={plan.title}
            plan={plan}
            currency={getCurrency(plan.product)}
            display={getDisplayPrice(plan.product)}
          />
        ))}

        <PayPerStoryCallout />

        {/* The app never takes payment — see `usePricingPlans` for why. */}
        <Text
          style={[
            styles.footnote,
            {
              color: theme.colors.onSurfaceVariant,
              fontFamily: theme.tokens.fontFamily.regular,
            },
          ]}
        >
          {t("pricing.checkoutOnWeb")}
        </Text>
      </PageBody>
    </Page>
  );
};

type PlanCardProps = {
  plan: PricingPlan;
  currency: string;
  display: { amount: number; billedYearly: boolean; yearlyTotal: number };
};

const PlanCard = ({ plan, currency, display }: PlanCardProps) => {
  const { t } = useTranslation("page");
  const theme = useAppTheme();

  const { fontFamily, brand } = theme.tokens;
  const isPremium = plan.title === SubscriptionPlanEnum.Premium;
  const hasPrice = !plan.isFree && display.amount > 0;
  const { cta } = plan;

  const billingLine = plan.isFree
    ? t("pricing.freeForever")
    : display.billedYearly
      ? t("pricing.billedYearly", { currency, total: display.yearlyTotal })
      : t("pricing.billedMonthly");
  return (
    <BrandCard selected={isPremium} style={styles.card}>
      <View style={styles.cardHeader}>
        <Image
          source={plan.isFree ? MASCOTS.free : MASCOTS.paid}
          style={styles.mascot}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
        <DisplayText size={22} style={styles.planTitle}>
          {plan.title}
        </DisplayText>
        {isPremium ? <BrandBadge label={t("pricing.mostPopular")} /> : null}
      </View>

      <View style={styles.priceRow}>
        <DisplayText size={40}>
          {plan.isFree
            ? `${currency}0`
            : hasPrice
              ? `${currency}${display.amount}`
              : "—"}
        </DisplayText>
        {plan.isFree ? null : (
          <Text
            style={[
              styles.perMonth,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: fontFamily.regular,
              },
            ]}
          >
            {t("pricing.perMonth")}
          </Text>
        )}
      </View>

      <Text
        style={[
          styles.billingLine,
          {
            color: theme.colors.onSurfaceVariant,
            fontFamily: fontFamily.regular,
          },
        ]}
      >
        {billingLine}
      </Text>

      <View
        style={[
          styles.divider,
          { backgroundColor: theme.colors.outlineVariant },
        ]}
      />

      {plan.features.map((feature) => (
        <View key={feature} style={styles.featureRow}>
          <MaterialCommunityIcons
            name="check-circle-outline"
            size={18}
            color={isPremium ? brand.honey[400] : brand.honey[500]}
          />
          <Text
            style={[
              styles.featureText,
              {
                color: theme.colors.onSurface,
                fontFamily: fontFamily.regular,
              },
            ]}
          >
            {feature}
          </Text>
        </View>
      ))}

      {/* The web hides the button entirely when `getButtonText` is empty —
          a paid user has nothing to do on the Free card. */}
      {cta.label ? (
        <PillButton
          variant={cta.variant}
          icon={plan.isFree ? "auto-fix" : undefined}
          disabled={cta.disabled}
          fullWidth
          onPress={cta.onPress}
          style={styles.cta}
        >
          {cta.label}
        </PillButton>
      ) : null}
    </BrandCard>
  );
};

const styles = StyleSheet.create({
  hero: { gap: 6, marginBottom: 4 },
  center: { textAlign: "center" },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    includeFontPadding: false,
  },
  loader: { marginVertical: 12 },
  card: { padding: 20 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  mascot: { width: 36, height: 36 },
  planTitle: { flex: 1 },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    marginTop: 12,
  },
  perMonth: { fontSize: 15, includeFontPadding: false },
  billingLine: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
    includeFontPadding: false,
  },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 14 },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 5,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    includeFontPadding: false,
  },
  cta: { marginTop: 16 },
  footnote: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 4,
    includeFontPadding: false,
  },
});
