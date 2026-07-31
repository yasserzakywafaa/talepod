import { useCallback } from "react";
import {
  ActionSheetIOS,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { TextInput } from "react-native-paper";

type Option = {
  value: string;
  label: string;
};

type AuthSelectFieldProps = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  inputProps?: Record<string, unknown>;
};

/**
 * Platform-native pickers (no Paper Menu / custom modal — those break or feel heavy in form sheets).
 * iOS: UIActionSheet · Android: Alert dialog list.
 */
export const AuthSelectField = ({
  label,
  value,
  options,
  onChange,
  disabled,
  required,
  inputProps = {},
}: AuthSelectFieldProps) => {
  const { t } = useTranslation("common");

  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? "";

  const displayLabel = required ? `${label} *` : label;
  const cancelLabel = t("sheetClose");

  const openPicker = useCallback(() => {
    if (disabled || options.length === 0) {
      return;
    }

    if (Platform.OS === "ios") {
      const optionLabels = options.map((option) => option.label);
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: label,
          options: [...optionLabels, cancelLabel],
          cancelButtonIndex: options.length,
        },
        (buttonIndex) => {
          if (buttonIndex >= 0 && buttonIndex < options.length) {
            onChange(options[buttonIndex].value);
          }
        },
      );
      return;
    }

    Alert.alert(
      label,
      undefined,
      [
        ...options.map((option) => ({
          text: option.label,
          onPress: () => onChange(option.value),
        })),
        { text: cancelLabel, style: "cancel" },
      ],
      { cancelable: true },
    );
  }, [cancelLabel, disabled, label, onChange, options]);

  const anchorField = (
    <TextInput
      mode="outlined"
      label={displayLabel}
      value={selectedLabel}
      editable={false}
      showSoftInputOnFocus={false}
      caretHidden
      pointerEvents="none"
      right={
        <TextInput.Icon
          icon="menu-down"
          onPress={openPicker}
          forceTextInputFocus={false}
        />
      }
      {...inputProps}
    />
  );

  return (
    <View>
      {Platform.OS === "ios" ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={openPicker}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={displayLabel}
          style={styles.anchor}
        >
          {anchorField}
        </TouchableOpacity>
      ) : (
        <Pressable
          onPress={openPicker}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={displayLabel}
          style={styles.anchor}
        >
          {anchorField}
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  anchor: {
    alignSelf: "stretch",
  },
});
