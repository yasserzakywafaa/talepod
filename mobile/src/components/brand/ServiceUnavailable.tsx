import { Image, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { DisplayText } from "src/components/brand/DisplayText";
import { PillButton } from "src/components/brand/PillButton";
import type { RequestErrorKind } from "src/shared/api/getRequestErrorKind";

const sleepingBunny = require("../../../assets/images/characters/sleeping_bunny_with_a_moon.webp");

type ServiceUnavailableProps = {
  /** Chooses the wording; the artwork and the way out are the same. */
  kind: RequestErrorKind;
  onRetry: () => void;
  isRetrying?: boolean;
  /** `inline` drops the top padding for use inside an already-titled screen. */
  variant?: "page" | "inline";
};

/**
 * What the app shows when the API cannot be reached.
 *
 * Before this, a dead server left a blank list and a red developer log — the
 * mascot, a sentence in plain language and a Try again button replace both.
 * Deliberately never renders the underlying error: it goes to the console for
 * us, not to the screen.
 */
export const ServiceUnavailable = ({
  kind,
  onRetry,
  isRetrying = false,
  variant = "page",
}: ServiceUnavailableProps) => {
  const { t } = useTranslation("common");
  const theme = useAppTheme();

  const titleKey =
    kind === "offline" ? "serviceError.offlineTitle" : "serviceError.serverTitle";
  const bodyKey =
    kind === "offline" ? "serviceError.offlineBody" : "serviceError.serverBody";

  return (
    <View style={[styles.root, variant === "inline" && styles.inline]}>
      <Image
        source={sleepingBunny}
        style={styles.art}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />

      <DisplayText size={22} style={styles.title}>
        {t(titleKey)}
      </DisplayText>

      <Text
        style={[
          styles.body,
          {
            color: theme.colors.onSurfaceVariant,
            fontFamily: theme.tokens.fontFamily.regular,
          },
        ]}
      >
        {t(bodyKey)}
      </Text>

      <PillButton
        icon="refresh"
        onPress={onRetry}
        loading={isRetrying}
        style={styles.action}
      >
        {t("serviceError.retry")}
      </PillButton>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 24,
    gap: 4,
  },
  inline: { paddingTop: 8, paddingBottom: 24 },
  art: { width: 180, height: 180 },
  title: { textAlign: "center", marginTop: 4 },
  body: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 6,
    includeFontPadding: false,
  },
  action: { marginTop: 20 },
});
