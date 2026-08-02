import { StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";

import { navigateToCreateStory } from "src/application/navigation/rootNavigation";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { DisplayText } from "src/components/brand/DisplayText";
import { PillButton } from "src/components/brand/PillButton";
import { Gradient } from "src/components/shared/Gradient";

/** Web `CallToAction` — the twilight closing banner. */
export const CallToActionSection = () => {
  const { t } = useTranslation("page");
  const theme = useAppTheme();
  const { radius, brand, fontFamily } = theme.tokens;

  return (
    <Gradient
      colors={[brand.twilight[500], brand.twilight[600]]}
      bands={24}
      style={[styles.block, { borderRadius: radius.xl }]}
    >
      <DisplayText size={22} color="#FFFFFF" style={styles.center}>
        {t("home.callToAction.title")}
      </DisplayText>
      <Text style={[styles.body, { fontFamily: fontFamily.regular }]}>
        {t("home.callToAction.body")}
      </Text>
      <PillButton onPress={navigateToCreateStory} trailingIcon="arrow-right">
        {t("home.callToAction.cta")}
      </PillButton>
      <Text style={[styles.footnote, { fontFamily: fontFamily.regular }]}>
        {t("home.callToAction.noCreditCard")}
      </Text>
    </Gradient>
  );
};

const styles = StyleSheet.create({
  block: { gap: 12, alignItems: "center", padding: 24 },
  center: { textAlign: "center" },
  body: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    color: "rgba(255,255,255,0.9)",
    includeFontPadding: false,
  },
  footnote: {
    fontSize: 12,
    textAlign: "center",
    color: "rgba(255,255,255,0.75)",
    includeFontPadding: false,
  },
});
