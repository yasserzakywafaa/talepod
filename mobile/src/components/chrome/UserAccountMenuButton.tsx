import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";

import { mobileRoutes } from "src/application/routes";
import { openRootSheet } from "src/application/navigation/rootNavigation";
import type { User } from "src/shared/types/user";
import {
  getUserAvatarInitials,
  getUserDisplayName,
} from "src/shared/utils/getUserDisplayName";

type UserAccountMenuButtonProps = {
  user: User;
};

export const UserAccountMenuButton = ({ user }: UserAccountMenuButtonProps) => {
  const { t } = useTranslation("common");
  const theme = useTheme();
  const accountLabel = t("account");
  const initials = getUserAvatarInitials(user);
  const label = getUserDisplayName(user, accountLabel);

  return (
    <TouchableRipple
      onPress={() => openRootSheet(mobileRoutes.sheet.account)}
      style={styles.anchor}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.row}>
        {user.picture ? (
          <Avatar.Image size={28} source={{ uri: user.picture }} />
        ) : initials ? (
          <Avatar.Text
            size={28}
            label={initials}
            style={{ backgroundColor: theme.colors.surfaceVariant }}
            labelStyle={{ color: theme.colors.onSurface, fontSize: 12 }}
          />
        ) : (
          <Avatar.Icon
            size={28}
            icon="account-outline"
            style={{ backgroundColor: theme.colors.surfaceVariant }}
            color={theme.colors.onSurface}
          />
        )}
        <Text
          variant="bodyMedium"
          style={[styles.name, { color: theme.colors.onSurface }]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  anchor: {
    borderRadius: 8,
    flex: 1,
    marginRight: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    maxWidth: 200,
  },
  name: {
    flexShrink: 1,
  },
});
