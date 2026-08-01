import type { ReactNode } from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type SafeAreaTopBarProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Safe-area inset for headers and standalone top bars.
 *
 * Includes the side edges, not just the top: held sideways the notch sits on
 * one long edge, and a menu button pinned to that edge would sit under it.
 */
export const SafeAreaTopBar = ({ children, style }: SafeAreaTopBarProps) => {
  const theme = useTheme();

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[
        styles.bar,
        { backgroundColor: theme.colors.background },
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bar: {
    width: "100%",
  },
});
