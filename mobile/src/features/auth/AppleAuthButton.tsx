import { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text, useTheme } from "react-native-paper";

import { getApiErrorMessage } from "src/application/shared/getApiErrorMessage";
import {
  isNativeAppleSignInAvailable,
  signInWithApple,
} from "src/application/auth/signInWithApple";
import { useApplicationContext } from "src/application/store/Provider";
import { AuthSocialButton } from "src/features/auth/AuthSocialButton";

import type { User } from "src/shared/types/user";
import logger from "src/shared/logger";

type AppleAuthButtonProps = {
  authType: "login" | "register";
  disabled?: boolean;
  onSuccess: (user: User) => void;
};

export const AppleAuthButton = ({
  authType,
  disabled,
  onSuccess,
}: AppleAuthButtonProps) => {
  const { t } = useTranslation("auth");
  const theme = useTheme();
  const {
    manager: { handleSetAuthInfo },
  } = useApplicationContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [useNativeButton, setUseNativeButton] = useState(false);

  // Apple's HIG requires their own button when the native sheet is available;
  // everywhere else the browser flow uses the shared social button.
  useEffect(() => {
    let isMounted = true;

    void isNativeAppleSignInAvailable().then((available) => {
      if (isMounted) {
        setUseNativeButton(available);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const label =
    authType === "register" ? t("registerWithApple") : t("loginWithApple");

  const handlePress = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await signInWithApple();
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
      const message = getApiErrorMessage(error, t("errorAppleLoginFailed"));
      if (!String(message).toLowerCase().includes("cancel")) {
        setErrorMessage(message);
      }
      logger.error("Apple sign-in failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.wrap}>
      {useNativeButton ? (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={
            authType === "register"
              ? AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP
              : AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
          }
          buttonStyle={
            theme.dark
              ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
              : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
          }
          cornerRadius={8}
          style={styles.nativeButton}
          onPress={() => {
            void handlePress();
          }}
        />
      ) : (
        <AuthSocialButton
          onPress={handlePress}
          disabled={disabled || isSubmitting}
          loading={isSubmitting}
          buttonColor="#000000"
          textColor="#FFFFFF"
          icon={<MaterialCommunityIcons name="apple" size={22} color="#FFFFFF" />}
        >
          {label}
        </AuthSocialButton>
      )}
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
  nativeButton: {
    // Apple's minimum touch height; the shared button lands on the same size.
    height: Platform.OS === "ios" ? 44 : 0,
    alignSelf: "stretch",
  },
  error: {
    color: "#b00020",
  },
});
