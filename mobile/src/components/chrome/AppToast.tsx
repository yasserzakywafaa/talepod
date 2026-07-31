import { StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Portal, Snackbar, Text, useTheme } from "react-native-paper";

import { getFloatingTabBarTotalInset } from "src/components/navigation/floatingTabBarConstants";

export type AppToastVariant = "success" | "error";

type AppToastProps = {
  visible: boolean;
  message: string;
  variant?: AppToastVariant;
  onDismiss: () => void;
  duration?: number;
};

export const AppToast = ({
  visible,
  message,
  variant = "success",
  onDismiss,
  duration = 3500,
}: AppToastProps) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isError = variant === "error";

  const backgroundColor = isError
    ? theme.colors.errorContainer
    : theme.colors.inverseSurface;
  const textColor = isError
    ? theme.colors.onErrorContainer
    : theme.colors.inverseOnSurface;
  const iconName = isError ? "alert-circle-outline" : "check-circle-outline";

  return (
    <Portal>
      <Snackbar
        visible={visible}
        onDismiss={onDismiss}
        duration={duration}
        wrapperStyle={{
          bottom: getFloatingTabBarTotalInset(insets.bottom),
        }}
        style={[styles.snackbar, { backgroundColor }]}
        elevation={4}
      >
        <View style={styles.content}>
          <MaterialCommunityIcons
            name={iconName}
            size={20}
            color={textColor}
          />
          <Text
            variant="bodyMedium"
            style={[styles.message, { color: textColor }]}
          >
            {message}
          </Text>
        </View>
      </Snackbar>
    </Portal>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    marginHorizontal: 16,
    borderRadius: 12,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  message: {
    flex: 1,
  },
});
