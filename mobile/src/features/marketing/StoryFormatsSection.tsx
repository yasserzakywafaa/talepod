import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { navigateToCreateStory } from "src/application/navigation/rootNavigation";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { BrandBadge } from "src/components/brand/BrandBadge";
import { BrandCard } from "src/components/brand/BrandCard";
import { DisplayText } from "src/components/brand/DisplayText";
import { PillButton } from "src/components/brand/PillButton";
import { FormatPreview } from "src/components/brand/FormatPreview";
import { MarketingSection } from "src/features/marketing/MarketingSection";
import { asObject } from "src/features/marketing/copy";
import { useStoryCreatorContext } from "src/features/storyCreator/store/Provider";
import type { StoryFormat } from "src/features/storyCreator/store/state";

type FormatCopy = {
  badge: string;
  title: string;
  description: string;
  features: string[];
  cta: string;
};

const FORMATS: readonly StoryFormat[] = ["comic", "long"] as const;

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
  const {
    manager: { handleSetFormat },
  } = useStoryCreatorContext();

  /** "Try comic book" lands on the creator with that format already picked. */
  const handleTry = (format: StoryFormat) => () => {
    handleSetFormat(format);
    navigateToCreateStory();
  };

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
          onTry={handleTry(format)}
        />
      ))}
    </MarketingSection>
  );
};

type FormatPanelProps = {
  format: StoryFormat;
  copy: FormatCopy;
  onTry: () => void;
};

const FormatPanel = ({ format, copy, onTry }: FormatPanelProps) => {
  const { t } = useTranslation("page");
  const theme = useAppTheme();
  const { fontFamily } = theme.tokens;

  return (
    <BrandCard style={styles.panel}>
      <FormatPreview
        kind={format}
        pagesLabel={t("home.storyFormats.comicPages")}
        height={140}
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
        onPress={onTry}
        trailingIcon="shimmer"
      >
        {copy.cta}
      </PillButton>
    </BrandCard>
  );
};

const styles = StyleSheet.create({
  panel: { gap: 12, padding: 20 },
  description: { fontSize: 14, lineHeight: 22, includeFontPadding: false },
  features: { gap: 6, width: "100%" },
  feature: { flexDirection: "row", alignItems: "center", gap: 8 },
  featureLabel: { flex: 1, fontSize: 13, includeFontPadding: false },
});
