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

  const avatar = user.picture ? (
    <Avatar.Image size={size} source={{ uri: user.picture }} />
  ) : (
    <Avatar.Text
      size={size}
      label={initials}
      style={{ backgroundColor: theme.colors.primaryContainer }}
      labelStyle={{ color: theme.colors.onPrimaryContainer }}
    />
  );

  /**
   * The ring lives on a wrapper, not on the avatar itself.
   *
   * Paper renders `Avatar.Image` as a `size × size` View holding a `size ×
   * size` Image. A border on that View insets the content box without
   * shrinking the image, so the picture spills past the bottom-right and
   * reads as off-centre. Growing the wrapper by the border instead keeps the
   * two circles concentric.
   */
  const outerSize = size + BORDER_WIDTH * 2;
  const ring = {
    width: outerSize,
    height: outerSize,
    borderRadius: outerSize / 2,
    borderWidth: BORDER_WIDTH,
    borderColor: theme.colors.primary,
  };

  // Scales with the avatar so the tick stays a badge in a 44px list row; at
  // the 112px default this is still 28, as before.
  const badgeSize = Math.max(14, Math.round(size / 4));

  return (
    <View style={{ width: outerSize, height: outerSize }}>
      <View style={[styles.ring, ring]}>{avatar}</View>
      {user.isPaidUser ? (
        <Badge
          visible
          size={badgeSize}
          style={[styles.badge, { backgroundColor: theme.colors.primary }]}
        >
          ✓
        </Badge>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  ring: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
});
