import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text } from "react-native-paper";

import { getApiErrorMessage } from "src/application/shared/getApiErrorMessage";
import { signInWithGoogleBrowser } from "src/application/auth/googleSignInBrowser";
import { useApplicationContext } from "src/application/store/Provider";
import { AuthSocialButton } from "src/components/auth/AuthSocialButton";

import type { User } from "src/shared/types/user";

type GoogleAuthButtonProps = {
  authType: "login" | "register";
  disabled?: boolean;
  onSuccess: (user: User) => void;
};

export const GoogleAuthButton = ({
  authType,
  disabled,
  onSuccess,
}: GoogleAuthButtonProps) => {
  const { t } = useTranslation("auth");
  const {
    manager: { handleSetAuthInfo },
  } = useApplicationContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const label =
    authType === "register" ? t("registerWithGoogle") : t("loginWithGoogle");

  const handlePress = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await signInWithGoogleBrowser();
      if (!result) {
        return;
      }

      const { user, accessToken, refreshToken } = result;
      await handleSetAuthInfo(
        { isAuthenticated: true, user },
        { accessToken, refreshToken },
      );
      onSuccess(user);
    } catch (error) {
      const message = getApiErrorMessage(error, t("errorGoogleLoginFailed"));
      if (!String(message).toLowerCase().includes("cancel")) {
        setErrorMessage(message);
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <AuthSocialButton
        onPress={handlePress}
        disabled={disabled || isSubmitting}
        loading={isSubmitting}
        icon={
          <MaterialCommunityIcons name="google" size={22} color="#000000" />
        }
      >
        {label}
      </AuthSocialButton>
      {errorMessage ? (
        <Text variant="bodySmall" style={styles.error}>
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  error: {
    color: "#b00020",
  },
});
