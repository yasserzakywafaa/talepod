import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { Accordion } from "src/components/brand/Accordion";
import { MarketingSection } from "src/features/marketing/MarketingSection";
import { asList } from "src/features/marketing/copy";

type FaqItem = { question: string; answer: string };

/** Web `FAQ` + `SafetyFaqAccordions`, as one accordion list. */
export const FaqSection = () => {
  const { t } = useTranslation("page");
  const theme = useAppTheme();
  const [expanded, setExpanded] = useState<string | null>(null);
  const items = asList<FaqItem>(t("home.faq.items", { returnObjects: true }));

  return (
    <MarketingSection title={t("home.faq.title")}>
      {items.map((item) => (
        <Accordion
          key={item.question}
          title={item.question}
          expanded={expanded === item.question}
          onToggle={() =>
            setExpanded((current) =>
              current === item.question ? null : item.question,
            )
          }
        >
          <Text
            style={[
              styles.answer,
              {
                color: theme.colors.onSurfaceVariant,
                fontFamily: theme.tokens.fontFamily.regular,
              },
            ]}
          >
            {item.answer}
          </Text>
        </Accordion>
      ))}
    </MarketingSection>
  );
};

const styles = StyleSheet.create({
  answer: {
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 4,
    includeFontPadding: false,
  },
});
