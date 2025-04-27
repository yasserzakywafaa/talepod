import {
  AlternateEmailOutlined,
  ArticleOutlined,
  AutoFixHighOutlined,
  EarbudsOutlined,
  LockOpenOutlined,
  SearchOutlined,
  VpnKeyOutlined,
  WebStoriesOutlined,
} from "@mui/icons-material";
import { Box, Divider, MenuItem, Typography } from "@mui/material";
import {
  primaryColor,
  secondaryColorForDarkTheme,
} from "src/application/shared/themes";

import { Authentication } from "src/application/store/state";
import { PagesMatch } from "../ApplicationBar";
import SettingsMenuButton from "./SettingsMenuButton";
import { User } from "src/shared/user";
import UserAccountMenuButton from "./UserAccountButton";
import useDeviceSize from "src/shared/hooks/useDeviceSize";

interface ApplicationBarDesktopViewParams {
  auth: Authentication;
  pagesMatch: PagesMatch;
  handleToggleLoginModal: () => void;
  handleToggleRegisterModal: () => void;
  setIsInstallAppDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleOnMenuItemClick: (sectionId: string) => () => void;
}

const ApplicationBarDesktopView = (props: ApplicationBarDesktopViewParams) => {
  const {
    auth,
    pagesMatch,
    handleToggleLoginModal,
    handleToggleRegisterModal,
    setIsInstallAppDialogOpen,
    handleOnMenuItemClick,
  } = props;
  const { isTablet } = useDeviceSize();

  const buttonHoverStylePrimary = {
    "&:hover": {
      "& .MuiTypography-root": {
        color: secondaryColorForDarkTheme,
      },
      "& .MuiSvgIcon-root": {
        color: secondaryColorForDarkTheme,
      },
    },
  };

  const buttonHoverStyleSecondary = {
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
      {!isTablet && (
        <>
          <Box role="menu" sx={{ display: { xs: "none", md: "flex" } }}>
            <MenuItem
              className={`menu-item`}
              sx={{ ...buttonHoverStylePrimary }}
              onClick={handleOnMenuItemClick("features")}
            >
              <EarbudsOutlined
                fontSize="medium"
                color="primary"
                sx={{ mr: 1 }}
              />
              <Typography
                variant="body1"
                color={
                  pagesMatch.isFeaturesPage ? primaryColor : "text.primary"
                }
              >
                Features
              </Typography>
            </MenuItem>

            <MenuItem
              className={`menu-item`}
              sx={{ py: "6px", px: "12px", ...buttonHoverStylePrimary }}
              onClick={handleOnMenuItemClick("create")}
            >
              <AutoFixHighOutlined
                fontSize="medium"
                color="primary"
                sx={{ mr: 1 }}
              />
              <Typography
                variant="body1"
                color={pagesMatch.isCreatePage ? primaryColor : "text.primary"}
              >
                Create Story
              </Typography>
            </MenuItem>

            <MenuItem
              className={`menu-item`}
              sx={{ py: "6px", px: "12px", ...buttonHoverStylePrimary }}
              onClick={handleOnMenuItemClick("contact")}
            >
              <AlternateEmailOutlined
                fontSize="medium"
                color="primary"
                sx={{ mr: 1 }}
              />
              <Typography
                variant="body1"
                color={pagesMatch.isContactPage ? primaryColor : "text.primary"}
              >
                Contact Us
              </Typography>
            </MenuItem>

            <MenuItem
              className={`menu-item`}
              sx={{ py: "6px", px: "12px", ...buttonHoverStylePrimary }}
              onClick={handleOnMenuItemClick("explore")}
            >
              <SearchOutlined
                fontSize="medium"
                color="primary"
                sx={{ mr: 1 }}
              />

              <Typography
                variant="body1"
                color={pagesMatch.isExplorePage ? primaryColor : "text.primary"}
              >
                Explore
              </Typography>
            </MenuItem>

            <MenuItem
              className={`menu-item`}
              sx={{ py: "6px", px: "12px", ...buttonHoverStylePrimary }}
              onClick={handleOnMenuItemClick("blogs")}
            >
              <ArticleOutlined
                fontSize="medium"
                color="primary"
                sx={{ mr: 1 }}
              />
              <Typography
                variant="body1"
                color={pagesMatch.isBlogsPage ? primaryColor : "text.primary"}
              >
                Blogs
              </Typography>
            </MenuItem>

            {auth.isAuthenticated ? (
              <>
                <Divider
                  orientation="vertical"
                  sx={{ height: "30px", marginX: "1rem" }}
                />

                <MenuItem
                  className={`menu-item`}
                  sx={{ ...buttonHoverStylePrimary }}
                  onClick={handleOnMenuItemClick("my-stories")}
                >
                  <WebStoriesOutlined
                    color="secondary"
                    fontSize="medium"
                    sx={{ mr: 1 }}
                  />

                  <Typography
                    variant="body1"
                    color={
                      pagesMatch.isMyStoriesPage ? primaryColor : "text.primary"
                    }
                  >
                    My Stories
                  </Typography>
                </MenuItem>
              </>
            ) : (
              <></>
            )}
          </Box>

          <Box
            sx={{
              gap: 0.5,
              alignItems: "center",
              display: { xs: "none", md: "flex" },
            }}
          >
            {auth.isAuthenticated ? (
              <UserAccountMenuButton
                user={auth.user as User}
                isMyProfilePage={pagesMatch.isMyProfilePage}
              />
            ) : (
              <>
                <MenuItem
                  sx={{ ...buttonHoverStyleSecondary }}
                  onClick={handleToggleRegisterModal}
                >
                  <LockOpenOutlined
                    fontSize="medium"
                    color="secondary"
                    sx={{ mr: 1 }}
                  />

                  <Typography variant="body1" color="text.primary">
                    Register
                  </Typography>
                </MenuItem>

                <MenuItem
                  sx={{ ...buttonHoverStyleSecondary }}
                  onClick={handleToggleLoginModal}
                >
                  <VpnKeyOutlined
                    fontSize="medium"
                    color="secondary"
                    sx={{ mr: 1 }}
                  />

                  <Typography variant="body1" color="text.primary">
                    Login
                  </Typography>
                </MenuItem>
              </>
            )}

            <MenuItem sx={{ ...buttonHoverStyleSecondary }}>
              <SettingsMenuButton
                setIsInstallAppDialogOpen={setIsInstallAppDialogOpen}
              />
            </MenuItem>
          </Box>
        </>
      )}
    </>
  );
};

export default ApplicationBarDesktopView;
