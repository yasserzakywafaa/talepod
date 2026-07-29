import { useEffect } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AuthMethodScreen } from "src/components/auth/AuthMethodScreen";
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

  return (
    <AuthMethodScreen authType="login" onAuthSuccess={handleAuthSuccess} />
  );
};
