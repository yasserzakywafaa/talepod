import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { navigateToCreateStory } from "src/application/navigation/rootNavigation";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { BrandCard } from "src/components/brand/BrandCard";
import { PillButton } from "src/components/brand/PillButton";
import { MarketingSection } from "src/features/marketing/MarketingSection";
import { asList } from "src/features/marketing/copy";

type Step = { title: string; description: string };

const STEP_ICONS = ["pencil-outline", "auto-fix", "book-open-variant"] as const;

/** Web `Features/features/HowItWorks` — the three-step explainer. */
export const HowItWorksSection = () => {
  const { t } = useTranslation("page");
  const theme = useAppTheme();
  const steps = asList<Step>(
    t("home.howItWorks.steps", { returnObjects: true }),
  );

  return (
    <MarketingSection
      title={t("home.howItWorks.title")}
      subtitle={t("home.howItWorks.subtitle")}
    >
      {steps.map((step, index) => (
        <BrandCard key={step.title} style={styles.card}>
          <View
            style={[
              styles.iconBubble,
              { backgroundColor: theme.tokens.semantic.primarySoft },
            ]}
          >
            <MaterialCommunityIcons
              name={STEP_ICONS[index] ?? "star-outline"}
              size={22}
              color={theme.tokens.semantic.onPrimarySoft}
            />
          </View>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.onSurface,
                fontFamily: theme.tokens.fontFamily.semiBold,
              },
            ]}
          >
            {step.title}
          </Text>
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: theme.tokens.fontFamily.regular,
              },
            ]}
          >
            {step.description}
          </Text>
        </BrandCard>
      ))}

      <View style={styles.actions}>
        <PillButton
          onPress={navigateToCreateStory}
          trailingIcon="shimmer"
          style={styles.cta}
        >
          {t("home.howItWorks.cta")}
        </PillButton>
        <Text
          style={[
            styles.footnote,
            {
              color: theme.colors.onSurfaceVariant,
              fontFamily: theme.tokens.fontFamily.regular,
            },
          ]}
        >
          {t("home.howItWorks.noCreditCard")}
        </Text>
      </View>
    </MarketingSection>
  );
};

const styles = StyleSheet.create({
  card: { gap: 8, alignItems: "center", padding: 20 },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 16, textAlign: "center", includeFontPadding: false },
  description: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    includeFontPadding: false,
  },
  actions: { alignItems: "center", gap: 8, paddingTop: 8 },
  cta: { alignSelf: "center" },
  footnote: { fontSize: 12, textAlign: "center", includeFontPadding: false },
});
