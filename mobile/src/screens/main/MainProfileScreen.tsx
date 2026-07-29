import { View, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

import { ProfileScreenContent } from "src/features/dashboardProfile/ProfileScreenContent";

export const MainProfileScreen = () => {
  const theme = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <ProfileScreenContent />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
});
