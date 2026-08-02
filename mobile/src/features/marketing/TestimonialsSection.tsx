import { ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { BrandCard } from "src/components/brand/BrandCard";
import { MarketingSection } from "src/features/marketing/MarketingSection";
import { asList } from "src/features/marketing/copy";

type Testimonial = { name: string; title: string; text: string };

const CARD_WIDTH = 260;

/** Web `Testimonials` — "What Parents Are Saying", as a swipeable rail. */
export const TestimonialsSection = () => {
  const { t } = useTranslation("page");
  const theme = useAppTheme();
  const items = asList<Testimonial>(
    t("home.testimonials.items", { returnObjects: true }),
  );

  return (
    <MarketingSection title={t("home.testimonials.title")}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
      >
        {items.map((item) => (
          <BrandCard key={item.name} style={styles.card}>
            <View style={styles.person}>
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: theme.tokens.semantic.primarySoft },
                ]}
              >
                <MaterialCommunityIcons
                  name="account"
                  size={20}
                  color={theme.tokens.semantic.onPrimarySoft}
                />
              </View>
              <View style={styles.personCopy}>
                <Text
                  style={[
                    styles.name,
                    {
                      color: theme.colors.onSurface,
                      fontFamily: theme.tokens.fontFamily.semiBold,
                    },
                  ]}
                >
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.role,
                    {
                      color: theme.colors.onSurfaceVariant,
                      fontFamily: theme.tokens.fontFamily.regular,
                    },
                  ]}
                >
                  {item.title}
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.text,
                {
                  color: theme.colors.onSurfaceVariant,
                  fontFamily: theme.tokens.fontFamily.regular,
                },
              ]}
            >
              {item.text}
            </Text>
          </BrandCard>
        ))}
      </ScrollView>
    </MarketingSection>
  );
};

const styles = StyleSheet.create({
  rail: { gap: 12, paddingVertical: 4, paddingRight: 4 },
  card: { width: CARD_WIDTH, gap: 12, padding: 18 },
  person: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  personCopy: { flex: 1 },
  name: { fontSize: 14, includeFontPadding: false },
  role: { fontSize: 12, includeFontPadding: false },
  text: { fontSize: 13, lineHeight: 20, includeFontPadding: false },
});
