import { ScrollView, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { BrandCard } from "src/components/brand/BrandCard";
import { MarketingSection } from "src/features/marketing/MarketingSection";
import { asList } from "src/features/marketing/copy";

type Example = { title: string; description: string };

const CARD_WIDTH = 240;

/**
 * Web `StoryExamples` — the auto-scrolling carousel, as a swipeable rail.
 * The examples are illustrative copy, not stories from the database, so the
 * cards are title + description only, exactly as on the web. Real stories
 * with real artwork live on the Library screen.
 */
export const StoryExamplesSection = () => {
  const { t } = useTranslation("page");
  const theme = useAppTheme();
  const items = asList<Example>(
    t("home.storyExamples.items", { returnObjects: true }),
  );

  return (
    <MarketingSection title={t("home.storyExamples.title")}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
      >
        {items.map((item) => (
          <BrandCard key={item.title} style={styles.card}>
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
          </BrandCard>
        ))}
      </ScrollView>
    </MarketingSection>
  );
};

const styles = StyleSheet.create({
  rail: { gap: 12, paddingVertical: 4, paddingRight: 4 },
  card: { width: CARD_WIDTH, gap: 10, padding: 16 },
  title: { fontSize: 15, includeFontPadding: false },
  description: { fontSize: 13, lineHeight: 20, includeFontPadding: false },
});
