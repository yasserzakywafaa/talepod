import { Box, Typography } from "@mui/material";

import { Authentication } from "src/application/store/state";
import ProfileAvatar from "../ProfileAvatar";
import routes from "src/application/routes";
import { useNavigate } from "react-router-dom";

interface UserAccountMenuButtonProps {
  auth: Authentication;
}

const UserAccountMenuButton = (props: UserAccountMenuButtonProps) => {
  const navigate = useNavigate();
  const { auth } = props;

  if (!auth.user) return;

  const userFullName = `${
    auth.user.name.givenName
  } ${auth.user.name.familyName.charAt(0)}.`;

  const handleOnMyProfileClick = () => {
    auth.user && navigate(routes.myProfile(auth.user._id));
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
        onClick={handleOnMyProfileClick}
      >
        <ProfileAvatar
          auth={auth}
          avatarSize={{ width: 20, height: 20 }}
          verifiedBadgeSize={14}
        />

        <Typography
          variant="h6"
          color="text.primary"
          sx={{
            maxWidth: "100px",
            overflowX: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
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
