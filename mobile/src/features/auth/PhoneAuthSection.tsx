import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";

import { AuthSocialButton } from "src/features/auth/AuthSocialButton";
import { PhoneOtpAuthForm } from "src/features/auth/PhoneOtpAuthForm";
import type { User } from "src/shared/types/user";

type PhoneAuthSectionProps = {
  authType: "login" | "register";
  disabled?: boolean;
  onSuccess: (user: User) => void;
};

export const PhoneAuthSection = ({
  authType,
  disabled,
  onSuccess,
}: PhoneAuthSectionProps) => {
  const { t } = useTranslation("auth");
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [isWaitingForOtp, setIsWaitingForOtp] = useState(false);

  const label = t("continueWithPhone");

  const toggleExpanded = () => {
    if (expanded && isWaitingForOtp) {
      return;
    }
    setExpanded((current) => !current);
  };

  return (
    <View style={styles.wrap}>
      <AuthSocialButton
        onPress={toggleExpanded}
        disabled={disabled}
        style={expanded ? styles.phoneToggleExpanded : undefined}
        icon={
          <MaterialCommunityIcons name="phone" size={22} color="#000000" />
        }
      >
        {label}
      </AuthSocialButton>

      {expanded ? (
        <View
          style={[
            styles.panel,
            {
              borderColor: theme.colors.primary,
            },
          ]}
        >
          <PhoneOtpAuthForm
            authType={authType}
            onSuccess={onSuccess}
            onWaitingForOtp={setIsWaitingForOtp}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    gap: 0,
  },
  phoneToggleExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  panel: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 12,
    overflow: "hidden",
  },
});
