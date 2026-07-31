import { StyleSheet, Text, type StyleProp, type TextStyle } from "react-native";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { lineHeight } from "src/application/theme/tokens";

type DisplayTextProps = {
  children: React.ReactNode;
  /** Matches web `--fs-*`: h1 38 · h2 30 · h3 24 · h4 20 · h5 18 · h6 14. */
  size?: number;
  color?: string;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
};

/**
 * Yeseva One display type — the web's `--font-display`. Used for page
 * headings, card titles and anything the web renders in the serif face.
 */
export const DisplayText = ({
  children,
  size = 24,
  color,
  numberOfLines,
  style,
}: DisplayTextProps) => {
  const theme = useAppTheme();

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        styles.text,
        {
          fontFamily: theme.tokens.fontFamily.display,
          fontSize: size,
          lineHeight: size * lineHeight.tight,
          color: color ?? theme.colors.onSurface,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  // Yeseva One has generous ascenders; `includeFontPadding` off keeps the
  // optical baseline aligned with the Lexend body copy next to it.
  text: { includeFontPadding: false },
});
