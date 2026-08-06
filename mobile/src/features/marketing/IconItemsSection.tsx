import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { BrandCard } from "src/components/brand/BrandCard";
import { MarketingSection } from "src/features/marketing/MarketingSection";
import { asList } from "src/features/marketing/copy";

type Item = { title: string; description: string };

type IconItemsSectionProps = {
  /** Key under the `page:home` namespace holding `title`/`subtitle`/`items`. */
  translationKey: "keyFeatures" | "benefits";
  icons: readonly (keyof typeof MaterialCommunityIcons.glyphMap)[];
};

/**
 * Web `KeyFeatures` and `Benefits` — the same icon + title + description grid,
 * stacked into one column for the phone.
 */
export const IconItemsSection = ({
  translationKey,
  icons,
}: IconItemsSectionProps) => {
  const { t } = useTranslation("page");
  const theme = useAppTheme();
  const items = asList<Item>(
    t(`home.${translationKey}.items`, { returnObjects: true }),
  );

  return (
    <MarketingSection
      title={t(`home.${translationKey}.title`)}
      subtitle={t(`home.${translationKey}.subtitle`)}
    >
      {items.map((item, index) => (
        <BrandCard key={item.title} style={styles.card}>
          <MaterialCommunityIcons
            name={icons[index] ?? "star-outline"}
            size={26}
            color={theme.colors.primary}
          />
          <View style={styles.copy}>
            <Text
              style={[
                styles.title,
                {
                  color: theme.colors.onSurface,
                  fontFamily: theme.tokens.fontFamily.semiBold,
                },
              ]}
            >
              {item.title}
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
              {item.description}
            </Text>
          </View>
        </BrandCard>
      ))}
    </MarketingSection>
  );
};

export const KEY_FEATURE_ICONS = [
  "pencil-outline",
  "baby-face-outline",
  "book-open-page-variant-outline",
  "heart-outline",
  "account-group-outline",
  "cellphone-link",
] as const;

export const BENEFIT_ICONS = [
  "lightbulb-on-outline",
  "heart-outline",
  "book-open-variant",
  "school-outline",
  "star-outline",
  "monitor-off",
] as const;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    padding: 18,
  },
  copy: { flex: 1, gap: 4 },
  title: { fontSize: 16, includeFontPadding: false },
  description: { fontSize: 14, lineHeight: 21, includeFontPadding: false },
});
