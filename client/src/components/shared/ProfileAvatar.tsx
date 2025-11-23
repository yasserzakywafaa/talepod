import { Avatar, Badge } from "@mui/material";

import { User } from "src/shared/types/user";
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
          {user.name.givenName.charAt(0)}
          {user.name.familyName.charAt(0)}
        </Avatar>
      )}
    </Badge>
  );
};

export default ProfileAvatar;
