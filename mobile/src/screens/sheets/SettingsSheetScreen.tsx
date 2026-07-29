import { DevSettings, ScrollView, StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { Divider, List, Text, useTheme } from "react-native-paper";
import {
  LanguageSwitcher,
  ThemeSwitcher,
} from "@yasserzakywafaa/client-core/native";
import * as Updates from "expo-updates";

import { mobileRoutes } from "src/application/routes";
import type { RootStackParamList } from "src/application/navigation/types";
import { useApplicationContext } from "src/application/store/Provider";

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof mobileRoutes.sheet.settings
>;

export const SettingsSheetScreen = ({ navigation }: Props) => {
  const { t, i18n } = useTranslation("common");
  const theme = useTheme();
  const {
    store: {
      state: { themePreference },
    },
    manager: { handleThemePreferenceChange, handleLanguageChange },
  } = useApplicationContext();

  const dismiss = () => navigation.goBack();

  const handleRefresh = async () => {
    dismiss();
    try {
      if (!__DEV__ && Updates.isEnabled) {
        await Updates.reloadAsync();
        return;
      }
    } catch (error) {
      console.warn(
        "expo-updates reload failed, falling back to DevSettings:",
        error,
      );
    }

    if (typeof DevSettings.reload === "function") {
      DevSettings.reload();
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text
        variant="titleMedium"
        style={[styles.title, { color: theme.colors.onSurface }]}
      >
        {t("settings.menu")}
      </Text>

      <View style={styles.settingBlock}>
        <Text
          variant="bodyLarge"
          style={[styles.settingLabel, { color: theme.colors.onSurface }]}
        >
          {t("settings.languageLabel")}
        </Text>
        <LanguageSwitcher
          value={i18n.language}
          onChange={(lang) => void handleLanguageChange(lang)}
        />
      </View>

      <Divider style={styles.divider} />

      <View style={styles.settingRow}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
          {t("settings.theme")}
        </Text>
        <ThemeSwitcher
          value={themePreference}
          onChange={(preference) =>
            void handleThemePreferenceChange(preference)
          }
        />
      </View>

      <Divider style={styles.divider} />

      <List.Item
        title={t("settings.refreshApp")}
        onPress={() => void handleRefresh()}
        left={(props) => <List.Icon {...props} icon="refresh" />}
        titleStyle={{ color: theme.colors.onSurface }}
      />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
  title: {
    textAlign: "center",
    fontWeight: "600",
    marginVertical: 16,
  },
  divider: {
    marginVertical: 8,
  },
  settingBlock: {
    paddingHorizontal: 16,
    gap: 10,
  },
  settingLabel: {
    alignSelf: "flex-start",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 48,
    gap: 12,
  },
});
