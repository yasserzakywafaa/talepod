import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Text, useTheme, type ButtonProps } from "react-native-paper";

import { useAppLayoutDirection } from "src/components/layout/useAppLayoutDirection";

type AuthSocialButtonProps = Omit<ButtonProps, "icon" | "children"> & {
  icon?: ReactNode;
  children: ReactNode;
  /** When false, button sizes to its label (e.g. phone OTP actions). Default true. */
  fullWidth?: boolean;
};

/** Auth action matching web contained social buttons (custom row layout — Paper icon margins clip in RTL). */
export const AuthSocialButton = ({
  icon,
  children,
  style,
  mode = "contained",
  buttonColor,
  textColor,
  fullWidth = true,
  disabled,
  loading,
  onPress,
  testID,
}: AuthSocialButtonProps) => {
  const theme = useTheme();
  const layoutDirection = useAppLayoutDirection();
  const isOutlined = mode === "outlined";
  const resolvedButtonColor =
    buttonColor ?? (isOutlined ? theme.colors.surface : theme.colors.primary);
  const resolvedTextColor =
    textColor ?? (isOutlined ? theme.colors.onSurface : theme.colors.onPrimary);
  const borderColor = theme.colors.outline;

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        fullWidth ? styles.buttonFullWidth : styles.buttonCompact,
        {
          backgroundColor: resolvedButtonColor,
          borderColor,
        },
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style as StyleProp<ViewStyle>,
      ]}
    >
      <View style={[styles.content, { direction: layoutDirection }]}>
        {loading ? (
          <ActivityIndicator
            color={resolvedTextColor}
            size="small"
            style={styles.leadingSlot}
          />
        ) : icon ? (
          <View style={styles.leadingSlot}>{icon}</View>
        ) : null}
        <Text
          style={[styles.label, { color: resolvedTextColor }]}
          numberOfLines={1}
        >
          {children}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: 8,
    maxWidth: "100%",
  },
  buttonFullWidth: {
    alignSelf: "stretch",
  },
  buttonCompact: {
    alignSelf: "flex-start",
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.55,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  leadingSlot: {
    marginEnd: 10,
  },
  label: {
    flexShrink: 1,
    fontSize: 16,
    textTransform: "none",
  },
});
