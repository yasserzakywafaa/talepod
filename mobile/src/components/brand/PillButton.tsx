import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useAppTheme } from "src/application/theme/useAppTheme";

type PillButtonVariant = "contained" | "outlined" | "text";

type PillButtonProps = {
  children: string;
  onPress: () => void;
  variant?: PillButtonVariant;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  /** Trailing sparkle, as on the web "Generate Story ✨" CTA. */
  trailingIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  /** Stretches to the container instead of hugging its label. */
  fullWidth?: boolean;
  compact?: boolean;
  /** Overrides the honey accent — used for destructive actions. */
  color?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * The web V2 call-to-action: a fully-rounded honey pill with white label and a
 * warm drop shadow. `outlined` and `text` cover the secondary actions.
 */
export const PillButton = ({
  children,
  onPress,
  variant = "contained",
  icon,
  trailingIcon,
  disabled = false,
  loading = false,
  fullWidth = false,
  compact = false,
  color,
  style,
}: PillButtonProps) => {
  const theme = useAppTheme();
  const { radius, shadow, fontFamily } = theme.tokens;

  const contained = variant === "contained";
  const outlined = variant === "outlined";

  const accent = color ?? theme.colors.primary;
  const background = contained ? accent : "transparent";
  const foreground = contained ? theme.colors.onPrimary : accent;

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        compact ? styles.compact : styles.regular,
        {
          borderRadius: radius.pill,
          backgroundColor: background,
          borderWidth: outlined ? 1.5 : 0,
          borderColor: accent,
          alignSelf: fullWidth ? "stretch" : "flex-start",
          // Web keeps disabled CTAs honey at 70% rather than greying them out.
          opacity: isDisabled ? 0.6 : pressed ? 0.9 : 1,
        },
        contained && !isDisabled ? shadow.sm : undefined,
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small" color={foreground} />
        ) : icon ? (
          <MaterialCommunityIcons name={icon} size={18} color={foreground} />
        ) : null}
        <Text
          numberOfLines={1}
          style={[
            styles.label,
            {
              color: foreground,
              fontFamily: fontFamily.semiBold,
              fontSize: compact ? 14 : 16,
            },
          ]}
        >
          {children}
        </Text>
        {trailingIcon ? (
          <MaterialCommunityIcons
            name={trailingIcon}
            size={18}
            color={foreground}
          />
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: { alignItems: "center", justifyContent: "center" },
  regular: { paddingVertical: 13, paddingHorizontal: 26 },
  compact: { paddingVertical: 9, paddingHorizontal: 18 },
  content: { flexDirection: "row", alignItems: "center", gap: 8 },
  label: { includeFontPadding: false },
});
