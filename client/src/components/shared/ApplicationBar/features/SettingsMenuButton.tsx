import * as React from "react";

import { Box, Divider, ListItemIcon, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import {
  InstallMobileOutlined,
  LogoutOutlined,
  ModeNightOutlined,
  RefreshOutlined,
  Settings,
  WbSunnyOutlined,
  WebStoriesOutlined,
} from "@mui/icons-material";
import { useMatch, useNavigate } from "react-router-dom";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Notify } from "../../Notification/Notification";
import { hasAdminRights } from "src/shared/utils/getUserRoles";
import routes from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { useDetectBrowserType } from "src/shared/hooks/useDetectBrowserType";
import { primaryColor } from "src/application/shared/themes";

export interface SettingsMenuButtonProps {
  children?: JSX.Element;
  setIsInstallAppDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const SettingsMenuButton = (props: SettingsMenuButtonProps) => {
  const navigate = useNavigate();
  const {
    store: {
      state: { themeMode, auth },
      toggleThemeMode,
    },
    manager: { handleSetAuthInfo },
  } = useApplicationContext();
  const { isInStandaloneMode } = useDetectBrowserType();
  const [element, setElement] = React.useState<null | HTMLElement>(null);

  const isOpen = Boolean(element);
  const isUserPrivatePages =
    !!useMatch(routes.myStories(":userId")) ||
    !!useMatch(routes.myProfile(":userId"));

  const handleMenuButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setElement(event.currentTarget);
  };

  const handleCloseMenu = () => setElement(null);

  const handleOnInstallClick = () => {
    props.setIsInstallAppDialogOpen(true);
  };

  const handleOnRefreshClick = () => {
    window.location.reload();
  };

  const handleOnUsersBlogsClick = () => {
    navigate(routes.usersStories);
  };

  const handleOnLogoutClick = () => {
    handleSetAuthInfo({
      isAuthenticated: false,
      user: null,
    });
    Notify({
      type: "info",
      content: "Logged out",
    });

    if (isUserPrivatePages) navigate(routes.unauthorized);
  };

  const buttonHoverStylePrimary = {
    "&:hover": {
      "& .MuiTypography-root": {
        color: primaryColor,
      },
      "& .MuiSvgIcon-root": {
        color: primaryColor,
      },
    },
  };

  return (
    <>
      <Box
        id="user-account-button"
        aria-haspopup="true"
        aria-expanded={isOpen ? "true" : undefined}
        aria-controls={isOpen ? "settings-button" : undefined}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={handleMenuButtonClick}
      >
        <Settings fontSize="medium" color="secondary" />

        {props.children}
      </Box>

      <Menu
        open={isOpen}
        anchorEl={element}
        disableScrollLock
        id="user-account-menu"
        MenuListProps={{
          "aria-labelledby": "settings-account-button",
        }}
        variant="menu"
        onClose={handleCloseMenu}
      >
        <MenuItem sx={{ ...buttonHoverStylePrimary }} onClick={toggleThemeMode}>
          <ListItemIcon>
            {themeMode === "dark" ? (
              <WbSunnyOutlined
                fontSize="medium"
                color="secondary"
                sx={{ mr: 1 }}
              />
            ) : (
              <ModeNightOutlined
                fontSize="medium"
                color="secondary"
                sx={{ mr: 1 }}
              />
            )}
          </ListItemIcon>

          <Typography variant="body1">Theme</Typography>
        </MenuItem>

        {!isInStandaloneMode && (
          <MenuItem
            sx={{ ...buttonHoverStylePrimary }}
            onClick={handleOnInstallClick}
          >
            <ListItemIcon>
              <InstallMobileOutlined
                fontSize="medium"
                color="secondary"
                sx={{ mr: 1 }}
              />
            </ListItemIcon>

            <Typography variant="body1">Install </Typography>
          </MenuItem>
        )}

        <MenuItem
          sx={{ ...buttonHoverStylePrimary }}
          onClick={handleOnRefreshClick}
        >
          <RefreshOutlined fontSize="medium" color="secondary" sx={{ mr: 1 }} />
          <Typography variant="body1">Refresh App</Typography>
        </MenuItem>

        {auth.isAuthenticated ? (
          <>
            {hasAdminRights(auth.user) ? (
              <>
                <Divider />

                <MenuItem
                  sx={{ ...buttonHoverStylePrimary }}
                  onClick={handleOnUsersBlogsClick}
                >
                  <ListItemIcon>
                    <WebStoriesOutlined fontSize="small" color="secondary" />
                  </ListItemIcon>

                  <Typography variant="body1" color="text.primary">
                    Users Blogs
                  </Typography>
                </MenuItem>
              </>
            ) : (
              []
            )}
            <Divider />

            <MenuItem
              sx={{ ...buttonHoverStylePrimary }}
              onClick={handleOnLogoutClick}
            >
              <ListItemIcon>
                <LogoutOutlined
                  fontSize="medium"
                  color="secondary"
                  sx={{ mr: 1 }}
                />
              </ListItemIcon>

              <Typography variant="body1">Logout</Typography>
            </MenuItem>
          </>
        ) : (
          []
        )}
      </Menu>
    </>
  );
};

export default SettingsMenuButton;
