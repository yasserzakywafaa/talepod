import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { I18nextProvider } from "react-i18next";

import i18n, { initI18n } from "src/i18n/init";
import { paperLightTheme } from "src/application/paperTheme";

type AppShellProps = {
  children: React.ReactNode;
};

export const I18nAppShell = ({ children }: AppShellProps) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void initI18n().then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={paperLightTheme.colors.primary} size="large" />
      </View>
    );
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: paperLightTheme.colors.background,
  },
});
