import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

import { useScreenTypography } from "src/components/layout/useScreenTypography";

type AuthSwitchFooterProps = {
  /** e.g. "Already have an account?" */
  prompt: string;
  /** The inline link, e.g. "Log in". */
  actionLabel: string;
  onPress: () => void;
};

/**
 * The line that sends someone to the other auth sheet.
 *
 * Shared so login and register stay a matched pair — the login sheet had no way
 * out to register at all, which left new users stuck on it.
 */
export const AuthSwitchFooter = ({
  prompt,
  actionLabel,
  onPress,
}: AuthSwitchFooterProps) => {
  const theme = useTheme();
  const typography = useScreenTypography();

  return (
    <View style={styles.footer}>
      <Text
        variant="bodyMedium"
        style={[
          typography.body,
          styles.footerText,
          { color: theme.colors.onSurface },
        ]}
      >
        {prompt}{" "}
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.primary }}
          onPress={onPress}
        >
          {actionLabel}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    marginTop: 8,
    alignItems: "center",
  },
  footerText: {
    textAlign: "center",
  },
});
