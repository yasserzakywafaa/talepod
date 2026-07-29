import { StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import type { RootStackParamList } from "src/application/navigation/types";
import { SafeAreaTopBar } from "src/components/layout/SafeAreaTopBar";
import { AppButton } from "src/components/paper/AppButton";
import { ProfileScreenContent } from "src/features/dashboardProfile/ProfileScreenContent";

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof mobileRoutes.authenticated.myProfile
>;

export const MyProfileScreen = ({ navigation }: Props) => {
  const { t } = useTranslation("common");
  const theme = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <SafeAreaTopBar>
        <View style={styles.topBar}>
          <AppButton mode="text" onPress={() => navigation.goBack()}>
            {t("back")}
          </AppButton>
        </View>
      </SafeAreaTopBar>
      <ProfileScreenContent />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: { paddingHorizontal: 8 },
});
