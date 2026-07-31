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

type UserAccountMenuButtonProps = {
  user: User;
};

const displayName = (user: User, accountLabel: string): string => {
  const given = user.name.givenName?.trim() ?? "";
  const familyInitial = user.name.familyName?.trim().charAt(0) ?? "";
  if (!given) {
    return accountLabel;
  }
  return familyInitial ? `${given} ${familyInitial}.` : given;
};

const avatarLabel = (user: User): string => {
  const a = user.name.givenName?.charAt(0) ?? "";
  const b = user.name.familyName?.charAt(0) ?? "";
  return (a + b).toUpperCase() || "?";
};

export const UserAccountMenuButton = ({ user }: UserAccountMenuButtonProps) => {
  const { t } = useTranslation("common");
  const theme = useTheme();
  const accountLabel = t("account");

  return (
    <TouchableRipple
      onPress={() => openRootSheet(mobileRoutes.sheet.account)}
      style={styles.anchor}
      accessibilityRole="button"
      accessibilityLabel={displayName(user, accountLabel)}
    >
      <View style={styles.row}>
        {user.picture ? (
          <Avatar.Image size={28} source={{ uri: user.picture }} />
        ) : (
          <Avatar.Text
            size={28}
            label={avatarLabel(user)}
            style={{ backgroundColor: theme.colors.surfaceVariant }}
            labelStyle={{ color: theme.colors.onSurface, fontSize: 12 }}
          />
        )}
        <Text
          variant="bodyMedium"
          style={[styles.name, { color: theme.colors.onSurface }]}
          numberOfLines={1}
        >
          {displayName(user, accountLabel)}
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
