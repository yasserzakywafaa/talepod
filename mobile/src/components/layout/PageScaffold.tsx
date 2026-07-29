import type { ReactNode } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Divider, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useReadableLayout } from "src/components/layout/useReadableLayout";
import { LocaleLayoutBoundary } from "src/components/layout/LocaleLayoutBoundary";

const usePageContentStyle = () => {
  const { horizontalGutter, contentMaxWidth } = useReadableLayout();
  return {
    paddingHorizontal: horizontalGutter,
    paddingTop: 8,
    paddingBottom: horizontalGutter,
    gap: 16,
    width: "100%" as const,
    maxWidth: contentMaxWidth,
    alignSelf: "center" as const,
  };
};

export const PageFooter = () => {
  const { t } = useTranslation("common");
  const theme = useTheme();
  const year = new Date().getFullYear();

  return (
    <View style={styles.footer}>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
        {t("footer.mobileTagline")}
      </Text>
      <Divider
        style={[styles.divider, { backgroundColor: theme.colors.outline }]}
      />
      <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
        {t("footer.linksLine", {
          product: t("footer.product"),
          company: t("footer.company"),
          privacy: t("footer.privacyPolicy"),
          terms: t("footer.termsAndConditions"),
        })}
      </Text>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
        {t("footer.copyright")} {year}
      </Text>
    </View>
  );
};

type MarketingScreenBodyProps = {
  children: ReactNode;
};

export const MarketingScreenBody = ({ children }: MarketingScreenBodyProps) => {
  const theme = useTheme();
  const contentStyle = usePageContentStyle();

  return (
    <LocaleLayoutBoundary>
      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={contentStyle}
        keyboardShouldPersistTaps="handled"
      >
        {children}
        <PageFooter />
      </ScrollView>
    </LocaleLayoutBoundary>
  );
};

type AuthScreenBodyProps = {
  children: ReactNode;
};

/**
 * Login/register form sheets: scroll when content is tall (phone register).
 * Keep layout flat (no flexGrow / KAV) so iOS form sheets stay tappable and swipeable.
 */
export const AuthScreenBody = ({ children }: AuthScreenBodyProps) => {
  const theme = useTheme();
  const contentStyle = usePageContentStyle();

  return (
    <LocaleLayoutBoundary>
      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={contentStyle}
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
      >
        {children}
      </ScrollView>
    </LocaleLayoutBoundary>
  );
};

type DashboardScreenBodyProps = {
  children: ReactNode;
};

export const DashboardScreenBody = ({ children }: DashboardScreenBodyProps) => {
  const theme = useTheme();
  const contentStyle = usePageContentStyle();
  const insets = useSafeAreaInsets();

  return (
    <LocaleLayoutBoundary>
      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={[
          contentStyle,
          styles.dashboardContent,
          { paddingBottom: contentStyle.paddingBottom + insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </LocaleLayoutBoundary>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  dashboardContent: {
    flexGrow: 1,
  },
  footer: {
    marginTop: 24,
    gap: 8,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "transparent",
  },
  divider: {
    marginVertical: 8,
  },
});
