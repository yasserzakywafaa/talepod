import type { ReactNode } from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type SafeAreaTopBarProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Top safe-area inset (notch / Dynamic Island / status bar) for headers and standalone top bars. */
export const SafeAreaTopBar = ({ children, style }: SafeAreaTopBarProps) => {
  const theme = useTheme();

  return (
    <SafeAreaView
      edges={["top"]}
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
