import { Avatar, Badge } from "@mui/material";

import { Authentication } from "src/application/store/state";
import { VerifiedTwoTone } from "@mui/icons-material";
import { secondaryColorForDarkTheme } from "src/application/shared/themes";

export interface ProfileAvatarProps {
  auth: Authentication;
  avatarSize: { width: number; height: number };
  verifiedBadgeSize: number;
}

const ProfileAvatar = (props: ProfileAvatarProps) => {
  const { auth, avatarSize, verifiedBadgeSize } = props;

  if (!auth || !auth.user) return <></>;

  return (
    <Badge
      overlap="circular"
      badgeContent={
        auth.user.isPaidUser && (
          <VerifiedTwoTone
            sx={{
              "& path:nth-of-type(1)": {
                color: secondaryColorForDarkTheme,
                fill: secondaryColorForDarkTheme,
                opacity: 1,
              },
              "& path:nth-of-type(2)": {
                color: secondaryColorForDarkTheme,
                fill: secondaryColorForDarkTheme,
                opacity: 1,
              },
              fontSize: verifiedBadgeSize,
            }}
          />
        )
      }
    >
      {auth.user.picture ? (
        <Avatar
          alt="User Picture"
          src={auth.user.picture}
          sx={{ width: avatarSize.width, height: avatarSize.height }}
        />
      ) : (
        <Avatar
          sx={{ mr: 1, width: avatarSize.width, height: avatarSize.height }}
        >
          {auth.user.name.givenName.charAt(0)}
          {auth.user.name.familyName.charAt(0)}
        </Avatar>
      )}
    </Badge>
  );
};

export default ProfileAvatar;
