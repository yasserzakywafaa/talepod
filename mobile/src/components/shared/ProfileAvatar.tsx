import { StyleSheet, View } from "react-native";
import { Avatar, Badge, useTheme } from "react-native-paper";

import type { User } from "src/shared/types/user";

export interface ProfileAvatarProps {
  user: User;
  size?: number;
}

const BORDER_WIDTH = 4;

export const ProfileAvatar = ({ user, size = 112 }: ProfileAvatarProps) => {
  const theme = useTheme();

  const initials =
    `${user.name.givenName?.charAt(0) ?? ""}${user.name.familyName?.charAt(0) ?? ""}`.trim() ||
    "?";

  const avatarStyle = [
    styles.avatar,
    {
      borderRadius: size / 2,
      borderWidth: BORDER_WIDTH,
      borderColor: theme.colors.primary,
    },
  ];

  const avatar = user.picture ? (
    <Avatar.Image
      size={size}
      source={{ uri: user.picture }}
      style={avatarStyle}
    />
  ) : (
    <Avatar.Text
      size={size}
      label={initials}
      style={[
        avatarStyle,
        { backgroundColor: theme.colors.primaryContainer },
      ]}
      labelStyle={{ color: theme.colors.onPrimaryContainer }}
    />
  );

  if (!user.isPaidUser) {
    return avatar;
  }

  // Scales with the avatar so the tick stays a badge in a 44px list row; at
  // the 112px default this is still 28, as before.
  const badgeSize = Math.max(14, Math.round(size / 4));

  return (
    <View style={{ width: size + BORDER_WIDTH * 2, height: size + BORDER_WIDTH * 2 }}>
      <Badge
        visible
        size={badgeSize}
        style={[styles.badge, { backgroundColor: theme.colors.primary }]}
      >
        ✓
      </Badge>
      {avatar}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    zIndex: 1,
  },
});
