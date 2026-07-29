import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Portal } from "react-native-paper";

import { useAppLayoutDirection } from "src/components/layout/useAppLayoutDirection";

type LocalePortalBoundaryProps = {
  children: ReactNode;
};

/** Locale `direction` for Paper portaled UI (dialogs, etc.). Prefer over raw `Portal`. */
export const LocalePortalBoundary = ({ children }: LocalePortalBoundaryProps) => {
  const layoutDirection = useAppLayoutDirection();

  return (
    <Portal>
      <View
        collapsable={false}
        pointerEvents="box-none"
        style={[styles.fill, { direction: layoutDirection }]}
      >
        {children}
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  fill: StyleSheet.absoluteFillObject,
});
