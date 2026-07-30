import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Icon, Text, useTheme } from "react-native-paper";

import { GoogleAuthButton } from "src/components/auth/GoogleAuthButton";
import { PhoneAuthSection } from "src/components/auth/PhoneAuthSection";
import { AuthScreenBody } from "src/components/layout/SheetPage";
import { useScreenTypography } from "src/components/layout/useScreenTypography";
import type { User } from "src/shared/types/user";

type AuthMethodScreenProps = {
  authType: "login" | "register";
  onAuthSuccess: (user: User) => void;
  footer?: ReactNode;
};

export const AuthMethodScreen = ({
  authType,
  onAuthSuccess,
  footer,
}: AuthMethodScreenProps) => {
  const { t } = useTranslation("auth");
  const theme = useTheme();
  const typography = useScreenTypography();

  const isRegister = authType === "register";
  const heading = isRegister ? t("registerHeading") : t("loginHeading");
  const headerIcon = isRegister ? "account-plus-outline" : "login";

  return (
    <AuthScreenBody>
        <View style={styles.header}>
          <Icon
            source={headerIcon}
            size={32}
            color={theme.colors.primary}
          />
          <Text
            variant="headlineSmall"
            style={[typography.title, styles.heading]}
          >
            {heading}
          </Text>
        </View>

        <View style={styles.methods}>
          <GoogleAuthButton authType={authType} onSuccess={onAuthSuccess} />
          <PhoneAuthSection authType={authType} onSuccess={onAuthSuccess} />
        </View>

        {footer}
    </AuthScreenBody>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  heading: {
    textAlign: "center",
  },
  methods: {
    gap: 16,
    alignSelf: "stretch",
  },
});
