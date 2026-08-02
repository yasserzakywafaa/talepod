import type { ReactNode } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
} from "react-native";
import { useTheme } from "react-native-paper";

import { BackToTopButton } from "src/components/brand/BackToTopButton";
import { SafeAreaTopBar } from "src/components/layout/SafeAreaTopBar";
import { useBackToTop } from "src/components/layout/useBackToTop";
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

/**
 * Scrollable body below `Page` header with shared layout gutters. Every page
 * built on this gets back-to-top for free, which is why the button lives here
 * rather than being added screen by screen.
 */
export const PageBody = ({ children }: PageBodyProps) => {
  const theme = useTheme();
  const contentStyle = usePageContentStyle();
  const backToTop = useBackToTop();

  return (
    <LocaleLayoutBoundary>
      <ScrollView
        ref={backToTop.ref as never}
        style={[styles.scroll, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={contentStyle}
        {...PAGE_SCROLL_PROPS}
        {...backToTop.scrollProps}
      >
        {children}
      </ScrollView>
      <BackToTopButton
        visible={backToTop.isVisible}
        onPress={backToTop.scrollToTop}
      />
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
