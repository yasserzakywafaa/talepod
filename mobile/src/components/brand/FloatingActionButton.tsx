import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useAppTheme } from "src/application/theme/useAppTheme";

type FloatingActionButtonProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
  accessibilityLabel: string;
  /** Fades and scales out when false, rather than popping out of the tree. */
  visible?: boolean;
  /** Distance from the bottom of the screen, stacked by the caller. */
  bottom: number;
};

/** Round honey FAB — the native read of the web's `<Fab color="primary">`. */
export const FloatingActionButton = ({
  icon,
  onPress,
  accessibilityLabel,
  visible = true,
  bottom,
}: FloatingActionButtonProps) => {
  const theme = useAppTheme();
  const anim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [visible, anim]);

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[
        styles.wrap,
        { bottom, opacity: anim, transform: [{ scale: anim }] },
      ]}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: theme.colors.primary,
            opacity: pressed ? 0.85 : 1,
            ...theme.tokens.shadow.md,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={theme.colors.onPrimary}
        />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: { position: "absolute", right: 16, zIndex: 20 },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
