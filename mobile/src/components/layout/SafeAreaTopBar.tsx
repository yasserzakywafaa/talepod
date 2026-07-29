import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SafeAreaTopBarProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Applies top safe-area inset (notch / Dynamic Island / status bar). */
export const SafeAreaTopBar = ({ children, style }: SafeAreaTopBarProps) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View
      style={[
        styles.bar,
        {
          paddingTop: insets.top,
          backgroundColor: theme.colors.background,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    width: "100%",
  },
});
