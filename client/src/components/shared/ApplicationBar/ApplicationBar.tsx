import {
  AlternateEmailOutlined,
  AutoFixHighOutlined,
  HomeOutlined,
  InstallMobileOutlined,
  MenuOutlined,
  ModeNightOutlined,
  RefreshOutlined,
  SearchOutlined,
  WbSunnyOutlined,
} from "@mui/icons-material";
import { useMatch, useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import BackButton from "./BackButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { Divider } from "@mui/material";
import Drawer from "@mui/material/Drawer";
// import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
// import { useRegisterModalContext } from "src/components/Modals/RegisterModal/store/Provider";
import { InstallAppModal } from "src/components/Modals/InstallAppModal/InstallAppModal";
// import { LoginModal } from "src/components/Modals/LoginModal/LoginModal";
// import { RegisterModal } from "src/components/Modals/RegisterModal/RegisterModal";
import MenuItem from "@mui/material/MenuItem";
import ToggleColorMode from "src/components/shared/ToggleColorMode";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import routes from "src/application/routes";
import { scrollToSection } from "src/shared/utils/scrollTo";
import { useApplicationContext } from "src/application/store/Provider";
import { useDetectBrowserType } from "src/shared/hooks/useDetectBrowserType";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import { useState } from "react";

const ApplicationBar = () => {
  const navigate = useNavigate();
  const { isDesktop, isTablet, isMobile } = useDeviceSize();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInstallAppDialogOpen, setIsInstallAppDialogOpen] =
    useState<boolean>(false);
  const {
    store: {
      state: { themeMode },
      toggleThemeMode,
    },
  } = useApplicationContext();
  const { isInStandaloneMode } = useDetectBrowserType();

  // const {
  //   store: { handleToggleLoginModal },
  // } = useLoginModalContext();

  // const {
  //   store: { handleToggleRegisterModal },
  // } = useRegisterModalContext();

  // Add all the pages the will contain the AppBar
  const pagesMatch = {
    isHomePage: !!useMatch(routes.home),
    isCreatePage: !!useMatch(routes.create),
    isExplorePage: !!useMatch(routes.explore),
    isContactPage: !!useMatch(routes.contact),
    isViewStoryPage: !!useMatch(routes.story(":id")),
    isCheckoutPage: !!useMatch(routes.checkout),
    isPrivacyPolicy: !!useMatch(routes.privacyPolicy),
    isTermsOfService: !!useMatch(routes.termsAndConditions),
    isLandingPage: !!window.location.pathname.includes("bedtime-stories"),
  };
  const isAppBarVisible = Object.values(pagesMatch).every((p) => p === false);

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
        break;

      default:
        scrollToSection(sectionId);
    }
    setIsDrawerOpen(false);
  };

  const handleOnCreateClick = () => {
    navigate("/create");
  };

  const handleOnBackClick = () => navigate(-1);

  return (
    <>
      {!isAppBarVisible && (
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
                  <Box sx={{ display: { xs: "none", md: "flex" } }}>
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

                    {!isInStandaloneMode && (
                      <>
                        <Divider
                          sx={{ height: "30px" }}
                          orientation="vertical"
                        />

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
                      </>
                    )}

                    {pagesMatch.isHomePage && (
                      <>
                        {/* <MenuItem
                          onClick={handleOnMenuItemClick("features")}
                          sx={{ py: "6px", px: "12px" }}
                        >
                          <Typography variant="body2" color="text.primary">
                            Features
                          </Typography>
                        </MenuItem> */}

                        {/* <MenuItem
                          onClick={handleOnMenuItemClick("testimonials")}
                          sx={{ py: "6px", px: "12px" }}
                        >
                          <Typography variant="body2" color="text.primary">
                            Testimonials
                          </Typography>
                        </MenuItem> */}

                        {/* <MenuItem
                          onClick={handleOnMenuItemClick("highlights")}
                          sx={{ py: "6px", px: "12px" }}
                        >
                          <Typography variant="body2" color="text.primary">
                            Highlights
                          </Typography>
                        </MenuItem> */}

                        {/* <MenuItem
                          onClick={handleOnMenuItemClick("pricing")}
                          sx={{ py: "6px", px: "12px" }}
                        >
                          <Typography variant="body2" color="text.primary">
                            Pricing
                          </Typography>
                        </MenuItem> */}

                        {/* <MenuItem
                          onClick={handleOnMenuItemClick("faq")}
                          sx={{ py: "6px", px: "12px" }}
                        >
                          <Typography variant="body2" color="text.primary">
                            FAQ
                          </Typography>
                        </MenuItem>  */}
                      </>
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: { xs: "none", md: "flex" },
                      gap: 0.5,
                      alignItems: "center",
                    }}
                  >
                    <ToggleColorMode
                      mode={themeMode}
                      toggleColorMode={toggleThemeMode}
                    />
                    {/* <Button
                      color="primary"
                      variant="text"
                      size="small"
                      component="button"
                      onClick={handleToggleLoginModal}
                    >
                      Log in
                    </Button>

                    <Button
                      size="small"
                      color="primary"
                      variant="contained"
                      component="button"
                      onClick={handleToggleRegisterModal}
                    >
                      Register
                    </Button> */}
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

                  {(pagesMatch.isExplorePage || pagesMatch.isViewStoryPage) && (
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
                        onClick={handleOnCreateClick}
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

                      {pagesMatch.isHomePage && (
                        <>
                          {/* <MenuItem onClick={handleOnMenuItemClick("features")}>
                            Features
                          </MenuItem> */}

                          {/* <MenuItem
                              onClick={handleOnMenuItemClick("testimonials")}
                            >
                              Testimonials
                            </MenuItem>

                            <MenuItem
                              onClick={handleOnMenuItemClick("highlights")}
                            >
                              Highlights
                            </MenuItem> */}

                          {/* <MenuItem onClick={handleOnMenuItemClick("pricing")}>
                            Pricing
                          </MenuItem> */}

                          {/* <MenuItem onClick={handleOnMenuItemClick("faq")}>
                            FAQ
                          </MenuItem> */}
                        </>
                      )}

                      {/* <Divider />

                        <MenuItem>
                          <Button
                            color="primary"
                            variant="contained"
                            component="button"
                            onClick={handleToggleRegisterModal}
                            sx={{ width: "100%" }}
                          >
                            Register
                          </Button>
                        </MenuItem>

                        <MenuItem>
                          <Button
                            color="primary"
                            variant="outlined"
                            component="button"
                            sx={{ width: "100%" }}
                            onClick={handleToggleLoginModal}
                          >
                            Log in
                          </Button>
                        </MenuItem> */}
                    </Box>
                  </Drawer>
                </Box>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      )}

      {/* Modals */}
      {/* <LoginModal />
      <RegisterModal /> */}
      <InstallAppModal
        isInstallAppDialogOpen={isInstallAppDialogOpen}
        setIsInstallAppDialogOpen={setIsInstallAppDialogOpen}
      />
    </>
  );
};

export default ApplicationBar;
