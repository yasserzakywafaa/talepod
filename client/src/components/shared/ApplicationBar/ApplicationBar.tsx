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
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useMatch, useNavigate } from "react-router-dom";

import { CancelSubscriptionModal } from "src/components/Modals/CancelSubscriptionModal/CancelSubscriptionModal";
import { InstallAppModal } from "src/components/Modals/InstallAppModal/InstallAppModal";
import { LoginModal } from "src/components/Modals/LoginModal/LoginModal";
import { PricingModal } from "src/components/Modals/PricingModal/PricingModal";
import { RegisterModal } from "src/components/Modals/RegisterModal/RegisterModal";
import SettingsMenuButton from "./SettingsMenuButton";
import UserAccountMenuButton from "./UserAccountButton";
import routes from "src/application/routes";
import { scrollToSection } from "src/shared/utils/scrollTo";
import { useApplicationContext } from "src/application/store/Provider";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
import { useRegisterModalContext } from "src/components/Modals/RegisterModal/store/Provider";
import { useState } from "react";
import useDetectScroll from "src/shared/hooks/useDetectScroll";
import {
  primaryColor,
  secondaryColorForDarkTheme,
} from "src/application/shared/themes";

const ApplicationBar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInstallAppDialogOpen, setIsInstallAppDialogOpen] =
    useState<boolean>(false);

  const navigate = useNavigate();
  const { isScrolledFromTop } = useDetectScroll();
  const { isDesktop, isTablet, isMobile } = useDeviceSize();

  const {
    store: {
      state: { themeMode, auth },
    },
  } = useApplicationContext();

  const {
    store: { handleToggleLoginModal },
  } = useLoginModalContext();

  const {
    store: { handleToggleRegisterModal },
  } = useRegisterModalContext();

  // Add all the pages the will contain the AppBar
  const pagesMatch = {
    isFeaturesPage: !!useMatch(routes.features),
    isCreatePage: !!useMatch(routes.create),
    isExplorePage: !!useMatch(routes.explore),
    isBlogsPage: !!useMatch(routes.blogs),
    isContactPage: !!useMatch(routes.contact),
    isViewBlogPage: !!useMatch(routes.blog(":id")),
    isMyStoriesPage: !!useMatch(routes.myStories(":userId")),
    isMyProfilePage: !!useMatch(routes.myProfile(":userId")),
    isUnauthorized: !!useMatch(routes.unauthorized),
    isPrivacyPolicy: !!useMatch(routes.privacyPolicy),
    isTermsOfService: !!useMatch(routes.termsAndConditions),
    isLandingPage: !!window.location.pathname.includes("blogs"),
  };
  const isAppBarVisible = true;

  const toggleDrawer = (newOpen: boolean) => () => {
    setIsDrawerOpen(newOpen);
  };

  const handleOnMenuItemClick = (sectionId: string) => () => {
    switch (sectionId) {
      case "features":
        navigate(routes.features);
        break;
      case "explore":
        navigate(routes.explore);
        break;
      case "create":
        navigate(routes.create);
        break;
      case "contact":
        navigate(routes.contact);
        break;
      case "original-stories":
        navigate(routes.explore);
        break;
      case "install":
        setIsInstallAppDialogOpen(true);
        return;
      case "users-stories":
        navigate(routes.usersStories);
        return;
      case "my-stories":
        auth.user && navigate(routes.myStories(auth.user._id));
        return;

      default:
        scrollToSection(sectionId);
    }
    setIsDrawerOpen(false);
  };

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
      {isAppBarVisible && (
        <AppBar
          position="fixed"
          sx={{
            boxShadow: 0,
            bgcolor: "transparent",
            backgroundImage: "none",
            mt: 1,
            // zIndex: 1500,
          }}
        >
          <Container maxWidth="lg" className="application-bar-container">
            <Toolbar
              variant="regular"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
                backdropFilter: "blur(24px)",
                maxHeight: 40,
                borderColor: "divider",
                boxShadow: isDesktop
                  ? (theme) =>
                      themeMode === "light"
                        ? `0 0 1px ${theme.palette.primary.light}`
                        : `0 0 1px ${theme.palette.primary.dark}`
                  : undefined,
              }}
            >
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
                          pagesMatch.isFeaturesPage
                            ? primaryColor
                            : "text.primary"
                        }
                      >
                        Features
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
                        color={
                          pagesMatch.isExplorePage
                            ? primaryColor
                            : "text.primary"
                        }
                      >
                        Explore
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
                        color={
                          pagesMatch.isCreatePage
                            ? primaryColor
                            : "text.primary"
                        }
                      >
                        Create Story
                      </Typography>
                    </MenuItem>

                    <MenuItem
                      className={`menu-item`}
                      sx={{ py: "6px", px: "12px", ...buttonHoverStylePrimary }}
                      onClick={handleOnMenuItemClick("original-stories")}
                    >
                      <ArticleOutlined
                        fontSize="medium"
                        color="primary"
                        sx={{ mr: 1 }}
                      />
                      <Typography
                        variant="body1"
                        color={
                          pagesMatch.isBlogsPage ? primaryColor : "text.primary"
                        }
                      >
                        Blogs
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
                        color={
                          pagesMatch.isContactPage
                            ? primaryColor
                            : "text.primary"
                        }
                      >
                        Contact Us
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

                  <Box
                    sx={{
                      gap: 0.5,
                      alignItems: "center",
                      display: { xs: "none", md: "flex" },
                    }}
                  >
                    {auth.isAuthenticated ? (
                      <UserAccountMenuButton
                        auth={auth}
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

              {/* Mobile */}
              {(isTablet || isMobile) && !isDesktop && (
                <Box
                  display="flex"
                  component="div"
                  flexDirection="row"
                  justifyContent={
                    isScrolledFromTop ? "space-between" : "flex-end"
                  }
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
                    onClick={toggleDrawer(true)}
                    sx={{ minWidth: "30px", p: "4px" }}
                  >
                    <MenuOutlined fontSize="medium" />
                  </Button>

                  <Drawer
                    anchor="right"
                    open={isDrawerOpen}
                    onClose={toggleDrawer(false)}
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
                              pagesMatch.isFeaturesPage
                                ? primaryColor
                                : "text.primary"
                            }
                          >
                            Features
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
                              pagesMatch.isExplorePage
                                ? primaryColor
                                : "text.primary"
                            }
                          >
                            Explore
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
                              pagesMatch.isCreatePage
                                ? primaryColor
                                : "text.primary"
                            }
                          >
                            Create Story
                          </Typography>
                        </MenuItem>

                        <MenuItem
                          className={`menu-item`}
                          onClick={handleOnMenuItemClick("original-stories")}
                        >
                          <ArticleOutlined
                            fontSize="medium"
                            color="primary"
                            sx={{ mr: 1 }}
                          />
                          <Typography
                            variant="h6"
                            color={
                              pagesMatch.isBlogsPage
                                ? primaryColor
                                : "text.primary"
                            }
                          >
                            Blogs
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
                              pagesMatch.isContactPage
                                ? primaryColor
                                : "text.primary"
                            }
                          >
                            Contact Us
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
                            setIsInstallAppDialogOpen={
                              setIsInstallAppDialogOpen
                            }
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
            </Toolbar>
          </Container>
        </AppBar>
      )}

      {/* Modals */}
      <LoginModal />
      <RegisterModal />
      <InstallAppModal
        isInstallAppDialogOpen={isInstallAppDialogOpen}
        setIsInstallAppDialogOpen={setIsInstallAppDialogOpen}
      />
      <PricingModal />
      <CancelSubscriptionModal />
    </>
  );
};

export default ApplicationBar;
