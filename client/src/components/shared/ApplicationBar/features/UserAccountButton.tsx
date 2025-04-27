import { Box, Typography } from "@mui/material";

import ProfileAvatar from "../../ProfileAvatar";
import { User } from "src/shared/user";
import { primaryColor } from "src/application/shared/themes";
import routes from "src/application/routes";
import { useNavigate } from "react-router-dom";

interface UserAccountMenuButtonProps {
  user: User;
  isMyProfilePage?: boolean;
  navigateToProfile?: boolean;
}

const UserAccountMenuButton = (props: UserAccountMenuButtonProps) => {
  const navigate = useNavigate();
  const { user, isMyProfilePage = false, navigateToProfile = true } = props;

  if (!user) return;

  const userFullName = `${user.name.givenName} ${user.name.familyName.charAt(
    0
  )}.`;

  const handleOnMyProfileClick = () => {
    user && navigate(routes.myProfile(user._id));
  };

  return (
    <>
      <Box
        id="user-account-button"
        aria-haspopup="true"
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={navigateToProfile ? handleOnMyProfileClick : undefined}
      >
        <ProfileAvatar
          user={user}
          avatarSize={{ width: 20, height: 20 }}
          verifiedBadgeSize={14}
        />

        <Typography
          variant="h6"
          color={isMyProfilePage ? primaryColor : "text.primary"}
          sx={{
            maxWidth: "100px",
            overflowX: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            "&.MuiTypography-root:hover": {
              color: primaryColor,
            },
          }}
          marginLeft={1}
        >
          {userFullName}
        </Typography>
      </Box>
    </>
  );
};

export default UserAccountMenuButton;
