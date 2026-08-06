import { useEffect } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { AuthMethodPanel } from "src/features/auth/AuthMethodPanel";
import { AuthSwitchFooter } from "src/features/auth/AuthSwitchFooter";
import { mobileRoutes } from "src/application/routes";
import type { RootStackParamList } from "src/application/navigation/types";
import { resetAfterLogin } from "src/application/navigation/rootNavigation";
import { useApplicationContext } from "src/application/store/Provider";
import type { User } from "src/shared/types/user";

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof mobileRoutes.public.register
>;

export const RegisterScreen = ({ navigation }: Props) => {
  const { t } = useTranslation("auth");
  const { t: tCommon } = useTranslation("common");
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
        <AuthSwitchFooter
          prompt={t("alreadyHaveAccount")}
          actionLabel={tCommon("nav.login")}
          onPress={goToLogin}
        />
      }
    />
  );
};
