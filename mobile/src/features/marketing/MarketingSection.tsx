import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "src/application/theme/useAppTheme";
import { DisplayText } from "src/components/brand/DisplayText";

type MarketingSectionProps = {
  title: string;
  subtitle?: string;
  /** Small honey overline above the title — the web `overline` treatment. */
  overline?: string;
  children: ReactNode;
};

/**
 * Heading + body wrapper shared by every marketing section, mirroring the
 * web landing page where each `.section` is a centred title, an optional
 * subtitle and the content below.
 */
export const MarketingSection = ({
  title,
  subtitle,
  overline,
  children,
}: MarketingSectionProps) => {
  const theme = useAppTheme();
  const { fontFamily } = theme.tokens;

  return (
    <View style={styles.section}>
      {overline ? (
        <Text
          style={[
            styles.overline,
            { color: theme.colors.primary, fontFamily: fontFamily.semiBold },
          ]}
        >
          {overline.toUpperCase()}
        </Text>
      ) : null}

      <DisplayText size={22} color={theme.colors.primary} style={styles.center}>
        {title}
      </DisplayText>

      {subtitle ? (
        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.onSurfaceVariant,
              fontFamily: fontFamily.regular,
            },
          ]}
        >
          {subtitle}
        </Text>
      ) : null}

      <View style={styles.body}>{children}</View>
    </View>
  );
};

/** Hairline rule the web renders as a 50%-width `<Divider />` between sections. */
export const SectionDivider = () => {
  const theme = useAppTheme();

  return (
    <View
      style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]}
    />
  );
};

const styles = StyleSheet.create({
  section: { gap: 8, paddingTop: 8 },
  center: { textAlign: "center" },
  overline: {
    fontSize: 12,
    letterSpacing: 1.2,
    textAlign: "center",
    includeFontPadding: false,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    includeFontPadding: false,
  },
  body: { gap: 12, paddingTop: 8 },
  divider: {
    width: "50%",
    height: StyleSheet.hairlineWidth,
    alignSelf: "center",
    marginVertical: 12,
  },
});
