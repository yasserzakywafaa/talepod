import * as React from "react";

import { Box, Divider, ListItemIcon, Typography } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  PersonOutlined,
  WebStoriesOutlined,
} from "@mui/icons-material";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ProfileAvatar from "./ProfileAvatar";
import { User } from "src/shared/types/user";
import { hasAdminRights } from "src/shared/utils/getUserRoles";
import { primaryColor } from "src/application/shared/themes";
import routes from "src/application/routes";
import { useNavigate } from "react-router-dom";

interface UserAccountMenuButtonProps {
  user: User;
  isMyProfilePage?: boolean;
  isMyBlogsPage?: boolean;
  isMyCampaignsPage?: boolean;
  isDashboardPage?: boolean;
}

const UserAccountMenuButton = (props: UserAccountMenuButtonProps) => {
  const navigate = useNavigate();
  const {
    user,
    isMyProfilePage = false,
    isMyBlogsPage = false,
    isMyCampaignsPage = false,
    isDashboardPage = false,
  } = props;
  const [element, setElement] = React.useState<null | HTMLElement>(null);

  if (!user) return;

  const isAdmin = hasAdminRights(user);

  const userFullName = `${user.name.givenName} ${user.name.familyName.charAt(
    0
  )}.`;

  const isOpen = Boolean(element);

  const handleMenuButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setElement(event.currentTarget);
  };

  const handleCloseMenu = () => setElement(null);

  const handleOnProfileClick = () => {
    user && navigate(routes.myProfile(user._id));
    handleCloseMenu();
  };

  const handleOnMyBlogsClick = () => {
    user && navigate(routes.myStories(user._id));
    handleCloseMenu();
  };

  const handleOnDashboardClick = () => {
    navigate(routes.dashboard.home);
    handleCloseMenu();
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
        aria-controls={isOpen ? "user-account-menu" : undefined}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={handleMenuButtonClick}
      >
        <ProfileAvatar
          user={user}
          avatarSize={{ width: 25, height: 25 }}
          verifiedBadgeSize={14}
        />

        <Typography
          variant="body1"
          color={
            isMyProfilePage ||
            isMyBlogsPage ||
            isMyCampaignsPage ||
            isDashboardPage
              ? primaryColor
              : "text.primary"
          }
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

      <Menu
        open={isOpen}
        anchorEl={element}
        disableScrollLock
        id="user-account-menu"
        MenuListProps={{
          "aria-labelledby": "user-account-button",
        }}
        variant="menu"
        onClose={handleCloseMenu}
      >
        <MenuItem
          sx={{ ...buttonHoverStylePrimary }}
          onClick={handleOnProfileClick}
        >
          <ListItemIcon>
            <PersonOutlined
              fontSize="medium"
              color="secondary"
              sx={{ mr: 1 }}
            />
          </ListItemIcon>
          <Typography
            variant="body1"
            color={isMyProfilePage ? primaryColor : "text.primary"}
          >
            Profile
          </Typography>
        </MenuItem>

        <MenuItem
          sx={{ ...buttonHoverStylePrimary }}
          onClick={handleOnMyBlogsClick}
        >
          <ListItemIcon>
            <WebStoriesOutlined
              fontSize="medium"
              color="secondary"
              sx={{ mr: 1 }}
            />
          </ListItemIcon>
          <Typography
            variant="body1"
            color={isMyBlogsPage ? primaryColor : "text.primary"}
          >
            My Stories
          </Typography>
        </MenuItem>

        {isAdmin && (
          <>
            <Divider
              orientation="horizontal"
              flexItem
              sx={{ my: 1, mx: "2rem" }}
            />

            <MenuItem
              sx={{ ...buttonHoverStylePrimary }}
              onClick={handleOnDashboardClick}
            >
              <ListItemIcon>
                <DashboardIcon
                  fontSize="medium"
                  color="secondary"
                  sx={{ mr: 1 }}
                />
              </ListItemIcon>
              <Typography
                variant="body1"
                color={isDashboardPage ? primaryColor : "text.primary"}
              >
                Dashboard
              </Typography>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default UserAccountMenuButton;
