import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Divider, List, Text, useTheme } from "react-native-paper";
import {
  LanguageSwitcher,
  ThemeSwitcher,
} from "@yasserzakywafaa/client-core/native";
import * as Updates from "expo-updates";
import { DevSettings } from "react-native";

import { mobileRoutes, type PublicMarketingScreenRoute } from "src/application/routes";
import { navigateToPublicMarketingScreen } from "src/application/navigation/rootNavigation";
import type { RootStackParamList } from "src/application/navigation/types";
import { useApplicationContext } from "src/application/store/Provider";
import { getAppVersionLabel } from "src/application/shared/getAppVersionLabel";
import { SheetBody } from "src/components/layout/SheetPage";
import logger from "src/shared/logger";

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

  const appVersion = getAppVersionLabel();

  const dismiss = () => navigation.goBack();

  const openPublicPage = (screen: PublicMarketingScreenRoute) => {
    dismiss();
    navigateToPublicMarketingScreen(screen);
  };

  const handleRefresh = async () => {
    dismiss();
    try {
      if (Updates.isEnabled) {
        const check = await Updates.checkForUpdateAsync();
        if (check.isAvailable) {
          await Updates.fetchUpdateAsync();
        }
        await Updates.reloadAsync();
        return;
      }
    } catch (error) {
      logger.warn("Refresh app via expo-updates failed", error);
    }

    if (typeof DevSettings.reload === "function") {
      DevSettings.reload();
    }
  };

  return (
    <SheetBody>
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

        <Divider style={styles.divider} />

        <List.Item
          title={t("footer.privacyPolicy")}
          onPress={() => openPublicPage(mobileRoutes.public.privacyPolicy)}
          left={(props) => <List.Icon {...props} icon="shield-lock-outline" />}
          titleStyle={{ color: theme.colors.onSurface }}
        />
        <List.Item
          title={t("footer.termsAndConditions")}
          onPress={() => openPublicPage(mobileRoutes.public.termsAndConditions)}
          left={(props) => <List.Icon {...props} icon="file-document-outline" />}
          titleStyle={{ color: theme.colors.onSurface }}
        />
        <List.Item
          title={t("nav.contact")}
          onPress={() => openPublicPage(mobileRoutes.public.contact)}
          left={(props) => <List.Icon {...props} icon="email-outline" />}
          titleStyle={{ color: theme.colors.onSurface }}
        />

        <Text
          variant="bodySmall"
          style={[styles.version, { color: theme.colors.onSurfaceVariant }]}
        >
          {t("settings.version", { version: appVersion })}
        </Text>
    </SheetBody>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontWeight: "600",
  },
  divider: {
    marginVertical: 4,
  },
  settingBlock: {
    gap: 10,
  },
  settingLabel: {
    alignSelf: "flex-start",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 48,
    gap: 12,
  },
  version: {
    textAlign: "center",
    marginTop: 8,
  },
});
