import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Text, useTheme } from "react-native-paper";

import { getApiErrorMessage } from "src/application/shared/getApiErrorMessage";
import { signInWithApple } from "src/application/auth/signInWithApple";
import { useApplicationContext } from "src/application/store/Provider";
import { AppleLogo } from "src/features/auth/AppleLogo";
import { AuthSocialButton } from "src/features/auth/AuthSocialButton";

import type { User } from "src/shared/types/user";
import { logger } from "src/shared/logger";

type AppleAuthButtonProps = {
  authType: "login" | "register";
  disabled?: boolean;
  onSuccess: (user: User) => void;
};

export const AppleAuthButton = ({
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

  // Apple's HIG allows a custom button — own font, layout, radius and size — but
  // fixes two things: the title must be one of Apple's approved strings, and the
  // mark and title must be black or white, never a brand colour. "Continue with
  // Apple" is the approved title that works on both the login and register
  // sheets without contradicting the app's login/register wording.
  const buttonColor = theme.dark ? "#FFFFFF" : "#000000";
  const contentColor = theme.dark ? "#000000" : "#FFFFFF";

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
      <AuthSocialButton
        onPress={handlePress}
        disabled={disabled || isSubmitting}
        loading={isSubmitting}
        buttonColor={buttonColor}
        textColor={contentColor}
        icon={<AppleLogo color={contentColor} />}
      >
        {t("continueWithApple")}
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
