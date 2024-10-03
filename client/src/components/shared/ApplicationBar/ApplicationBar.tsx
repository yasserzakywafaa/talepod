import {
  AlternateEmailOutlined,
  AutoFixHighOutlined,
  HomeOutlined,
  InstallMobileOutlined,
  LockOpenOutlined,
  MenuOutlined,
  ModeNightOutlined,
  RefreshOutlined,
  SearchOutlined,
  VpnKeyOutlined,
  WbSunnyOutlined,
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

import BackButton from "./BackButton";
import { InstallAppModal } from "src/components/Modals/InstallAppModal/InstallAppModal";
import { LoginModal } from "src/components/Modals/LoginModal/LoginModal";
import { PricingModal } from "src/components/Modals/PricingModal/PricingModal";
import { RegisterModal } from "src/components/Modals/RegisterModal/RegisterModal";
import ToggleColorMode from "src/components/shared/ToggleColorMode";
import UserAccountMenuButton from "./UserAccountButton";
import { hasAdminRights } from "src/shared/utils/getUserRoles";
import routes from "src/application/routes";
import { scrollToSection } from "src/shared/utils/scrollTo";
import { useApplicationContext } from "src/application/store/Provider";
import { useDetectBrowserType } from "src/shared/hooks/useDetectBrowserType";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
import { useRegisterModalContext } from "src/components/Modals/RegisterModal/store/Provider";
import { useState } from "react";

const ApplicationBar = () => {
  const navigate = useNavigate();
  const { isDesktop, isTablet, isMobile } = useDeviceSize();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInstallAppDialogOpen, setIsInstallAppDialogOpen] =
    useState<boolean>(false);
  const [isPricingDialogOpen, setIsPricingDialogOpen] =
    useState<boolean>(false);
  const {
    store: {
      state: { themeMode, auth },
      toggleThemeMode,
    },
    manager: { handleSetAuthInfo },
  } = useApplicationContext();
  const { isInStandaloneMode } = useDetectBrowserType();

  const {
    store: { handleToggleLoginModal },
  } = useLoginModalContext();

  const {
    store: { handleToggleRegisterModal },
  } = useRegisterModalContext();

  // Add all the pages the will contain the AppBar
  const pagesMatch = {
    isHomePage: !!useMatch(routes.home),
    isCreatePage: !!useMatch(routes.create),
    isExplorePage: !!useMatch(routes.explore),
    isContactPage: !!useMatch(routes.contact),
    isViewStoryPage: !!useMatch(routes.story(":id")),
    isMyStoriesPage: !!useMatch(routes.myStories(":userId")),
    isCheckoutPage: !!useMatch(routes.checkout),
    isUnauthorized: !!useMatch(routes.unauthorized),
    isPrivacyPolicy: !!useMatch(routes.privacyPolicy),
    isTermsOfService: !!useMatch(routes.termsAndConditions),
    isLandingPage: !!window.location.pathname.includes("bedtime-stories"),
  };
  // const isAppBarVisible = Object.values(pagesMatch).every((p) => p === false);
  const isAppBarVisible = true;

  const toggleDrawer = (newOpen: boolean) => () => {
    setIsDrawerOpen(newOpen);
  };

  const handleOnMenuItemClick = (sectionId: string) => () => {
    switch (sectionId) {
      case "home":
        navigate(routes.home);
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
      case "refresh":
        window.location.reload();
        break;
      case "install":
        setIsInstallAppDialogOpen(true);
        return;
      case "users-stories":
        navigate(routes.usersStories);
        return;

      default:
        scrollToSection(sectionId);
    }
    setIsDrawerOpen(false);
  };

  const handleOnBackClick = () => navigate(-1);

  return (
    <>
      {isAppBarVisible && (
        <AppBar
          position="fixed"
          sx={{
            boxShadow: 0,
            bgcolor: "transparent",
            backgroundImage: "none",
            mt: 2,
          }}
        >
          <Container maxWidth="lg">
            <Toolbar
              variant="regular"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
                borderRadius: "4px",
                backdropFilter: {
                  xs: pagesMatch.isHomePage ? "none" : "blur(24px)",
                  sm: pagesMatch.isHomePage ? "none" : "blur(24px)",
                  lg: "blur(24px)",
                },
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
                    <MenuItem onClick={handleOnMenuItemClick("home")}>
                      <HomeOutlined
                        fontSize="medium"
                        color="primary"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body1" color="text.primary">
                        Home
                      </Typography>
                    </MenuItem>

                    <MenuItem
                      sx={{ py: "6px", px: "12px" }}
                      onClick={handleOnMenuItemClick("explore")}
                    >
                      <SearchOutlined
                        fontSize="medium"
                        color="primary"
                        sx={{ mr: 1 }}
                      />

                      <Typography variant="body1" color="text.primary">
                        Explore
                      </Typography>
                    </MenuItem>

                    <MenuItem
                      sx={{ py: "6px", px: "12px" }}
                      onClick={handleOnMenuItemClick("create")}
                    >
                      <AutoFixHighOutlined
                        fontSize="medium"
                        color="primary"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body1" color="text.primary">
                        Create Story
                      </Typography>
                    </MenuItem>

                    <MenuItem
                      sx={{ py: "6px", px: "12px" }}
                      onClick={handleOnMenuItemClick("contact")}
                    >
                      <AlternateEmailOutlined
                        fontSize="medium"
                        color="primary"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body1" color="text.primary">
                        Contact Us
                      </Typography>
                    </MenuItem>
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
                        handleLogOut={handleSetAuthInfo}
                      />
                    ) : (
                      <>
                        <MenuItem onClick={handleToggleRegisterModal}>
                          <LockOpenOutlined
                            fontSize="medium"
                            color="secondary"
                            sx={{ mr: 1 }}
                          />

                          <Typography variant="body1" color="text.primary">
                            Register
                          </Typography>
                        </MenuItem>

                        <MenuItem onClick={handleToggleLoginModal}>
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

                    {auth.isAuthenticated && hasAdminRights(auth.user) ? (
                      <MenuItem
                        onClick={handleOnMenuItemClick("users-stories")}
                      >
                        <WebStoriesOutlined
                          fontSize="medium"
                          color="secondary"
                          sx={{ mr: 1 }}
                        />

                        <Typography variant="body1" color="text.primary">
                          Users Stories
                        </Typography>
                      </MenuItem>
                    ) : (
                      <></>
                    )}

                    {!isInStandaloneMode && (
                      <MenuItem onClick={handleOnMenuItemClick("install")}>
                        <InstallMobileOutlined
                          fontSize="medium"
                          color="secondary"
                          sx={{ mr: 1 }}
                        />

                        <Typography variant="body1" color="text.primary">
                          Install App
                        </Typography>
                      </MenuItem>
                    )}

                    <ToggleColorMode
                      mode={themeMode}
                      toggleColorMode={toggleThemeMode}
                    />
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
                    pagesMatch.isHomePage ? "flex-end" : "space-between"
                  }
                  width="100%"
                >
                  {!pagesMatch.isHomePage && (
                    <BackButton onClick={handleOnBackClick} />
                  )}

                  {!pagesMatch.isHomePage && !pagesMatch.isCreatePage && (
                    <Box
                      width="100%"
                      margin="auto"
                      display="flex"
                      justifyContent="center"
                    >
                      <Button
                        size="small"
                        color="secondary"
                        variant="text"
                        sx={{ my: 2, px: 2 }}
                        endIcon={<AutoFixHighOutlined />}
                        onClick={handleOnMenuItemClick("create")}
                      >
                        Create Story
                      </Button>
                    </Box>
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
                        flexGrow: 1,
                        minWidth: "50dvw",
                        backgroundColor: "background.paper",
                      }}
                    >
                      <MenuItem onClick={handleOnMenuItemClick("home")}>
                        <HomeOutlined
                          fontSize="medium"
                          color="primary"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="h6">Home</Typography>
                      </MenuItem>

                      <MenuItem onClick={handleOnMenuItemClick("explore")}>
                        <SearchOutlined
                          fontSize="medium"
                          color="primary"
                          sx={{ mr: 1 }}
                        />

                        <Typography variant="h6">Explore</Typography>
                      </MenuItem>

                      <MenuItem onClick={handleOnMenuItemClick("create")}>
                        <AutoFixHighOutlined
                          fontSize="medium"
                          color="primary"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="h6">Create Story</Typography>
                      </MenuItem>

                      <MenuItem onClick={handleOnMenuItemClick("contact")}>
                        <AlternateEmailOutlined
                          fontSize="medium"
                          color="primary"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="h6">Contact Us</Typography>
                      </MenuItem>

                      <Divider sx={{ width: "80%", margin: "auto" }} />

                      {auth.isAuthenticated ? (
                        <MenuItem>
                          <UserAccountMenuButton
                            auth={auth}
                            handleLogOut={handleSetAuthInfo}
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

                      {auth.isAuthenticated && hasAdminRights(auth.user) ? (
                        <MenuItem
                          onClick={handleOnMenuItemClick("users-stories")}
                        >
                          <WebStoriesOutlined
                            fontSize="medium"
                            color="secondary"
                            sx={{ mr: 1 }}
                          />

                          <Typography variant="body1" color="text.primary">
                            Users Stories
                          </Typography>
                        </MenuItem>
                      ) : (
                        <></>
                      )}

                      {!isInStandaloneMode && (
                        <MenuItem onClick={handleOnMenuItemClick("install")}>
                          <InstallMobileOutlined
                            fontSize="medium"
                            color="secondary"
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="h6">Install App</Typography>
                        </MenuItem>
                      )}

                      <MenuItem onClick={toggleThemeMode}>
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

                        <Typography variant="h6">Appearance</Typography>
                      </MenuItem>

                      <MenuItem onClick={handleOnMenuItemClick("refresh")}>
                        <RefreshOutlined
                          fontSize="medium"
                          color="secondary"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="h6">Refresh App</Typography>
                      </MenuItem>
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
      <PricingModal
        isPricingDialogOpen={isPricingDialogOpen}
        setIsPricingDialogOpen={setIsPricingDialogOpen}
      />
    </>
  );
};

export default ApplicationBar;
