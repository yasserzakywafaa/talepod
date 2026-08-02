import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { navigateToCreateStory } from "src/application/navigation/rootNavigation";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { BrandBadge } from "src/components/brand/BrandBadge";
import { BrandCard } from "src/components/brand/BrandCard";
import { DisplayText } from "src/components/brand/DisplayText";
import { PillButton } from "src/components/brand/PillButton";
import { Gradient } from "src/components/shared/Gradient";
import { MarketingSection } from "src/features/marketing/MarketingSection";
import { asObject } from "src/features/marketing/copy";

type FormatCopy = {
  badge: string;
  title: string;
  description: string;
  features: string[];
  cta: string;
};

const FORMATS = ["comic", "long"] as const;

const EMPTY_FORMAT: FormatCopy = {
  badge: "",
  title: "",
  description: "",
  features: [],
  cta: "",
};

/** Web `StoryFormats` — comic book vs. long story, one panel each. */
export const StoryFormatsSection = () => {
  const { t } = useTranslation("page");

  return (
    <MarketingSection
      overline={t("home.storyFormats.overline")}
      title={t("home.storyFormats.title")}
      subtitle={t("home.storyFormats.subtitle")}
    >
      {FORMATS.map((format) => (
        <FormatPanel
          key={format}
          format={format}
          copy={asObject<FormatCopy>(
            t(`home.storyFormats.${format}`, { returnObjects: true }),
            EMPTY_FORMAT,
          )}
        />
      ))}
    </MarketingSection>
  );
};

type FormatPanelProps = {
  format: (typeof FORMATS)[number];
  copy: FormatCopy;
};

const FormatPanel = ({ format, copy }: FormatPanelProps) => {
  const theme = useAppTheme();
  const { gradients, radius, fontFamily } = theme.tokens;

  return (
    <BrandCard style={styles.panel}>
      <Gradient
        colors={format === "comic" ? gradients.scene : gradients.cover}
        bands={24}
        style={[styles.preview, { borderRadius: radius.md }]}
      />

      <BrandBadge label={copy.badge} />

      <DisplayText size={20}>{copy.title}</DisplayText>

      <Text
        style={[
          styles.description,
          {
            color: theme.colors.onSurfaceVariant,
            fontFamily: fontFamily.regular,
          },
        ]}
      >
        {copy.description}
      </Text>

      <View style={styles.features}>
        {copy.features.map((feature) => (
          <View key={feature} style={styles.feature}>
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={16}
              color={theme.colors.primary}
            />
            <Text
              style={[
                styles.featureLabel,
                {
                  color: theme.colors.onSurfaceVariant,
                  fontFamily: fontFamily.regular,
                },
              ]}
            >
              {feature}
            </Text>
          </View>
        ))}
      </View>

      <PillButton
        variant="outlined"
        fullWidth
        onPress={navigateToCreateStory}
        trailingIcon="shimmer"
      >
        {copy.cta}
      </PillButton>
    </BrandCard>
  );
};

const styles = StyleSheet.create({
  panel: { gap: 12, padding: 20, alignItems: "flex-start" },
  preview: { height: 120, width: "100%" },
  description: { fontSize: 14, lineHeight: 22, includeFontPadding: false },
  features: { gap: 6, width: "100%" },
  feature: { flexDirection: "row", alignItems: "center", gap: 8 },
  featureLabel: { flex: 1, fontSize: 13, includeFontPadding: false },
});
