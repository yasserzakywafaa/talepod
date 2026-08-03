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
  typeof mobileRoutes.public.login
>;

export const LoginScreen = ({ navigation }: Props) => {
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

  const goToRegister = () => {
    navigation.replace(mobileRoutes.public.register);
  };

  return (
    <AuthMethodPanel
      authType="login"
      onAuthSuccess={handleAuthSuccess}
      footer={
        <AuthSwitchFooter
          prompt={t("noAccountYet")}
          actionLabel={tCommon("nav.register")}
          onPress={goToRegister}
        />
      }
    />
  );
};
