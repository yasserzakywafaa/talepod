import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { navigateToCreateStory } from "src/application/navigation/rootNavigation";
import { useAppTheme } from "src/application/theme/useAppTheme";
import { DisplayText } from "src/components/brand/DisplayText";
import { PillButton } from "src/components/brand/PillButton";
import { Gradient } from "src/components/shared/Gradient";

/** Web `Guarantee` — the honey-filled reassurance block above the final CTA. */
export const GuaranteeSection = () => {
  const { t } = useTranslation("page");
  const theme = useAppTheme();
  const { radius, brand, fontFamily } = theme.tokens;

  return (
    <Gradient
      colors={[brand.honey[300], brand.honey[500]]}
      bands={24}
      style={[styles.block, { borderRadius: radius.xl }]}
    >
      <MaterialCommunityIcons
        name="shield-check-outline"
        size={44}
        color="#FFFFFF"
      />
      <DisplayText size={22} color="#FFFFFF" style={styles.center}>
        {t("home.guarantee.title")}
      </DisplayText>
      <View style={styles.copy}>
        <Text style={[styles.body, { fontFamily: fontFamily.regular }]}>
          {t("home.guarantee.body1")}
        </Text>
        <Text style={[styles.body, { fontFamily: fontFamily.regular }]}>
          {t("home.guarantee.body2")}
        </Text>
      </View>
      <PillButton onPress={navigateToCreateStory} trailingIcon="shimmer">
        {t("home.guarantee.cta")}
      </PillButton>
    </Gradient>
  );
};

const styles = StyleSheet.create({
  block: { gap: 12, alignItems: "center", padding: 24 },
  center: { textAlign: "center" },
  copy: { gap: 6 },
  body: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    color: "rgba(255,255,255,0.92)",
    includeFontPadding: false,
  },
});
