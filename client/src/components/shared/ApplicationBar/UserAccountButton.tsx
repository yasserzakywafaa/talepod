import * as React from "react";

import {
  AccountCircleOutlined,
  KeyboardArrowDownOutlined,
  LogoutOutlined,
  WebStoriesOutlined,
} from "@mui/icons-material";
import { Box, Divider, ListItemIcon, Typography } from "@mui/material";
import { useMatch, useNavigate } from "react-router-dom";

import { Authentication } from "src/application/store/state";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Notify } from "../Notification/Notification";
import ProfileAvatar from "../ProfileAvatar";
import { hasAdminRights } from "src/shared/utils/getUserRoles";
import routes from "src/application/routes";

interface UserAccountMenuButtonProps {
  auth: Authentication;
  handleLogOut: (auth: Authentication) => void;
}

const UserAccountMenuButton = (props: UserAccountMenuButtonProps) => {
  const navigate = useNavigate();
  const { auth, handleLogOut } = props;
  const [element, setElement] = React.useState<null | HTMLElement>(null);
  const isOpen = Boolean(element);

  if (!auth.user) return;

  const isUserPrivatePages =
    !!useMatch(routes.myStories(":userId")) ||
    !!useMatch(routes.myProfile(":userId"));

  const userFullName = `${
    auth.user.name.givenName
  } ${auth.user.name.familyName.charAt(0)}.`;

  const handleMenuButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setElement(event.currentTarget);
  };

  const handleCloseMenu = () => setElement(null);

  const handleOnMyStoriesClick = () => {
    auth.user && navigate(routes.myStories(auth.user._id));
  };

  const handleOnMyProfileClick = () => {
    auth.user && navigate(routes.myProfile(auth.user._id));
  };

  const handleOnUsersBlogsClick = () => {
    auth.user && navigate(routes.usersStories);
  };

  const handleOnLogoutClick = () => {
    handleLogOut({
      isAuthenticated: false,
      user: null,
    });
    Notify({
      type: "info",
      content: "Logged out",
    });

    if (isUserPrivatePages) navigate(routes.unauthorized);
  };

  return (
    <>
      <Box
        id="user-account-button"
        aria-haspopup="true"
        aria-expanded={isOpen ? "true" : undefined}
        aria-controls={isOpen ? "user-account-button" : undefined}
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={handleMenuButtonClick}
      >
        <ProfileAvatar
          auth={auth}
          avatarSize={{ width: 20, height: 20 }}
          verifiedBadgeSize={14}
        />

        <Typography
          variant="body1"
          color="text.primary"
          sx={{
            maxWidth: "100px",
            overflowX: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            fontSize: { xs: "1.25rem", sm: "1rem" },
          }}
          marginLeft={1}
        >
          {userFullName}
        </Typography>

        <KeyboardArrowDownOutlined color="secondary" sx={{ ml: "8px" }} />
      </Box>

      <Menu
        open={isOpen}
        anchorEl={element}
        disableScrollLock
        id="user-account-menu"
        MenuListProps={{
          "aria-labelledby": "user-account-button",
        }}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleOnMyProfileClick}>
          <ListItemIcon>
            <AccountCircleOutlined fontSize="small" color="secondary" />
          </ListItemIcon>
          My Profile
        </MenuItem>

        <MenuItem onClick={handleOnMyStoriesClick}>
          <ListItemIcon>
            <WebStoriesOutlined fontSize="small" color="secondary" />
          </ListItemIcon>
          My Stories
        </MenuItem>

        <Divider />

        {auth.isAuthenticated && hasAdminRights(auth.user) ? (
          <>
            <MenuItem onClick={handleOnUsersBlogsClick}>
              <ListItemIcon>
                <WebStoriesOutlined fontSize="small" color="primary" />
              </ListItemIcon>

              <Typography variant="body1" color="text.primary">
                Users Blogs
              </Typography>
            </MenuItem>

            <Divider />
          </>
        ) : (
          <></>
        )}

        <MenuItem onClick={handleOnLogoutClick}>
          <ListItemIcon>
            <LogoutOutlined fontSize="small" color="secondary" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserAccountMenuButton;
