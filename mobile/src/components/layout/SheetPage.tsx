import type { ReactNode } from "react";
import { Platform, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

import { LocaleLayoutBoundary } from "src/components/layout/LocaleLayoutBoundary";
import { useSheetContentStyle } from "src/components/layout/sheetLayout";

type AuthScreenBodyProps = {
  children: ReactNode;
};

/**
 * Login/register form sheets — matches legacy PageScaffold AuthScreenBody.
 * Scroll when content is tall; keep layout flat (no flexGrow / KAV) so iOS form
 * sheets stay tappable and swipeable.
 */
export const AuthScreenBody = ({ children }: AuthScreenBodyProps) => {
  const theme = useTheme();
  const contentStyle = useSheetContentStyle();

  return (
    <LocaleLayoutBoundary>
      <ScrollView
        style={[styles.authScroll, { backgroundColor: theme.colors.background }]}
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

type SheetBodyProps = {
  children: ReactNode;
};

/**
 * Settings/account form sheets — plain ScrollView root (no flex:1 wrapper).
 * Do not add LocaleLayoutBoundary or PAGE_SCROLL_PROPS here; those break iOS taps.
 */
export const SheetBody = ({ children }: SheetBodyProps) => {
  const theme = useTheme();
  const contentStyle = useSheetContentStyle();

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={contentStyle}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  authScroll: {
    flex: 1,
  },
});
