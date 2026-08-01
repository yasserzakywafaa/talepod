import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useAppTheme } from "src/application/theme/useAppTheme";

type AdminEmptyStateProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  message: string;
  /** Usually "Clear filters" — an empty filtered list needs a way back. */
  action?: ReactNode;
};

/** Quiet placeholder for an admin list that came back empty. */
export const AdminEmptyState = ({
  icon,
  message,
  action,
}: AdminEmptyStateProps) => {
  const theme = useAppTheme();

  return (
    <View style={styles.root}>
      <MaterialCommunityIcons
        name={icon}
        size={40}
        color={theme.colors.onSurfaceVariant}
      />
      <Text
        style={[
          styles.message,
          {
            color: theme.colors.onSurfaceVariant,
            fontFamily: theme.tokens.fontFamily.regular,
          },
        ]}
      >
        {message}
      </Text>
      {action}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { alignItems: "center", gap: 12, paddingVertical: 48 },
  message: { fontSize: 14, textAlign: "center", includeFontPadding: false },
});
