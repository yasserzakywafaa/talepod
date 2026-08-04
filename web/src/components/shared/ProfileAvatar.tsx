import { Avatar, Badge } from "@mui/material";

import { User } from "src/shared/types/user";
import { getUserAvatarInitials } from "src/shared/utils/getUserDisplayName";
import { VerifiedBadge } from "./VerifiedBadge";

export interface ProfileAvatarProps {
  user: User;
  avatarSize: { width: number; height: number };
  verifiedBadgeSize: number;
}

const ProfileAvatar = (props: ProfileAvatarProps) => {
  const { user, avatarSize, verifiedBadgeSize } = props;

  if (!user) return <></>;

  return (
    <Badge
      overlap="circular"
      badgeContent={
        user.isPaidUser && <VerifiedBadge fontSize={verifiedBadgeSize} />
      }
    >
      {user.picture ? (
        <Avatar
          alt="User Picture"
          src={user.picture}
          sx={{ width: avatarSize.width, height: avatarSize.height }}
        />
      ) : (
        <Avatar
          sx={{ mr: 1, width: avatarSize.width, height: avatarSize.height }}
        >
          {getUserAvatarInitials(user)}
        </Avatar>
      )}
    </Badge>
  );
};

export default ProfileAvatar;
