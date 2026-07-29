import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { useAppLayoutDirection } from "src/components/layout/useAppLayoutDirection";

type LocaleLayoutBoundaryProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** When false, omit flex:1 (e.g. bottom sheets). Default true for screens. */
  fill?: boolean;
};

/** Locale `direction` for in-tree screens and drawers (navigation stays LTR). */
export const LocaleLayoutBoundary = ({
  children,
  style,
  fill = true,
}: LocaleLayoutBoundaryProps) => {
  const layoutDirection = useAppLayoutDirection();

  return (
    <View
      style={[fill && styles.fill, { direction: layoutDirection }, style]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    alignSelf: "stretch",
  },
});
