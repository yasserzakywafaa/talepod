import { StyleSheet, Text } from "react-native";

import { useAppTheme } from "src/application/theme/useAppTheme";

type SectionLabelProps = {
  children: string;
};

/**
 * Form section heading — web renders these as `body2` at 600 weight in
 * `text.secondary` ("Art style", "Avatar (optional)", …).
 */
export const SectionLabel = ({ children }: SectionLabelProps) => {
  const theme = useAppTheme();

  return (
    <Text
      style={[
        styles.label,
        {
          color: theme.colors.onSurfaceVariant,
          fontFamily: theme.tokens.fontFamily.semiBold,
        },
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: { fontSize: 14, lineHeight: 20, includeFontPadding: false },
});
