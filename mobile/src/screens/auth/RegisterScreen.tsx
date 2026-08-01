import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { Text, useTheme } from "react-native-paper";

import { AuthMethodPanel } from "src/features/auth/AuthMethodPanel";
import { mobileRoutes } from "src/application/routes";
import type { RootStackParamList } from "src/application/navigation/types";
import { resetAfterLogin } from "src/application/navigation/rootNavigation";
import { useApplicationContext } from "src/application/store/Provider";
import { useScreenTypography } from "src/components/layout/useScreenTypography";
import type { User } from "src/shared/types/user";

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof mobileRoutes.public.register
>;

export const RegisterScreen = ({ navigation }: Props) => {
  const { t } = useTranslation("auth");
  const { t: tCommon } = useTranslation("common");
  const theme = useTheme();
  const typography = useScreenTypography();
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      navigation.goBack();
      resetAfterLogin(auth.user);
    }
  }, [auth.isAuthenticated, auth.user, navigation]);

  const handleAuthSuccess = (user: User) => {
    resetAfterLogin(user);
  };

  const goToLogin = () => {
    navigation.replace(mobileRoutes.public.login);
  };

  return (
    <AuthMethodPanel
      authType="register"
      onAuthSuccess={handleAuthSuccess}
      footer={
        <View style={styles.footer}>
          <Text
            variant="bodyMedium"
            style={[typography.body, styles.footerText, { color: theme.colors.onSurface }]}
          >
            {t("alreadyHaveAccount")}{" "}
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.primary }}
              onPress={goToLogin}
            >
              {tCommon("nav.login")}
            </Text>
          </Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  footer: {
    marginTop: 8,
    alignItems: "center",
  },
  footerText: {
    textAlign: "center",
  },
});
