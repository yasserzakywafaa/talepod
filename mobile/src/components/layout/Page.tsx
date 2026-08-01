import type { ReactNode } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
} from "react-native";
import { useTheme } from "react-native-paper";

import { SafeAreaTopBar } from "src/components/layout/SafeAreaTopBar";
import { useReadableLayout } from "src/components/layout/useReadableLayout";
import { LocaleLayoutBoundary } from "src/components/layout/LocaleLayoutBoundary";

/** Scroll/list props for content inside `Page` (no extra top inset; `Page` owns safe area). */
export const PAGE_SCROLL_PROPS = {
  contentInsetAdjustmentBehavior: "never",
  automaticallyAdjustContentInsets: false,
  keyboardShouldPersistTaps: "handled",
  showsVerticalScrollIndicator: false,
} as const satisfies Partial<ScrollViewProps>;

const usePageContentStyle = () => {
  const { horizontalGutter, contentMaxWidth } = useReadableLayout();
  return {
    paddingHorizontal: horizontalGutter,
    paddingTop: 0,
    paddingBottom: horizontalGutter,
    gap: 16,
    width: "100%" as const,
    maxWidth: contentMaxWidth,
    alignSelf: "center" as const,
  };
};

export type PageProps = {
  header?: ReactNode;
  children: ReactNode;
};

export const Page = ({ header, children }: PageProps) => {
  const theme = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <SafeAreaTopBar>{header}</SafeAreaTopBar>
      <View style={styles.body}>{children}</View>
    </View>
  );
};

type PageBodyProps = {
  children: ReactNode;
};

/** Scrollable body below `Page` header with shared layout gutters. */
export const PageBody = ({ children }: PageBodyProps) => {
  const theme = useTheme();
  const contentStyle = usePageContentStyle();

  return (
    <LocaleLayoutBoundary>
      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={contentStyle}
        {...PAGE_SCROLL_PROPS}
      >
        {children}
      </ScrollView>
    </LocaleLayoutBoundary>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
});
