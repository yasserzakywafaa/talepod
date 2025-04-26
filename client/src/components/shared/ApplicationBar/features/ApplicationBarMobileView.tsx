import {
  AlternateEmailOutlined,
  ArticleOutlined,
  AutoFixHighOutlined,
  EarbudsOutlined,
  LockOpenOutlined,
  MenuOutlined,
  SearchOutlined,
  VpnKeyOutlined,
  WebStoriesOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Drawer,
  MenuItem,
  Typography,
} from "@mui/material";

import { Authentication } from "src/application/store/state";
import { PagesMatch } from "../ApplicationBar";
import SettingsMenuButton from "./SettingsMenuButton";
import UserAccountMenuButton from "./UserAccountButton";
import { primaryColor } from "src/application/shared/themes";
import useDeviceSize from "src/shared/hooks/useDeviceSize";

interface ApplicationBarMobileViewParams {
  auth: Authentication;
  isDrawerOpen: boolean;
  pagesMatch: PagesMatch;
  isScrolledFromTop: boolean;
  handleSetDrawer: (newState: boolean) => () => void;
  handleToggleLoginModal: () => void;
  handleToggleRegisterModal: () => void;
  setIsInstallAppDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleOnMenuItemClick: (sectionId: string) => () => void;
}

const ApplicationBarMobileView = (props: ApplicationBarMobileViewParams) => {
  const {
    auth,
    pagesMatch,
    isDrawerOpen,
    isScrolledFromTop,
    handleSetDrawer,
    handleToggleLoginModal,
    handleToggleRegisterModal,
    setIsInstallAppDialogOpen,
    handleOnMenuItemClick,
  } = props;
  const { isDesktop, isTablet, isMobile } = useDeviceSize();

  return (
    <>
      {/* Mobile */}
      {(isTablet || isMobile) && !isDesktop && (
        <Box
          display="flex"
          component="div"
          flexDirection="row"
          justifyContent={isScrolledFromTop ? "space-between" : "flex-end"}
          width="100%"
        >
          {isScrolledFromTop ? (
            <Button
              size="small"
              color="primary"
              variant="contained"
              endIcon={<AutoFixHighOutlined />}
              onClick={handleOnMenuItemClick("create")}
            >
              Create Story
            </Button>
          ) : (
            <></>
          )}

          <Button
            variant="text"
            color="primary"
            aria-label="menu"
            onClick={handleSetDrawer(true)}
            sx={{ minWidth: "30px", p: "4px" }}
          >
            <MenuOutlined fontSize="medium" />
          </Button>

          <Drawer
            anchor="right"
            open={isDrawerOpen}
            onClose={handleSetDrawer(false)}
          >
            <Box
              role="menu"
              sx={{
                p: 1,
                pt: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flexGrow: 1,
                minWidth: "50dvw",
                backgroundColor: "background.paper",
              }}
            >
              <Box>
                <MenuItem
                  className={`menu-item`}
                  onClick={handleOnMenuItemClick("features")}
                >
                  <EarbudsOutlined
                    fontSize="medium"
                    color="primary"
                    sx={{ mr: 1 }}
                  />
                  <Typography
                    variant="h6"
                    color={
                      pagesMatch.isFeaturesPage ? primaryColor : "text.primary"
                    }
                  >
                    Features
                  </Typography>
                </MenuItem>

                <MenuItem
                  className={`menu-item`}
                  onClick={handleOnMenuItemClick("create")}
                >
                  <AutoFixHighOutlined
                    fontSize="medium"
                    color="primary"
                    sx={{ mr: 1 }}
                  />
                  <Typography
                    variant="h6"
                    color={
                      pagesMatch.isCreatePage ? primaryColor : "text.primary"
                    }
                  >
                    Create Story
                  </Typography>
                </MenuItem>

                <MenuItem
                  className={`menu-item`}
                  onClick={handleOnMenuItemClick("contact")}
                >
                  <AlternateEmailOutlined
                    fontSize="medium"
                    color="primary"
                    sx={{ mr: 1 }}
                  />
                  <Typography
                    variant="h6"
                    color={
                      pagesMatch.isContactPage ? primaryColor : "text.primary"
                    }
                  >
                    Contact Us
                  </Typography>
                </MenuItem>

                <MenuItem
                  className={`menu-item`}
                  onClick={handleOnMenuItemClick("explore")}
                >
                  <SearchOutlined
                    fontSize="medium"
                    color="primary"
                    sx={{ mr: 1 }}
                  />

                  <Typography
                    variant="h6"
                    color={
                      pagesMatch.isExplorePage ? primaryColor : "text.primary"
                    }
                  >
                    Explore
                  </Typography>
                </MenuItem>

                <MenuItem
                  className={`menu-item`}
                  onClick={handleOnMenuItemClick("blogs")}
                >
                  <ArticleOutlined
                    fontSize="medium"
                    color="primary"
                    sx={{ mr: 1 }}
                  />
                  <Typography
                    variant="h6"
                    color={
                      pagesMatch.isBlogsPage ? primaryColor : "text.primary"
                    }
                  >
                    Blogs
                  </Typography>
                </MenuItem>

                {auth.isAuthenticated ? (
                  <>
                    <Divider sx={{ marginX: "1rem" }} />

                    <MenuItem
                      className={`menu-item`}
                      onClick={handleOnMenuItemClick("my-stories")}
                    >
                      <WebStoriesOutlined
                        color="secondary"
                        fontSize="medium"
                        sx={{ mr: 1 }}
                      />

                      <Typography
                        variant="h6"
                        color={
                          pagesMatch.isMyStoriesPage
                            ? primaryColor
                            : "text.primary"
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

              <Box marginBottom="1rem">
                {auth.isAuthenticated ? (
                  <MenuItem>
                    <UserAccountMenuButton
                      auth={auth}
                      isMyProfilePage={pagesMatch.isMyProfilePage}
                    />
                  </MenuItem>
                ) : (
                  <>
                    <MenuItem onClick={handleToggleRegisterModal}>
                      <LockOpenOutlined
                        fontSize="medium"
                        color="secondary"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="h6">Register</Typography>
                    </MenuItem>

                    <MenuItem onClick={handleToggleLoginModal}>
                      <VpnKeyOutlined
                        fontSize="medium"
                        color="secondary"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="h6">Log in</Typography>
                    </MenuItem>
                  </>
                )}

                <MenuItem>
                  <SettingsMenuButton
                    setIsInstallAppDialogOpen={setIsInstallAppDialogOpen}
                  >
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      Settings
                    </Typography>
                  </SettingsMenuButton>
                </MenuItem>
              </Box>
            </Box>
          </Drawer>
        </Box>
      )}
    </>
  );
};

export default ApplicationBarMobileView;
