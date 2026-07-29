import { StyleSheet, View } from "react-native";
import { Avatar, Badge, useTheme } from "react-native-paper";

import type { User } from "src/shared/types/user";

export interface ProfileAvatarProps {
  user: User;
  size?: number;
}

export const ProfileAvatar = ({ user, size = 112 }: ProfileAvatarProps) => {
  const theme = useTheme();

  const initials =
    `${user.name.givenName?.charAt(0) ?? ""}${user.name.familyName?.charAt(0) ?? ""}`.trim() ||
    "?";

  const avatar = user.picture ? (
    <Avatar.Image size={size} source={{ uri: user.picture }} style={styles.square} />
  ) : (
    <Avatar.Text
      size={size}
      label={initials}
      style={[styles.square, { backgroundColor: theme.colors.primaryContainer }]}
      labelStyle={{ color: theme.colors.onPrimaryContainer }}
    />
  );

  if (!user.isPaidUser) {
    return avatar;
  }

  return (
    <View>
      <Badge
        visible
        size={28}
        style={[styles.badge, { backgroundColor: theme.colors.primary }]}
      >
        ✓
      </Badge>
      {avatar}
    </View>
  );
};

const styles = StyleSheet.create({
  square: {
    borderRadius: 12,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    zIndex: 1,
  },
});
