import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  Divider,
  List,
  Text,
  useTheme,
} from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import type { RootStackParamList } from "src/application/navigation/types";
import {
  isOnDashboardRoot,
  navigateToDashboard,
  navigateToMainProfileTab,
  resetToMarketingAfterLogout,
} from "src/application/navigation/rootNavigation";
import { useApplicationContext } from "src/application/store/Provider";
import { getUserProfileContact } from "src/shared/utils/getUserProfileContact";
import { hasAdminRights } from "src/shared/utils/getUserRoles";
import {
  getUserAvatarInitials,
  getUserFullName,
} from "src/shared/utils/getUserDisplayName";
import { SheetBody } from "src/components/layout/SheetPage";

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof mobileRoutes.sheet.account
>;

export const AccountSheetScreen = ({ navigation }: Props) => {
  const { t } = useTranslation("common");
  const theme = useTheme();
  const accountLabel = t("account");
  const {
    store: {
      state: { auth },
    },
    manager: { handleLogout },
  } = useApplicationContext();

  const user = auth.user;
  const dismiss = () => navigation.goBack();

  useEffect(() => {
    if (!user) {
      navigation.goBack();
    }
  }, [navigation, user]);

  const goProfile = () => {
    dismiss();
    navigateToMainProfileTab();
  };

  const goDashboard = () => {
    dismiss();
    navigateToDashboard(mobileRoutes.dashboard.overview);
  };

  if (!user) {
    return null;
  }

  const profileContact = getUserProfileContact(user);
  const initials = getUserAvatarInitials(user);
  const showDashboardLink = hasAdminRights(user) && !isOnDashboardRoot();

  const onLogout = async () => {
    dismiss();
    await handleLogout();
    resetToMarketingAfterLogout();
  };

  return (
    <SheetBody>
        <View style={styles.sheetHeader}>
          {user.picture ? (
            <Avatar.Image size={56} source={{ uri: user.picture }} />
          ) : initials ? (
            <Avatar.Text
              size={56}
              label={initials}
              style={{ backgroundColor: theme.colors.surfaceVariant }}
            />
          ) : (
            <Avatar.Icon
              size={56}
              icon="account-outline"
              style={{ backgroundColor: theme.colors.surfaceVariant }}
              color={theme.colors.onSurfaceVariant}
            />
          )}
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.onSurface, marginTop: 12 }}
          >
            {getUserFullName(user, accountLabel)}
          </Text>
          {profileContact.value ? (
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
            >
              {profileContact.value}
            </Text>
          ) : null}
        </View>

        <Divider style={styles.divider} />

        <List.Item
          title={t("settings.profile")}
          onPress={goProfile}
          left={(props) => <List.Icon {...props} icon="account-outline" />}
          titleStyle={{ color: theme.colors.onSurface }}
        />

        {showDashboardLink ? (
          <>
            <Divider style={styles.divider} />
            <List.Item
              title={t("settings.dashboard")}
              onPress={goDashboard}
              left={(props) => <List.Icon {...props} icon="view-dashboard" />}
              titleStyle={{ color: theme.colors.onSurface }}
            />
          </>
        ) : null}

        <Divider style={styles.divider} />

        <List.Item
          title={t("settings.logout")}
          onPress={() => void onLogout()}
          left={(props) => <List.Icon {...props} icon="logout" color="#ff6b6b" />}
          titleStyle={{ color: theme.colors.error }}
        />
    </SheetBody>
  );
};

const styles = StyleSheet.create({
  sheetHeader: {
    alignItems: "center",
  },
  divider: {
    marginVertical: 4,
  },
});
