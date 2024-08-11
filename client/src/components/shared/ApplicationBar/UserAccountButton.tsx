import * as React from "react";

import { Avatar, Box, Divider, ListItemIcon, Typography } from "@mui/material";
import { LogoutOutlined, WebStoriesOutlined } from "@mui/icons-material";
import { useMatch, useNavigate } from "react-router-dom";

import { Authentication } from "src/application/store/state";
// import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Notify } from "../Notification/Notification";
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

  const isUserPrivatePages =
    !!useMatch(routes.myStories(":userId")) ||
    !!useMatch(routes.myStory(":userId", ":slug"));

  const userFullName = `${
    auth.user?.name.givenName
  } ${auth.user?.name.familyName.charAt(0)}.`;

  const handleMenuButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setElement(event.currentTarget);
  };

  const handleCloseMenu = () => setElement(null);

  const onMyStoriesClick = () => {
    auth.user && navigate(routes.myStories(auth.user.userId));
  };

  const onLogoutClick = () => {
    handleLogOut({
      isAuthenticated: false,
      user: null,
    });
    Notify({
      type: "info",
      content: "Logged out",
    });

    if (isUserPrivatePages) navigate(routes.home);
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
        {auth.user?.picture ? (
          <Avatar
            alt="User Picture"
            src={auth.user?.picture!}
            sx={{ mr: 1, width: 20, height: 20 }}
          />
        ) : (
          <Avatar>
            {auth.user?.name.givenName.charAt(0)}
            {auth.user?.name.familyName.charAt(0)}
          </Avatar>
        )}
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
        >
          {userFullName}
        </Typography>
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
        <MenuItem onClick={onMyStoriesClick}>
          <ListItemIcon>
            <WebStoriesOutlined fontSize="small" color="secondary" />
          </ListItemIcon>
          My Stories
        </MenuItem>

        <Divider />

        <MenuItem onClick={onLogoutClick}>
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
